import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Prisma, VpnCertificateStatus, ActionType, ActionStatus } from '@prisma/client';

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
            orderBy = { node: { name: sortOrder as Prisma.SortOrder } };
        } else {
            const allowedSortBy = ['username', 'status', 'isActive', 'expirationDate', 'createdAt', 'lastConnected', 'revocationDate'];
            if (allowedSortBy.includes(sortBy)) {
                orderBy = { [sortBy]: sortOrder as Prisma.SortOrder };
            }
        }

        if (nodeId && nodeId !== 'all') {
            where.nodeId = nodeId;
        }

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

        return NextResponse.json({ data: vpnUsers, total: totalUsers });
    } catch (error: unknown) {
        console.error('Error fetching VPN profiles:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// --- TAMBAHKAN BLOK INI ---
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const { username, nodeId }: { username: string; nodeId: string } = await req.json();
        const normalizedUsername = username.toLowerCase().replace(/[^a-z0-9.-]/g, '');

        if (!normalizedUsername || !nodeId) {
            return NextResponse.json({ message: 'Username and Node ID are required.' }, { status: 400 });
        }

        const existingVpnUser = await prisma.vpnUser.findUnique({
            where: { username: normalizedUsername },
        });
        if (existingVpnUser) {
            return NextResponse.json({ message: `VPN profile for '${username}' already exists.` }, { status: 409 });
        }

        const targetNode = await prisma.node.findUnique({ where: { id: nodeId } });
        if (!targetNode) {
            return NextResponse.json({ message: 'Node not found' }, { status: 404 });
        }

        const actionLog = await prisma.actionLog.create({
            data: {
                action: ActionType.CREATE_USER,
                nodeId: nodeId,
                details: normalizedUsername,
                status: ActionStatus.PENDING,
                initiatorId: session.user.id,
                nodeNameSnapshot: targetNode.name,
            },
        });

        return NextResponse.json({ message: 'VPN profile creation request submitted.', actionLogId: actionLog.id }, { status: 202 });
    } catch (error: unknown) {
        console.error('Error submitting VPN profile creation request:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
