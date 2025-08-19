import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

// --- FUNGSI GET: Untuk memeriksa apakah setup diperlukan ---
export async function GET() {
    try {
        const adminCount = await prisma.user.count({
            where: { role: 'ADMIN' },
        });

        // Jika tidak ada admin, setup diperlukan
        if (adminCount === 0) {
            return NextResponse.json({ needsSetup: true });
        }

        return NextResponse.json({ needsSetup: false });
    } catch (error) {
        return NextResponse.json({ message: 'Database error', error }, { status: 500 });
    }
}


// --- FUNGSI POST: Untuk membuat admin pertama ---
export async function POST(req: NextRequest) {
    try {
        // Keamanan kritis: Cek lagi sebelum membuat.
        // Ini mencegah seseorang membuat admin kedua melalui endpoint ini.
        const adminCount = await prisma.user.count({
            where: { role: 'ADMIN' },
        });

        if (adminCount > 0) {
            return NextResponse.json({ message: 'Setup sudah selesai. Admin sudah ada.' }, { status: 409 }); // 409 Conflict
        }

        const body = await req.json();
        const { email, password } = body;

        if (!email || !password || password.length < 8) {
            return NextResponse.json({ message: 'Email dan password (minimal 8 karakter) wajib diisi.' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: Role.ADMIN, // Langsung set sebagai ADMIN
            },
        });

        const { password: _, ...adminWithoutPassword } = newAdmin;
        return NextResponse.json(adminWithoutPassword, { status: 201 });

    } catch (error) {
        console.error("Gagal membuat admin pertama:", error);
        return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
    }
}