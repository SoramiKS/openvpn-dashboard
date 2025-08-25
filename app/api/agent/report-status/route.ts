import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NodeStatus, Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serverId, serviceStatus, activeUsers = [] } = body;

    if (!serverId) {
      return NextResponse.json({ message: "Server ID is required." }, { status: 400 });
    }

    const nodeStatus = serviceStatus === 'running' ? NodeStatus.ONLINE : NodeStatus.OFFLINE;

    // Langsung update, tanpa memeriksa status sebelumnya
    await prisma.$transaction(async (tx) => {
        await tx.node.update({
            where: { id: serverId },
            data: {
                status: nodeStatus,
                lastSeen: new Date(),
            },
        });

        await tx.vpnUser.updateMany({
            where: { nodeId: serverId },
            data: { isActive: false },
        });

        if (activeUsers.length > 0) {
            await tx.vpnUser.updateMany({
                where: {
                    nodeId: serverId,
                    username: { in: activeUsers },
                },
                data: {
                    isActive: true,
                    lastConnected: new Date(),
                },
            });
        }
    });

    console.log(`Node ${serverId} status report processed, with ${activeUsers.length} active user(s).`);
    return NextResponse.json({ message: "Status updated successfully." }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        console.log(`Received status report for a deleted node. Ignoring.`);
        return NextResponse.json({ message: "Node not found, report ignored." }, { status: 200 });
    }

    console.error("Error processing agent status report:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}