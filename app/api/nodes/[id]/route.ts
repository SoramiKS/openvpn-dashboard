import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Prisma, ActionType, NodeStatus } from "@prisma/client";

async function checkAdminSession() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
  }
  return null;
}

// --- Handler untuk mengedit/memperbarui Node ---
export async function PUT(request: NextRequest) {
  const denied = await checkAdminSession();
  if (denied) return denied;

  try {
    // PERBAIKAN: Ambil ID dari URL, bukan dari argumen kedua
    const nodeId = request.nextUrl.pathname.split("/").pop();
    if (!nodeId) {
      return NextResponse.json({ message: "ID Node tidak ditemukan di URL." }, { status: 400 });
    }

    const body = await request.json();
    const { name, ip, location, snmpCommunity } = body;

    if (!name?.trim() || !ip?.trim()) {
      return NextResponse.json({ message: "Nama dan IP node wajib diisi." }, { status: 400 });
    }

    const updatedNode = await prisma.node.update({
      where: { id: nodeId },
      data: { name, ip, location, snmpCommunity },
    });

    return NextResponse.json({ message: "Node berhasil diperbarui.", node: updatedNode }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") return NextResponse.json({ message: "Node tidak ditemukan." }, { status: 404 });
      if (error.code === "P2002") return NextResponse.json({ message: "Node dengan nama atau IP tersebut sudah ada." }, { status: 409 });
    }
    return NextResponse.json({ message: "Terjadi kesalahan internal pada server." }, { status: 500 });
  }
}

// --- Handler untuk menghapus Node (Soft Delete) ---
export async function DELETE(request: NextRequest) {
  const denied = await checkAdminSession();
  if (denied) return denied;

  try {
    // PERBAIKAN: Ambil ID dari URL, bukan dari argumen kedua
    const nodeIdToDelete = request.nextUrl.pathname.split("/").pop();
    if (!nodeIdToDelete) {
        return NextResponse.json({ message: "ID Node tidak ditemukan di URL." }, { status: 400 });
    }

    const node = await prisma.node.findUnique({ where: { id: nodeIdToDelete } });

    if (!node) {
      return NextResponse.json({ message: "Node tidak ditemukan." }, { status: 404 });
    }

    // --- SMART DELETE ---
    if (node.status === NodeStatus.ONLINE) {
      await prisma.actionLog.create({
        data: {
          nodeId: nodeIdToDelete,
          action: ActionType.DECOMMISSION_AGENT,
          status: "PENDING",
          details: `Perintah penghapusan mandiri dikirim ke agen di node ${node.name}.`,
        },
      });
      const updatedNode = await prisma.node.update({
        where: { id: nodeIdToDelete },
        data: { status: NodeStatus.DELETING },
      });
      return NextResponse.json({ message: `Perintah penghapusan untuk node ${node.name} berhasil dikirim.`, node: updatedNode }, { status: 200 });
    } else {
      await prisma.node.delete({ where: { id: nodeIdToDelete } });
      return NextResponse.json({ message: `Node ${node.name} yang tidak aktif berhasil dihapus secara permanen.` }, { status: 200 });
    }
  } catch (error: unknown) {
    console.error("Error saat menghapus node:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Node tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ message: "Terjadi kesalahan internal pada server." }, { status: 500 });
  }
}