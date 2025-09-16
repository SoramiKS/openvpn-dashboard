import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Fungsi helper untuk mengubah data menjadi baris CSV
const toCsvRow = (arr: (string | number | null | undefined | bigint)[]) => {
    return arr.map(val => {
        const str = String(val ?? '');
        // Escape quotes by doubling them
        if (str.includes('"') || str.includes(',') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    }).join(',') + '\n';
};

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

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

        const logs = await prisma.vpnActivityLog.findMany({
            where: whereClause,
            orderBy: { timestamp: 'desc' },
            include: { node: { select: { name: true } } },
        });

        let csvContent = toCsvRow(["Timestamp", "Node", "Username", "Action", "Public IP", "VPN IP", "Data Received (Bytes)", "Data Sent (Bytes)"]);

        logs.forEach(log => {
            csvContent += toCsvRow([
                new Date(log.timestamp).toLocaleString(),
                log.node.name,
                log.username,
                log.action,
                log.publicIp,
                log.vpnIp,
                log.bytesReceived?.toString(),
                log.bytesSent?.toString(),
            ]);
        });

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="vpn-activity-logs-${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });

    } catch (error) {
        return NextResponse.json({ message: 'Failed to generate CSV file.' }, { status: 500 });
    }
}