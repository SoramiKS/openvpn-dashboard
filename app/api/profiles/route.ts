// app/api/profiles/route.ts

import { ActionType, ActionStatus } from '@/lib/generated/prisma';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Using global PrismaClient instance
import { Prisma } from '@prisma/client'; // Import Prisma namespace to use JsonValue type

interface CreateProfileRequestBody {
  username: string;
  nodeId: string;
  withPassword?: boolean; // Field baru, opsional
  password?: string; // Field baru, opsional
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
          select: { name: true }
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
  } finally {
  }
}

// --- POST Request (Create a new VPN User/Profile) ---
export async function POST(req: Request) {
  try {
    const { username, nodeId, withPassword, password }: CreateProfileRequestBody = await req.json();

    // Normalize username to lowercase for consistency across the system
    const normalizedUsername = username.toLowerCase();

    if (!normalizedUsername || !nodeId) {
      return NextResponse.json({ message: 'Username and Node ID are required.' }, { status: 400 });
    }

    // VERIFIKASI BARU: Jika dengan password, pastikan passwordnya ada
    if (withPassword && !password) {
      return NextResponse.json({ message: 'Password is required for a password-protected client.' }, { status: 400 });
    }

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
            // Periksa details field, yang sekarang berupa JSON string
            details: {
              contains: normalizedUsername,
            },
            status: ActionStatus.PENDING,
        },
    });


    if (existingPendingAction) {
        return NextResponse.json({ message: `Creation for '${username}' is already pending.` }, { status: 409 });
    }
    
    // Buat objek detail yang berisi username dan password jika ada
    const actionDetails = {
      username: normalizedUsername,
      password: withPassword ? password : null,
    };
    // Ubah objek detail menjadi string JSON
    const jsonDetails = JSON.stringify(actionDetails);

    // Create an ActionLog entry with the JSON string in the details field
    const actionLog = await prisma.actionLog.create({
      data: {
        action: ActionType.CREATE_USER,
        nodeId: nodeId,
        details: jsonDetails, // Simpan string JSON di sini
        status: ActionStatus.PENDING,
      },
    });

    return NextResponse.json({ message: 'VPN profile creation request submitted successfully. It will be processed by the agent.', actionLogId: actionLog.id }, { status: 202 });
  } catch (error: unknown) {
    console.error('Error submitting VPN profile creation request:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
  } finally {

  }
}
