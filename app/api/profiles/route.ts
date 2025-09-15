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

    const statusGroup = searchParams.get('statusGroup');
    const searchTerm = searchParams.get('searchTerm') || '';
    const nodeId = searchParams.get('nodeId');
    const specificStatus = searchParams.get('status');

    const statuses = getStatusGroup(statusGroup);

    // --- PERBAIKAN UTAMA ADA DI SINI ---
    // DIHAPUS: Blok 'if' yang menyebabkan error 400 Bad Request
    // if (statuses.length === 0 && !specificStatus) {
    //   return NextResponse.json({ message: 'Invalid statusGroup' }, { status: 400 });
    // }

    const where: Prisma.VpnUserWhereInput = {
      username: {
        contains: searchTerm,
        mode: 'insensitive',
        not: {
            startsWith: "server_"
        }
      },
    };

    if (nodeId && nodeId !== 'all') {
      where.nodeId = nodeId;
    }

    // DIUBAH: Logika filter status sekarang opsional
    if (specificStatus && specificStatus !== 'all') {
      where.status = specificStatus as VpnCertificateStatus;
    } else if (statuses.length > 0) {
      // Hanya tambahkan filter status jika statusGroup diberikan
      where.status = {
        in: statuses,
      };
    }
    // Jika tidak ada 'specificStatus' atau 'statusGroup', maka tidak ada filter status,
    // yang berarti Prisma akan mengambil SEMUA profil. Ini yang kita inginkan untuk dashboard.

    const [vpnUsers, totalUsers] = await prisma.$transaction([
      prisma.vpnUser.findMany({
        where,
        // DIUBAH: Jika tidak ada statusGroup, jangan lakukan pagination (ambil semua data untuk dashboard)
        ...(statusGroup && { skip, take: pageSize }),
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
        orderBy: { username: 'asc' },
      }),
      prisma.vpnUser.count({ where }),
    ]);

    return NextResponse.json({ data: vpnUsers, total: totalUsers }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching VPN profiles:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}