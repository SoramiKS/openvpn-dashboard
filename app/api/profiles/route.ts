// app/api/profiles/route.ts

import { ActionType, ActionStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Using global PrismaClient instance
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

interface CreateProfileRequestBody {
  username: string;
  nodeId: string;
}

// --- GET Request (Fetch all VPN Users/Profiles) ---
export async function GET() {
  try {
    const vpnUsers = await prisma.vpnUser.findMany({
      select: {
        id: true,
        username: true,
        nodeId: true,
        node: { // Include node name for display purposes
          select: { name: true, status: true }
        },
        status: true,
        expirationDate: true,
        revocationDate: true, // Include revocation date
        serialNumber: true, // Include serial number
        ovpnFileContent: true, // Include OVPN file content for download
        isActive: true, // Include active status
        lastConnected: true, // Include last connected timestamp
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(vpnUsers, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching VPN profiles:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// --- POST Request (Create a new VPN User/Profile) ---
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    // Reverted: Removed withPassword and password from destructuring
    const { username, nodeId }: CreateProfileRequestBody = await req.json();

    // Normalize username to lowercase for consistency across the system
    const normalizedUsername = username.toLowerCase();

    if (!normalizedUsername || !nodeId) {
      return NextResponse.json({ message: 'Username and Node ID are required.' }, { status: 400 });
    }

    // Reverted: Removed password verification logic

    // Check if a VpnUser with this username already exists.
    const existingVpnUser = await prisma.vpnUser.findUnique({
      where: { username: normalizedUsername },
    });

    if (existingVpnUser) {
      return NextResponse.json({ message: `VPN profile for '${username}' already exists.` }, { status: 409 });
    }

    // Check if there's an existing pending CREATE_USER action for this username
    const existingPendingAction = await prisma.actionLog.findFirst({
      where: {
        action: ActionType.CREATE_USER,
        // Reverted: Searching for a direct string match in the details field
        details: normalizedUsername,
        status: ActionStatus.PENDING,
      },
    });

    if (existingPendingAction) {
      return NextResponse.json({ message: `Creation for '${username}' is already pending.` }, { status: 409 });
    }

    // Reverted: No longer creating a JSON object for details

    // Create an ActionLog entry with the username string directly in the details field
    const actionLog = await prisma.actionLog.create({
      data: {
        action: ActionType.CREATE_USER,
        nodeId: nodeId,
        // Reverted: Saving the normalized username directly
        details: normalizedUsername,
        status: ActionStatus.PENDING,
        initiatorId: session.user.id, // Log the admin who initiated the action
      },
    });

    return NextResponse.json({ message: 'VPN profile creation request submitted successfully. It will be processed by the agent.', actionLogId: actionLog.id }, { status: 202 });
  } catch (error: unknown) {
    console.error('Error submitting VPN profile creation request:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
    // Provide a default error response if the error is not an instance of Error
    return NextResponse.json({ message: 'An unknown internal server error occurred' }, { status: 500 });
  }
}
