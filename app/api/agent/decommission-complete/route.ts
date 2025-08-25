import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { serverId } = body;

        if (!serverId) {
            return NextResponse.json({ message: 'Server ID is required.' }, { status: 400 });
        }

        // --- PERBAIKAN: Ganti 'update' menjadi 'delete' ---
        // Ini akan menghapus node dan semua data terkait (log, profil) secara permanen
        await prisma.node.delete({
            where: { id: serverId },
        });
        // --- AKHIR PERBAIKAN ---

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