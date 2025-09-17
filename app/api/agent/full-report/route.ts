// app/api/agent/full-report/route.ts
import { NodeStatus, VpnCertificateStatus, Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
    // Helper to map serviceStatus to NodeStatus
    function mapNodeStatus(serviceStatus: string): NodeStatus {
      if (serviceStatus === 'running') return NodeStatus.ONLINE;
      if (serviceStatus === 'stopped') return NodeStatus.OFFLINE;
      return NodeStatus.UNKNOWN;
    }

    // Helper to map agentProfile.status to VpnCertificateStatus
    function mapVpnCertificateStatus(status: string): VpnCertificateStatus {
      switch (status) {
        case "VALID": return VpnCertificateStatus.VALID;
        case "REVOKED": return VpnCertificateStatus.REVOKED;
        case "EXPIRED": return VpnCertificateStatus.EXPIRED;
        case "PENDING": return VpnCertificateStatus.PENDING;
        default: return VpnCertificateStatus.UNKNOWN;
      }
    }

    // Helper to upsert VPN users
    async function upsertVpnUsers(tx: Prisma.TransactionClient, vpnProfiles: AgentReportRequestBody["vpnProfiles"], activeUsernamesFromAgent: Set<string>, serverId: string) {
      const upsertPromises = vpnProfiles.map(agentProfile => {
        const isCurrentlyActive = activeUsernamesFromAgent.has(agentProfile.username);
        const newStatus = mapVpnCertificateStatus(agentProfile.status);
        const commonData = {
          status: newStatus,
          serialNumber: agentProfile.serialNumber,
          expirationDate: agentProfile.expirationDate ? new Date(agentProfile.expirationDate) : null,
          revocationDate: agentProfile.revocationDate ? new Date(agentProfile.revocationDate) : null,
          isActive: isCurrentlyActive,
          ...(isCurrentlyActive && { lastConnected: new Date() }),
        };
        return tx.vpnUser.upsert({
          where: { username: agentProfile.username },
          update: commonData,
          create: {
            username: agentProfile.username,
            nodeId: serverId,
            ...commonData,
            ovpnFileContent: null,
            createdAt: new Date(),
          },
        });
      });
      await Promise.all(upsertPromises);
    }

    // Helper to mark inactive users
    async function markInactiveUsers(tx: Prisma.TransactionClient, serverId: string, activeUsernamesFromAgent: Set<string>) {
      const allUsersOnThisNodeAfterUpsert = await tx.vpnUser.findMany({
        where: { nodeId: serverId },
        select: { id: true, username: true, isActive: true },
      });
      const inactiveUpdates = allUsersOnThisNodeAfterUpsert
        .filter(dbUser => !activeUsernamesFromAgent.has(dbUser.username) && dbUser.isActive)
        .map(dbUser => tx.vpnUser.update({
          where: { id: dbUser.id },
          data: { isActive: false },
        }));
      await Promise.all(inactiveUpdates);
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Update Node Metrics
      const mappedNodeStatus = mapNodeStatus(serviceStatus);
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
      if (!serverId) {
        throw new Error('serverId is required for creating a vpnUser');
      }
      await upsertVpnUsers(tx, vpnProfiles, activeUsernamesFromAgent, serverId);

      // 3. Mark users in DB as inactive if they are NOT in agent's activeUsers list
      await markInactiveUsers(tx, serverId, activeUsernamesFromAgent);
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
