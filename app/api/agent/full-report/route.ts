// app/api/agent/full-report/route.ts
import { NodeStatus, VpnCertificateStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client'; // Import the Prisma namespace

// Matching the AgentReportRequest model from Python agent
interface AgentReportRequestBody {
  nodeMetrics: {
    serverId: string;
    cpuUsage: number;
    ramUsage: number;
    serviceStatus: string;
    activeUsers: string[];
  };
  vpnProfiles: {
    username: string;
    status: string; // "VALID", "REVOKED", "EXPIRED", "UNKNOWN"
    expirationDate?: string | null; // ISO string
    revocationDate?: string | null; // ISO string
    serialNumber?: string | null;
  }[];
}

export async function POST(request: Request) {
  let serverId: string | undefined;
  try {
    const { nodeMetrics, vpnProfiles }: AgentReportRequestBody = await request.json();
    serverId = nodeMetrics.serverId;
    const { cpuUsage, ramUsage, serviceStatus, activeUsers } = nodeMetrics;

    const agentApiKey = request.headers.get('Authorization')?.split(' ')[1];

    if (agentApiKey !== process.env.AGENT_API_KEY) {
      return NextResponse.json({ message: 'Unauthorized: Invalid Agent API Key.' }, { status: 401 });
    }

    if (!serverId || typeof cpuUsage === 'undefined' || typeof ramUsage === 'undefined' || !serviceStatus || !Array.isArray(activeUsers) || !Array.isArray(vpnProfiles)) {
      return NextResponse.json(
        { message: 'Missing required fields in full report.' },
        { status: 400 }
      );
    }

    // Use the specific 'Prisma.TransactionClient' type for the transaction object 'tx'
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Update Node Metrics
      let mappedNodeStatus: NodeStatus;
      if (serviceStatus === 'running') {
        mappedNodeStatus = NodeStatus.ONLINE;
      } else if (serviceStatus === 'stopped') {
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

      // 2. Synchronize VpnUser Profiles using upsert
      const activeUsernamesFromAgent = new Set(activeUsers);
      const upsertPromises = [];

      for (const agentProfile of vpnProfiles) {
        const isCurrentlyActive = activeUsernamesFromAgent.has(agentProfile.username);
        
        let newStatus: VpnCertificateStatus = VpnCertificateStatus.UNKNOWN;
        if (agentProfile.status === "VALID") {
            newStatus = VpnCertificateStatus.VALID;
        } else if (agentProfile.status === "REVOKED") {
            newStatus = VpnCertificateStatus.REVOKED;
        } else if (agentProfile.status === "EXPIRED") {
            newStatus = VpnCertificateStatus.EXPIRED;
        } else if (agentProfile.status === "PENDING") {
            newStatus = VpnCertificateStatus.PENDING;
        }

        const commonData = {
          status: newStatus,
          serialNumber: agentProfile.serialNumber,
          expirationDate: agentProfile.expirationDate ? new Date(agentProfile.expirationDate) : null,
          revocationDate: agentProfile.revocationDate ? new Date(agentProfile.revocationDate) : null,
          isActive: isCurrentlyActive,
          ...(isCurrentlyActive && { lastConnected: new Date() }),
        };

        if (!serverId) {
          throw new Error('serverId is required for creating a vpnUser');
        }
        upsertPromises.push(tx.vpnUser.upsert({
          where: { username: agentProfile.username },
          update: commonData,
          create: {
            username: agentProfile.username,
            nodeId: serverId,
            ...commonData,
            ovpnFileContent: null,
            createdAt: new Date(),
          },
        }));
      }

      await Promise.all(upsertPromises);

      // 3. Mark users in DB as inactive if they are NOT in agent's activeUsers list
      const allUsersOnThisNodeAfterUpsert = await tx.vpnUser.findMany({
        where: { nodeId: serverId },
        select: { id: true, username: true, isActive: true },
      });

      const inactiveUpdates = [];
      for (const dbUser of allUsersOnThisNodeAfterUpsert) {
        if (!activeUsernamesFromAgent.has(dbUser.username) && dbUser.isActive) {
          inactiveUpdates.push(tx.vpnUser.update({
            where: { id: dbUser.id },
            data: { isActive: false },
          }));
        }
      }
      await Promise.all(inactiveUpdates);
    }); // End of transaction

    console.log(`Full report processed for server ${serverId}.`);
    return NextResponse.json({ message: 'Full report processed successfully' }, { status: 200 });

  } catch (error: unknown) { // Use 'unknown' for better type safety
    console.error('Error processing full agent report for serverId:', serverId || 'N/A', ':', error);
    
    // Check if the error is a known Prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
            return NextResponse.json({ message: `Node with ID ${serverId} not found.` }, { status: 404 });
        }
        if (error.code === 'P2002') {
            return NextResponse.json({ message: 'A unique constraint violation occurred during profile synchronization.', error: error.message }, { status: 409 });
        }
    }

    // Check if it's a standard Error object
    if (error instanceof Error) {
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }

    // Fallback for unknown errors
    return NextResponse.json({ message: 'An unknown internal server error occurred' }, { status: 500 });
  }
}
