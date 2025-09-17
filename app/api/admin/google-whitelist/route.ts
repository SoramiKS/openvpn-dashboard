// app/api/admin/google-whitelist/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { WhitelistType } from '@prisma/client';

// GET: Mengambil semua entri whitelist
export async function GET() {
    // ... (logika GET tetap sama, hanya ganti model)
    const entries = await prisma.googleWhitelist.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(entries);
}

// POST: Menambahkan entri baru (domain atau email)
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN' || !session.user.id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const { value, type } = await req.json();
        if (!value || !type || !Object.values(WhitelistType).includes(type)) {
            return NextResponse.json({ message: 'Invalid value or type.' }, { status: 400 });
        }
        
        const newEntry = await prisma.googleWhitelist.create({
            data: {
                value: value.toLowerCase(),
                type,
                addedById: session.user.id,
            },
        });
        return NextResponse.json(newEntry, { status: 201 });
    } catch (error) {
        console.error("Failed to create google whitelist entry:", error);
        return NextResponse.json({ message: 'Value already exists.' }, { status: 409 });
    }
}