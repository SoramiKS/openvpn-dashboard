import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { ActionType } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const skip = (page - 1) * pageSize;

    // --- BARU: Ambil parameter filter dari URL ---
    const nodeId = searchParams.get('nodeId');
    const action = searchParams.get('action');

    // --- BARU: Bangun klausa 'where' untuk Prisma ---
    const whereClause: any = {};
    if (nodeId && nodeId !== 'all') {
      whereClause.nodeId = nodeId;
    }
    if (action && action !== 'all') {
      whereClause.action = action as ActionType;
    }

    const [actionLogs, totalLogs] = await prisma.$transaction([
      prisma.actionLog.findMany({
        where: whereClause, // Terapkan filter di sini
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          node: { select: { name: true } },
          vpnUser: { select: { username: true } },
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