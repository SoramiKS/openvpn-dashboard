import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const skip = (page - 1) * pageSize;
    const sortBy = searchParams.get('sortBy') || 'timestamp';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const nodeId = searchParams.get('nodeId');
    const action = searchParams.get('action');
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');

    const whereClause: Prisma.VpnActivityLogWhereInput = {};

    if (nodeId && nodeId !== 'all') whereClause.nodeId = nodeId;
    if (action && action !== 'all') whereClause.action = action;

    const timestampFilter: Prisma.DateTimeFilter = {};
    if (startDateStr) timestampFilter.gte = new Date(startDateStr);
    if (endDateStr) {
      const endDate = new Date(endDateStr);
      endDate.setHours(23, 59, 59, 999);
      timestampFilter.lte = endDate;
    }
    if (Object.keys(timestampFilter).length > 0) {
      whereClause.timestamp = timestampFilter;
    }

    const allowedSortBy = ['timestamp', 'action', 'username', 'publicIp', 'vpnIp', 'bytesReceived', 'bytesSent'];
    const orderBy: Prisma.VpnActivityLogOrderByWithRelationInput =
      allowedSortBy.includes(sortBy) ? { [sortBy]: sortOrder } : { timestamp: 'desc' };

    const [activityLogs, totalLogs] = await prisma.$transaction([
      prisma.vpnActivityLog.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy,
        include: { node: { select: { name: true } } },
      }),
      prisma.vpnActivityLog.count({ where: whereClause }),
    ]);

    const serializableLogs = activityLogs.map(log => ({
      ...log,
      bytesReceived: log.bytesReceived ? log.bytesReceived.toString() : null,
      bytesSent: log.bytesSent ? log.bytesSent.toString() : null,
    }));

    return NextResponse.json({ data: serializableLogs, total: totalLogs });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal server error', error: errorMessage }, { status: 500 });
  }
}