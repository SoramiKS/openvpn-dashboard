import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { Prisma } from '@prisma/client'; // 1. Tambahkan import ini

export async function POST(req: NextRequest) {
    // Anda bisa menambahkan verifikasi API Key di sini jika diperlukan
    // const apiKey = req.headers.get('Authorization')?.split(' ')[1];
    // if (!apiKey) {
    //     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    try {
        const body = await req.json();
        const { serverId } = body;

        if (!serverId) {
            return NextResponse.json({ message: 'Server ID is required.' }, { status: 400 });
        }

        // Ini adalah langkah final: Hard delete Node dari database
        await prisma.node.delete({
            where: { id: serverId },
        });

        console.log(`Node ${serverId} has been successfully decommissioned and deleted.`);
        return NextResponse.json({ message: 'Decommission confirmed and node deleted.' });

    } catch (error: unknown) { // 2. 'error' di sini bertipe 'unknown'
        
        // 3. Periksa apakah error adalah error spesifik dari Prisma
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Jika node sudah dihapus (misalnya karena race condition), anggap berhasil
            if (error.code === 'P2025') {
                console.log(`Node ${(await req.json()).serverId} was already deleted.`);
                return NextResponse.json({ message: 'Node already deleted.' });
            }
        }

        console.error("Error during decommission confirmation:", error);
        return NextResponse.json({ message: 'Server error.' }, { status: 500 });
    }
}