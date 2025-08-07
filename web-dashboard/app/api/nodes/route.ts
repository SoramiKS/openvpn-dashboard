// app/api/nodes/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Menggunakan authOptions dari lib
import { NodeStatus, Node } from "@/lib/generated/prisma"; // Import Node type

// Definisikan ambang batas waktu untuk menganggap node offline (misal: 5 menit)
const OFFLINE_THRESHOLD_MS = 5 * 60 * 1000; // 5 menit dalam milidetik

// Definisikan tipe yang sesuai dengan field yang dipilih dari Prisma
type SelectedNodeFields = {
  id: string;
  name: string;
  ip: string;
  location: string | null;
  cpuUsage: number;
  ramUsage: number;
  serviceStatus: string;
  lastSeen: Date | null;
  status: NodeStatus;
  createdAt: Date;
  updatedAt: Date;
  // 'token' tidak termasuk di sini karena tidak dipilih dalam findMany
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized: Not logged in.' }, { status: 401 });
    }

    // Prisma akan mengembalikan objek dengan field yang dipilih saja
    const nodes = await prisma.node.findMany({
      select: {
        id: true,
        name: true,
        ip: true,
        location: true,
        cpuUsage: true,
        ramUsage: true,
        serviceStatus: true,
        lastSeen: true, // Pastikan lastSeen diambil
        status: true, // Status terakhir yang dilaporkan agen
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: 'asc' },
    });

    // Proses node untuk menentukan status aktual berdasarkan lastSeen
    // Anotasi tipe dengan SelectedNodeFields untuk mencocokkan field yang dipilih
    const processedNodes = nodes.map((node: SelectedNodeFields) => {
      const now = new Date();
      let actualStatus = node.status; // Mulai dengan status yang dilaporkan agen

      // Periksa apakah node.lastSeen BUKAN null sebelum memanggil getTime()
      if (node.lastSeen) {
        const timeSinceLastSeen = now.getTime() - node.lastSeen.getTime();
        if (timeSinceLastSeen > OFFLINE_THRESHOLD_MS) {
          actualStatus = NodeStatus.OFFLINE; // Paksa status menjadi OFFLINE
        }
      } else {
        // Jika lastSeen null, anggap UNKNOWN atau OFFLINE
        actualStatus = NodeStatus.UNKNOWN; // Atau NodeStatus.OFFLINE, sesuai preferensi
      }

      return {
        ...node,
        status: actualStatus, // Gunakan status yang sudah diproses
      };
    });

    return NextResponse.json(processedNodes, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching nodes:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    // await prisma.$disconnect(); // Tidak perlu disconnect
  }
}
