// app/api/activity-logs/route.ts
import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const skip = (page - 1) * pageSize;

    const [activityLogs, totalLogs] = await prisma.$transaction([
        prisma.vpnActivityLog.findMany({
            skip,
            take: pageSize,
            orderBy: { timestamp: 'desc' },
            include: {
                node: { select: { name: true } },
            },
        }),
        prisma.vpnActivityLog.count(),
    ]);

    const serializableLogs = activityLogs.map(log => ({
      ...log,
      bytesReceived: log.bytesReceived ? log.bytesReceived.toString() : null,
      bytesSent: log.bytesSent ? log.bytesSent.toString() : null,
    }));

    return NextResponse.json({ data: serializableLogs, total: totalLogs }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal server error', error: errorMessage }, { status: 500 });
  }
}