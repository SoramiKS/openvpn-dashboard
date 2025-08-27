// app/api/agent/decommission-complete/route.ts
import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { Prisma, ActionType, ActionStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { serverId } = body;

        if (!serverId) {
            return NextResponse.json({ message: 'Server ID is required.' }, { status: 400 });
        }

        // Gunakan transaksi untuk memastikan kedua aksi berhasil atau tidak sama sekali
        await prisma.$transaction(async (tx) => {
            // 1. Cari log DECOMMISSION_AGENT yang relevan dan masih PENDING
            const decommissionLog = await tx.actionLog.findFirst({
                where: {
                    nodeId: serverId,
                    action: ActionType.DECOMMISSION_AGENT,
                    status: ActionStatus.PENDING
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            // 2. Jika ditemukan, perbarui statusnya menjadi COMPLETED
            if (decommissionLog) {
                await tx.actionLog.update({
                    where: { id: decommissionLog.id },
                    data: {
                        status: ActionStatus.COMPLETED,
                        message: "Agent confirmed decommission and has been removed.",
                        executedAt: new Date()
                    }
                });
            }

            // 3. Lanjutkan untuk menghapus node secara permanen
            await tx.node.delete({
                where: { id: serverId },
            });
        });

        console.log(`Node ${serverId} has been successfully decommissioned and hard-deleted.`);
        return NextResponse.json({ message: 'Decommission confirmed and node deleted.' });

    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            console.log(`Received decommission signal for an already deleted node. Ignoring.`);
            return NextResponse.json({ message: 'Node already deleted.' });
        }
        console.error("Error during decommission confirmation:", error);
        return NextResponse.json({ message: 'Server error.' }, { status: 500 });
    }
}