import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { Prisma, ActionType } from '@prisma/client';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '20');
        const skip = (page - 1) * pageSize;
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        const nodeId = searchParams.get('nodeId');
        const action = searchParams.get('action');
        const whereClause: Prisma.ActionLogWhereInput = {};

        if (nodeId && nodeId !== 'all') whereClause.nodeId = nodeId;
        if (action && action !== 'all') whereClause.action = action as ActionType;

        const allowedSortBy = ['createdAt', 'action', 'status'];
        const orderBy: Prisma.ActionLogOrderByWithRelationInput =
            allowedSortBy.includes(sortBy) ? { [sortBy]: sortOrder } : { createdAt: 'desc' };

        const [actionLogs, totalLogs] = await prisma.$transaction([
            prisma.actionLog.findMany({
                where: whereClause,
                skip,
                take: pageSize,
                orderBy,
                include: {
                    node: { select: { name: true } },
                    vpnUser: { select: { username: true } },
                    initiator: { select: { email: true } },
                },
            }),
            prisma.actionLog.count({ where: whereClause }),
        ]);

        return NextResponse.json({ data: actionLogs, total: totalLogs });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}