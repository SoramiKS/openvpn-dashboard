// app/api/profiles/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Prisma, VpnCertificateStatus } from '@prisma/client';

const getStatusGroup = (group: string | null) => {
    if (group === 'active') {
        return [VpnCertificateStatus.VALID, VpnCertificateStatus.PENDING];
    }
    if (group === 'revoked') {
        return [VpnCertificateStatus.REVOKED, VpnCertificateStatus.EXPIRED, VpnCertificateStatus.UNKNOWN];
    }
    return [];
};

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');
        const skip = (page - 1) * pageSize;

        const sortBy = searchParams.get('sortBy') || 'username';
        const sortOrder = searchParams.get('sortOrder') || 'asc';

        const statusGroup = searchParams.get('statusGroup');
        const searchTerm = searchParams.get('searchTerm') || '';
        const nodeId = searchParams.get('nodeId');
        const specificStatus = searchParams.get('status');

        const statuses = getStatusGroup(statusGroup);

        const where: Prisma.VpnUserWhereInput = {
            username: {
                contains: searchTerm,
                mode: 'insensitive',
                not: {
                    startsWith: "server_"
                }
            },
        };

        let orderBy: Prisma.VpnUserOrderByWithRelationInput = {};
        if (sortBy === 'node.name') {
            // Kasus khusus jika sorting berdasarkan nama node (relasi)
            orderBy = { node: { name: sortOrder as Prisma.SortOrder } };
        } else {
            // Daftar kolom yang diizinkan untuk sorting untuk keamanan
            const allowedSortBy = ['username', 'status', 'isActive', 'expirationDate', 'createdAt', 'lastConnected', 'revocationDate'];
            if (allowedSortBy.includes(sortBy)) {
                orderBy = { [sortBy]: sortOrder as Prisma.SortOrder };
            }
        }

        if (nodeId && nodeId !== 'all') {
            where.nodeId = nodeId;
        }

        // DIUBAH: Logika filter status sekarang opsional
        if (specificStatus && specificStatus !== 'all') {
            where.status = specificStatus as VpnCertificateStatus;
        } else if (statuses.length > 0) {
            where.status = {
                in: statuses,
            };
        }

        const [vpnUsers, totalUsers] = await prisma.$transaction([
            prisma.vpnUser.findMany({
                where,
                ...(statusGroup && { skip, take: pageSize }),
                orderBy,
                select: {
                    // ... (select tidak berubah)
                    id: true,
                    username: true,
                    nodeId: true,
                    node: { select: { name: true, status: true } },
                    status: true,
                    expirationDate: true,
                    revocationDate: true,
                    ovpnFileContent: true,
                    isActive: true,
                    lastConnected: true,
                    createdAt: true,
                },
            }),
            prisma.vpnUser.count({ where }),
        ]);

        return NextResponse.json({ data: vpnUsers, total: totalUsers }, { status: 200 });
    } catch (error: unknown) {
        console.error('Error fetching VPN profiles:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}