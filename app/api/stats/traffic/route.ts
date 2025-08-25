import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { subHours } from 'date-fns';

export async function GET() {
    try {
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