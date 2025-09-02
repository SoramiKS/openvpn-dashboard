// app/api/nodes/route.ts
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ActionStatus, ActionType, NodeStatus } from "@prisma/client";
import { randomBytes } from 'crypto';
import { Prisma } from "@prisma/client";
import { subMinutes } from "date-fns";

const OFFLINE_THRESHOLD_MS = 90 * 1000; // Consider offline if no report > 90 seconds
const DELETION_CLEANUP_MINUTES = 1; // Permanently delete after 1 minute

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Access denied' }, { status: 401 });
    }

    // 1. Run cleanup for nodes that are being deleted
    const deletionThreshold = subMinutes(new Date(), DELETION_CLEANUP_MINUTES);
    await prisma.node.deleteMany({
        where: {
            status: NodeStatus.DELETING,
            deletionStartedAt: {
                lt: deletionThreshold // Older than the threshold
            }
        }
    });

    // 2. Fetch list of "active" nodes (not being deleted)
    const activeNodes = await prisma.node.findMany({
      where: {
        status: {
          not: NodeStatus.DELETING
        }
      },
      orderBy: { name: 'asc' },
    });

    const now = new Date();
    const staleNodeIds: string[] = [];

    // 3. Detect nodes that should be OFFLINE from the active list
    activeNodes.forEach(node => {
      if (node.status === NodeStatus.ONLINE && node.lastSeen) {
        const timeSinceLastSeen = now.getTime() - node.lastSeen.getTime();
        if (timeSinceLastSeen > OFFLINE_THRESHOLD_MS) {
          staleNodeIds.push(node.id);
        }
      }
    });

    // 4. If there are offline nodes, update their status in the database
    if (staleNodeIds.length > 0) {
      await prisma.node.updateMany({
        where: { id: { in: staleNodeIds } },
        data: { status: NodeStatus.OFFLINE },
      });
    }

    // 5. Fetch final cleaned and updated data to return
    const finalNodes = await prisma.node.findMany({
        where: {
            status: {
                not: NodeStatus.DELETING
            }
        },
        orderBy: { name: 'asc' },
    });

    return NextResponse.json(finalNodes, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching nodes:', error);
    return NextResponse.json({ message: 'Internal server error occurred' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    const { name, ip, location, snmpCommunity }: { name: string; ip: string; location?: string; snmpCommunity?: string; } = await req.json();

    if (!name || !ip) {
      return NextResponse.json({ message: 'Node name and IP are required.' }, { status: 400 });
    }

    const existingNode = await prisma.node.findFirst({
      where: { OR: [{ name: name }, { ip: ip }] },
    });

    if (existingNode) {
      return NextResponse.json({ message: 'A node with this name or IP already exists.' }, { status: 409 });
    }

    const token = randomBytes(32).toString('hex');

    const newNode = await prisma.node.create({
      data: {
        name: name,
        ip: ip,
        location: location,
        token: token,
        status: NodeStatus.UNKNOWN,
        lastSeen: new Date(),
        cpuUsage: 0,
        ramUsage: 0,
        serviceStatus: 'UNKNOWN',
        snmpCommunity: snmpCommunity || 'public',
      },
    });

        // --- TAMBAHKAN BLOK INI ---
    // Membuat log audit setelah node berhasil dibuat
    await prisma.actionLog.create({
      data: {
        action: ActionType.CREATE_NODE,
        status: ActionStatus.COMPLETED,
        details: `Node '${newNode.name}' was created.`,
        nodeId: newNode.id, // Tautkan log ke node yang baru dibuat
        initiatorId: session.user.id, // Catat siapa yang membuatnya
        nodeNameSnapshot: newNode.name,
      }
    });
    // --- AKHIR BLOK TAMBAHAN ---

    return NextResponse.json({ message: 'Node created successfully.', node: newNode }, { status: 201 });

  } catch (error: unknown) {
    console.error('Error creating node:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ message: 'A node with this name or IP already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal server error occurred.' }, { status: 500 });
  }
}
