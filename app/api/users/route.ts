import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/authOptions';
import { Role } from '@prisma/client';

// --- GET USERS (with pagination + filters) ---
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Access denied.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    // Filter params
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role');

    // Build where clause for filters
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
                select: { // only safe fields, exclude password
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
        console.error("Failed to fetch users:", error);
        return NextResponse.json({ message: 'Server error occurred.' }, { status: 500 });
    }
}


// --- CREATE NEW USER ---
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
 
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Access denied: You are not an admin.' }, { status: 403 });
    }
    try {
        const body = await req.json();
        const { email, password, role } = body;

        // TODO: add validation if needed
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
            },
            // Only return safe fields
            select: { id: true, email: true, role: true, createdAt: true, updatedAt: true }
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: 'Server error occurred.' }, { status: 500 });
    }
}
