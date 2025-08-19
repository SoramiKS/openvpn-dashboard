import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/authOptions';
import { Role } from '@prisma/client';

// --- TAMBAHKAN FUNGSI GET INI ---
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Akses Ditolak' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    // Ambil parameter filter
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role');

    // Buat klausa 'where' untuk filter
    const whereClause = {
        AND: [
            { email: { contains: search, mode: 'insensitive' as const } },
            role && role !== 'all' ? { role: role as Role } : {},
        ],
    };

    try {
        const [users, totalUsers] = await prisma.$transaction([
            prisma.user.findMany({
                where: whereClause,
                select: { // Hanya pilih data yang aman, jangan sertakan password
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where: whereClause }),
        ]);

        return NextResponse.json({ data: users, total: totalUsers });

    } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
    }
}


// Fungsi POST yang sudah ada sebelumnya
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
 
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Akses Ditolak: Anda bukan admin.' }, { status: 403 });
    }
    try {
        const body = await req.json();
        const { email, password, role } = body;
        // ... (kode validasi tidak berubah)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
            },
            // Perbaikan: Pilih field yang akan dikembalikan
            select: { id: true, email: true, role: true, createdAt: true, updatedAt: true }
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Error saat membuat pengguna:", error);
        return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
    }
}