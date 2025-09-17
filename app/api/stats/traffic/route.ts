import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { subHours } from 'date-fns';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  try {
    // --- TAMBAHKAN BLOK INI UNTUK KEAMANAN ---
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    // --- AKHIR BLOK TAMBAHAN ---

    const twentyFourHoursAgo = subHours(new Date(), 24);

    const trafficData = await prisma.vpnActivityLog.aggregate({
      _sum: {
        bytesSent: true,
        bytesReceived: true,
      },
      where: {
        action: 'DISCONNECT',
        timestamp: {
          gte: twentyFourHoursAgo,
        },
      },
    });

    return NextResponse.json({
      totalSent: trafficData._sum.bytesSent?.toString() || '0',
      totalReceived: trafficData._sum.bytesReceived?.toString() || '0',
    });
  } catch (error) {
    console.error("Failed to fetch traffic stats:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
