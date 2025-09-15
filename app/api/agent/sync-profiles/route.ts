// app/api/agent/sync-profiles/route.ts
import { VpnCertificateStatus, Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface VpnProfileData {
  username: string;
  status: string; // "VALID", "REVOKED", "EXPIRED", "UNKNOWN", "PENDING"
  expirationDate?: string | null; // ISO string
  revocationDate?: string | null; // ISO string
  serialNumber?: string | null;
  ovpnFileContent?: string | null;
}

interface SyncProfilesRequestBody {
  serverId: string;
  vpnProfiles: VpnProfileData[];
}

export async function POST(req: Request) {
  let serverId: string | undefined;
  try {
    const { serverId: nodeId, vpnProfiles }: SyncProfilesRequestBody = await req.json();
    serverId = nodeId; // Assign to serverId for logging context

    const authHeader = req.headers.get('Authorization');
    const apiKey = authHeader?.split(' ')[1];

    if (apiKey !== process.env.AGENT_API_KEY) {
      console.warn(`Unauthorized access attempt to /api/agent/sync-profiles. Invalid API Key: ${apiKey}`);
      return NextResponse.json({ message: 'Unauthorized: Invalid Agent API Key.' }, { status: 401 });
    }

    if (!serverId || !Array.isArray(vpnProfiles)) {
      console.warn(`Missing required fields for sync-profiles from server ${serverId || 'N/A'}.`);
      return NextResponse.json({ message: 'Missing required fields: serverId and vpnProfiles array.' }, { status: 400 });
    }

    // Use the specific 'Prisma.TransactionClient' type for the transaction object 'tx'
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const upsertPromises = [];

      for (const agentProfile of vpnProfiles) {
        const normalizedUsername = agentProfile.username.toLowerCase();

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
          ovpnFileContent: agentProfile.ovpnFileContent || null,
        };

        upsertPromises.push(tx.vpnUser.upsert({
          where: { username: normalizedUsername },
          update: commonData,
          create: {
            username: normalizedUsername,
            nodeId: serverId as string,
            ...commonData,
            isActive: false,
            createdAt: new Date(),
          },
        }));
      }

      await Promise.all(upsertPromises);
    });

    console.log(`VPN profiles synced for server ${serverId}.`);
    return NextResponse.json({ message: 'VPN profiles synced successfully' }, { status: 200 });
  } catch (err: unknown) { // Use 'unknown' for better type safety
    console.error('Error syncing VPN profiles for serverId:', serverId || 'N/A', ':', err);
    
    // Check if the error is a known Prisma error
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
            return NextResponse.json({ message: `Node with ID ${serverId} not found.` }, { status: 404 });
        }
        if (err.code === 'P2002') {
            return NextResponse.json({ message: 'A unique constraint violation occurred during profile synchronization.', error: err.message }, { status: 409 });
        }
    }

    // Check if it's a standard Error object
    if (err instanceof Error) {
        return NextResponse.json({ message: 'Internal server error', error: err.message }, { status: 500 });
    }

    // Fallback for unknown errors
    return NextResponse.json({ message: 'An unknown internal server error occurred' }, { status: 500 });
  }
}
