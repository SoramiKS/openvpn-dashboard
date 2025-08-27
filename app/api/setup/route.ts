// app/api/setup/route.ts
import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

export async function GET() {
    try {
        const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
        return NextResponse.json({ needsSetup: adminCount === 0 });
    } catch {
        return NextResponse.json({ message: 'Database error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
        if (adminCount > 0) {
            return NextResponse.json({ message: 'Setup has already been completed.' }, { status: 409 });
        }

        const body = await req.json();
        const { email, password, recaptchaToken } = body;

        if (!email || !password || !recaptchaToken) {
            return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({ message: 'Password must be at least 8 characters long.' }, { status: 400 });
        }
        
        // --- Verify reCAPTCHA Token ---
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
        const recaptchaResponse = await fetch(verifyUrl, { method: "POST" });
        const recaptchaData = await recaptchaResponse.json();

        if (!recaptchaData.success) {
            console.warn("reCAPTCHA verification failed:", recaptchaData['error-codes']);
            throw new Error("reCAPTCHA verification failed. You might be a bot.");
        }
        // --- End Verification ---

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await prisma.user.create({
            data: { email, password: hashedPassword, role: Role.ADMIN },
        });

        const { password: _, ...adminWithoutPassword } = newAdmin;
        return NextResponse.json(adminWithoutPassword, { status: 201 });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An internal server error occurred.';
        return NextResponse.json({ message }, { status: 500 });
    }
}
