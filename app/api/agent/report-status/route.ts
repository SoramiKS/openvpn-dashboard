// app/api/agent/report-status/route.ts
import prisma from '@/lib/prisma';
import { NodeStatus } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";
import { Prisma } from '@prisma/client'; // Import the Prisma namespace

interface ReportStatusRequestBody {
  serverId: string;
  cpuUsage: number;
  ramUsage: number;
  serviceStatus: string;
  activeUsers: string[]; // List of usernames currently active on the server
}

export async function POST(request: Request) {
  let serverId: string | undefined;
  try {
    const {
      serverId: nodeId,
      cpuUsage,
      ramUsage,
      serviceStatus,
      activeUsers,
    }: ReportStatusRequestBody = await request.json();
    serverId = nodeId; // Assign to serverId for logging context

    const agentApiKey = request.headers.get("Authorization")?.split(" ")[1];

    if (agentApiKey !== process.env.AGENT_API_KEY) {
      console.warn(`Unauthorized access attempt to /api/agent/report-status. Invalid API Key: ${agentApiKey}`);
      return NextResponse.json(
        { message: "Unauthorized: Invalid Agent API Key." },
        { status: 401 }
      );
    }

    if (
      !serverId ||
      typeof cpuUsage === "undefined" ||
      typeof ramUsage === "undefined" ||
      !serviceStatus ||
      !Array.isArray(activeUsers)
    ) {
      console.warn(`Missing required fields for report-status from server ${serverId || 'N/A'}.`);
      return NextResponse.json(
        { message: "Missing required fields in status report." },
        { status: 400 }
      );
    }

    // Use the specific 'Prisma.TransactionClient' type for the transaction object 'tx'
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Update Node Metrics
      let mappedNodeStatus: NodeStatus;
      if (serviceStatus === "running") {
        mappedNodeStatus = NodeStatus.ONLINE;
      } else if (serviceStatus === "stopped") {
        mappedNodeStatus = NodeStatus.OFFLINE;
      } else {
        mappedNodeStatus = NodeStatus.UNKNOWN;
      }

      await tx.node.update({
        where: { id: serverId },
        data: {
          cpuUsage: cpuUsage,
          ramUsage: ramUsage,
          serviceStatus: serviceStatus,
          lastSeen: new Date(),
          status: mappedNodeStatus,
        },
      });

      // 2. Update VpnUser active status for this node
      const now = new Date();
      const usersOnThisNode = await tx.vpnUser.findMany({
        where: { nodeId: serverId },
        select: {
          id: true,
          username: true,
          isActive: true,
          lastConnected: true,
        },
      });

      const activeUsernamesFromAgent = new Set(
        activeUsers.map((u) => u.toLowerCase().trim())
      );

      const updates = [];

      for (const user of usersOnThisNode) {
        const normalizedDbUsername = user.username.toLowerCase().trim();
        const isCurrentlyActive =
          activeUsernamesFromAgent.has(normalizedDbUsername);

        if (isCurrentlyActive && !user.isActive) {
          // User just became active
          updates.push(
            tx.vpnUser.update({
              where: { id: user.id },
              data: {
                isActive: true,
                lastConnected: now,
              },
            })
          );
        } else if (isCurrentlyActive && user.isActive) {
          // User is still active, just update lastConnected
          updates.push(
            tx.vpnUser.update({
              where: { id: user.id },
              data: {
                lastConnected: now,
              },
            })
          );
        } else if (!isCurrentlyActive && user.isActive) {
          // User just became inactive
          updates.push(
            tx.vpnUser.update({
              where: { id: user.id },
              data: {
                isActive: false,
              },
            })
          );
        }
      }
      await Promise.all(updates);
    }); // End of transaction

    console.log(`Node ${serverId} status report processed.`);
    return NextResponse.json(
      { message: "Status reported successfully" },
      { status: 200 }
    );
  } catch (error: unknown) { // Use 'unknown' for better type safety
    console.error(
      "Error processing agent status report for serverId:",
      serverId || "N/A",
      ":",
      error
    );
    
    // Check if the error is a known Prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return NextResponse.json(
            { message: `Node with ID ${serverId} not found.` },
            { status: 404 }
        );
    }

    // Check if it's a standard Error object
    if (error instanceof Error) {
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }

    // Fallback for unknown errors
    return NextResponse.json({ message: "An unknown internal server error occurred" }, { status: 500 });
  }
}
