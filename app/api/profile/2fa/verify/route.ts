// app/api/profile/2fa/verify/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { authenticator } from 'otplib'; // Ganti import

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { token } = await req.json();
        if (!token) {
            return NextResponse.json({ message: 'Token is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: session.user.id }});

        if (!user?.twoFactorSecret) {
            return NextResponse.json({ message: '2FA is not set up for this user' }, { status: 400 });
        }
        
        // Verifikasi token menggunakan otplib
        const isValid = authenticator.check(token, user.twoFactorSecret);

        if (!isValid) {
            return NextResponse.json({ message: 'Invalid 2FA token' }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { twoFactorEnabled: true },
        });

        return NextResponse.json({ message: '2FA enabled successfully!' });
    } catch (_error) {
        console.error('2FA verification error:', _error);
        return NextResponse.json({ message: 'Failed to verify 2FA token' }, { status: 500 });
    }
}