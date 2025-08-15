// app/api/activity-logs/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const activityLogs = await prisma.vpnActivityLog.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        node: {
          select: { name: true },
        },
      },
      take: 200,
    });

    // BARU: Konversi BigInt menjadi String agar bisa di-serialize oleh JSON
    const serializableLogs = activityLogs.map(log => ({
      ...log,
      bytesReceived: log.bytesReceived ? log.bytesReceived.toString() : null,
      bytesSent: log.bytesSent ? log.bytesSent.toString() : null,
    }));

    // MODIFIKASI: Kirim data yang sudah aman untuk di-serialize
    return NextResponse.json(serializableLogs, { status: 200 });

  } catch (error: unknown) {
    console.error('Error fetching VPN activity logs:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal server error', error: errorMessage }, { status: 500 });
  }
}