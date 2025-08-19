import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

export async function GET() {
    try {
        const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
        return NextResponse.json({ needsSetup: adminCount === 0 });
    } catch (error) {
        return NextResponse.json({ message: 'Database error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
        if (adminCount > 0) {
            return NextResponse.json({ message: 'Setup sudah selesai.' }, { status: 409 });
        }

        const body = await req.json();
        const { email, password, recaptchaToken } = body;

        if (!email || !password || !recaptchaToken) {
            return NextResponse.json({ message: 'Semua kolom wajib diisi.' }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({ message: 'Password minimal harus 8 karakter.' }, { status: 400 });
        }
        
        // --- Verifikasi reCAPTCHA Token ---
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
        const recaptchaResponse = await fetch(verifyUrl, { method: "POST" });
        const recaptchaData = await recaptchaResponse.json();

        if (!recaptchaData.success) {
            console.warn("Verifikasi reCAPTCHA gagal:", recaptchaData['error-codes']);
            throw new Error("Verifikasi reCAPTCHA gagal. Anda mungkin bot.");
        }
        // --- Akhir Verifikasi ---

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await prisma.user.create({
            data: { email, password: hashedPassword, role: Role.ADMIN },
        });

        const { password: _, ...adminWithoutPassword } = newAdmin;
        return NextResponse.json(adminWithoutPassword, { status: 201 });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Terjadi kesalahan pada server.';
        return NextResponse.json({ message }, { status: 500 });
    }
}