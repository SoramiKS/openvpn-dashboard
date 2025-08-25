import { ActionStatus } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server'; // Gunakan NextRequest untuk konsistensi
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) { // Gunakan NextRequest
  const authHeader = req.headers.get('Authorization');
  const agentApiKey = process.env.AGENT_API_KEY;

  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== agentApiKey) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get('serverId');

  if (!serverId) {
    return NextResponse.json({ message: 'Missing serverId query parameter' }, { status: 400 });
  }

  try {
    const pendingActions = await prisma.actionLog.findMany({
      where: {
        nodeId: serverId,
        status: ActionStatus.PENDING,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        action: true,
        vpnUserId: true,
        details: true,
      }
    });

    return NextResponse.json(pendingActions, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching action logs:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
    // --- PERBAIKAN DI SINI ---
    // Tambahkan respons default jika error bukan instance dari Error
    return NextResponse.json({ message: 'An unknown internal server error occurred' }, { status: 500 });
  }
}