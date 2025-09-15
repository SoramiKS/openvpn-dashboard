// app/api/profile/2fa/generate/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { authenticator } from 'otplib';
// DIHAPUS: qrcode tidak lagi dibutuhkan di backend
// import qrcode from 'qrcode'; 

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session.user.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    try {
        const appName = 'OpenVPN Dashboard';
        const email = session.user.email;
        
        const secret = authenticator.generateSecret();
        
        // Buat URI otentikasi
        const uri = authenticator.keyuri(email, appName, secret);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { twoFactorSecret: secret },
        });
        
        // PERBAIKAN: Kirim URI mentahnya, bukan data gambar
        return NextResponse.json({ otpauthUri: uri });

    } catch (error) {
        console.error("Failed to generate 2FA secret:", error);
        return NextResponse.json({ message: 'Failed to generate 2FA secret' }, { status: 500 });
    }
}