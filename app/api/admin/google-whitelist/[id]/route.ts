// app/api/admin/google-whitelist/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Prisma } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = context.params;

    await prisma.googleWhitelist.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Whitelist entry deleted.' });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { message: 'Whitelist entry not found.' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to delete whitelist entry.' },
      { status: 500 }
    );
  }
}
