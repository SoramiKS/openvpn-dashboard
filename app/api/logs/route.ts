// app/api/logs/route.ts
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';
import { ActionType } from '@prisma/client'; // Import ActionType

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    // --- MODIFIKASI: Ambil parameter filter ---
    const nodeId = searchParams.get('nodeId');
    const action = searchParams.get('action');

    // --- MODIFIKASI: Buat klausa 'where' dinamis ---
    const whereClause: Prisma.ActionLogWhereInput = {};
    if (nodeId && nodeId !== 'all') {
      whereClause.nodeId = nodeId;
    }
    if (action && action !== 'all') {
      // Pastikan action adalah nilai yang valid dari enum ActionType
      if (Object.values(ActionType).includes(action as ActionType)) {
        whereClause.action = action as ActionType;
      }
    }

    const [actionLogs, totalLogs] = await prisma.$transaction([
        prisma.actionLog.findMany({
            where: whereClause, // Gunakan klausa where yang baru
            skip,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            include: {
                node: { select: { name: true } },
                vpnUser: { select: { username: true } },
                initiator: { select: { email: true } },
            },
        }),
        prisma.actionLog.count({ where: whereClause }), // Hitung total berdasarkan filter
    ]);

    return NextResponse.json({ data: actionLogs, total: totalLogs }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal server error', error: errorMessage }, { status: 500 });
  }
}