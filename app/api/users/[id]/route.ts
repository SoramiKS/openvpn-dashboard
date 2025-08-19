import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";

// Define handler type for Next.js 15
type ApiRouteHandler = (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => Promise<NextResponse>;

// PATCH (update user)
export const PATCH: ApiRouteHandler = async (req, context) => {
  const { id } = await context.params; // ⬅️ wajib pakai await
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Akses Ditolak" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { role, password } = body;

    const updateData: { role?: Role; password?: string } = {};
    if (role && Object.values(Role).includes(role)) {
      updateData.role = role;
    }
    if (password && password.length >= 8) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, role: true, createdAt: true, updatedAt: true }
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Gagal update user:", error);
    return NextResponse.json({ message: "Gagal update user." }, { status: 500 });
  }
};

// DELETE (hapus user)
export const DELETE: ApiRouteHandler = async (req, context) => {
  const { id } = await context.params; // ⬅️ ini juga wajib await
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Akses Ditolak" }, { status: 403 });
  }

  if (session.user.id === id) {
    return NextResponse.json({ message: "Anda tidak bisa menghapus akun Anda sendiri." }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "Pengguna berhasil dihapus." }, { status: 200 });
  } catch (error) {
    console.error("Gagal hapus user:", error);
    return NextResponse.json({ message: "Gagal hapus user." }, { status: 500 });
  }
};
