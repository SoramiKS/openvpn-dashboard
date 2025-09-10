// app/api/users/[id]/route.ts
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

// PATCH (update user) - Diperbarui
export const PATCH: ApiRouteHandler = async (req, context) => {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Access denied." }, { status: 403 });
  }

  try {
    const body = await req.json();
    // 1. Membaca field baru: currentPassword dan newPassword
    const { role, currentPassword, newPassword } = body;

    const updateData: { role?: Role; password?: string } = {};

    // Logika untuk update role (tetap sama)
    if (role && Object.values(Role).includes(role)) {
      updateData.role = role;
    }

    // 2. Logika baru untuk update password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: "Current password is required." },
          { status: 400 }
        );
      }
      if (newPassword.length < 8) {
        return NextResponse.json(
          { message: "New password must be at least 8 characters long." },
          { status: 400 }
        );
      }

      // Ambil data user dari DB untuk verifikasi password
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return NextResponse.json({ message: "User not found." }, { status: 404 });
      }

      // Bandingkan currentPassword dengan password di DB
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Incorrect current password." },
          { status: 400 }
        );
      }

      // Jika valid, hash password baru untuk disimpan
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Jika tidak ada data yang akan diupdate, kirim response
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No changes detected." },
        { status: 200 }
      );
    }

    // Lakukan update ke database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { message: "Failed to update user." },
      { status: 500 }
    );
  }
};

// DELETE (remove user) - Tidak ada perubahan
export const DELETE: ApiRouteHandler = async (req, context) => {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Access denied." }, { status: 403 });
  }

  if (session.user.id === id) {
    return NextResponse.json(
      { message: "You cannot delete your own account." },
      { status: 400 }
    );
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json(
      { message: "User successfully deleted." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { message: "Failed to delete user." },
      { status: 500 }
    );
  }
};