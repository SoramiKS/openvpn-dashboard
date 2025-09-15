// app/api/profile/2fa/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { authenticator } from 'otplib'; // Pastikan otplib diimpor

// PERBAIKAN: Handler DELETE sekarang menerima Request
export async function DELETE(req: Request) { 
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    try {
        // 1. Ambil token dari body request
        const { token } = await req.json();
        if (!token) {
            return NextResponse.json({ message: '2FA token is required.' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });

        if (!user || !user.twoFactorSecret) {
            return NextResponse.json({ message: '2FA is not enabled for this user.' }, { status: 400 });
        }

        // 2. Verifikasi token yang diberikan
        const isValid = authenticator.check(token, user.twoFactorSecret);

        if (!isValid) {
            return NextResponse.json({ message: 'Invalid 2FA token.' }, { status: 400 });
        }

        // 3. Hanya jika token valid, nonaktifkan 2FA
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                twoFactorEnabled: false,
                twoFactorSecret: null,
            },
        });
        return NextResponse.json({ message: '2FA disabled successfully' });
    } catch (_error) {
        return NextResponse.json({ message: 'Failed to disable 2FA' }, { status: 500 });
    }
}