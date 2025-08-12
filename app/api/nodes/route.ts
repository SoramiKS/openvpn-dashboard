// app/api/nodes/route.ts
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NodeStatus } from "@/lib/generated/prisma";
import { randomBytes } from 'crypto';
import { Prisma } from "@prisma/client"; // Import Prisma for error types

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
};

// --- GET Request (Fetch all Nodes with Stale check) ---
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized: Not logged in.' }, { status: 401 });
    }

    const nodes = await prisma.node.findMany({
      select: {
        id: true,
        name: true,
        ip: true,
        location: true,
        cpuUsage: true,
        ramUsage: true,
        serviceStatus: true,
        lastSeen: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: 'asc' },
    });

    const processedNodes = nodes.map((node: SelectedNodeFields) => {
      const now = new Date();
      let actualStatus = node.status;

      if (node.lastSeen) {
        const timeSinceLastSeen = now.getTime() - node.lastSeen.getTime();
        if (timeSinceLastSeen > OFFLINE_THRESHOLD_MS) {
          actualStatus = NodeStatus.OFFLINE;
        }
      } else {
        actualStatus = NodeStatus.UNKNOWN;
      }

      return {
        ...node,
        status: actualStatus,
      };
    });

    return NextResponse.json(processedNodes, { status: 200 });
  } catch (error: unknown) { // Use 'unknown' for better type safety
    console.error('Error fetching nodes:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
    // Fallback for non-Error types
    return NextResponse.json({ message: 'An unknown internal server error occurred' }, { status: 500 });
  }
}

// --- POST Request (Create a new Node) ---
interface CreateNodeRequestBody {
  name: string;
  ip: string;
  location?: string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized: Not logged in.' }, { status: 401 });
    }

    const { name, ip, location }: CreateNodeRequestBody = await req.json();

    if (!name || !ip) {
      return NextResponse.json({ message: 'Node name and IP are required.' }, { status: 400 });
    }

    // Periksa apakah node dengan nama atau IP yang sama sudah ada
    const existingNode = await prisma.node.findFirst({
      where: {
        OR: [
          { name: name },
          { ip: ip },
        ],
      },
    });

    if (existingNode) {
      return NextResponse.json({ message: 'A node with that name or IP already exists.' }, { status: 409 });
    }

    // Buat token unik untuk agen
    const token = randomBytes(32).toString('hex');

    const newNode = await prisma.node.create({
      data: {
        name: name,
        ip: ip,
        location: location,
        token: token,
        status: NodeStatus.UNKNOWN, // Status awal adalah UNKNOWN sampai agen melaporkan
        lastSeen: new Date(),
        cpuUsage: 0,
        ramUsage: 0,
        serviceStatus: 'UNKNOWN',
      },
    });

    return NextResponse.json({ message: 'Node created successfully.', node: newNode }, { status: 201 });

  } catch (error: unknown) { // Use 'unknown' for better type safety
    console.error('Error creating node:', error);
    
    // Check for specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            return NextResponse.json({ message: 'A node with this name or IP already exists.' }, { status: 409 });
        }
    }
    
    // Check for generic Error
    if (error instanceof Error) {
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }

    // Fallback for non-Error types
    return NextResponse.json({ message: 'An unknown internal server error occurred' }, { status: 500 });
  }
}
