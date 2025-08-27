// app/api/profiles/[id]/revoke/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { ActionType, ActionStatus } from "@prisma/client";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(req: NextRequest, context: any) {
  const { id } = context.params;

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { message: "Unauthorized: Not logged in." },
      { status: 401 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { message: "VpnUser ID is required." },
      { status: 400 }
    );
  }

  try {
    const vpnUser = await prisma.vpnUser.findUnique({
      where: { id },
      select: { id: true, username: true, nodeId: true, status: true },
    });

    if (!vpnUser) {
      return NextResponse.json(
        { message: "VPN User not found." },
        { status: 404 }
      );
    }

    if (vpnUser.status === "REVOKED") {
      return NextResponse.json(
        { message: "VPN User is already revoked." },
        { status: 400 }
      );
    }

    await prisma.actionLog.create({
      data: {
        action: ActionType.REVOKE_USER,
        nodeId: vpnUser.nodeId,
        vpnUserId: vpnUser.id,
        details: vpnUser.username,
        status: ActionStatus.PENDING,
        initiatorId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "VPN profile revocation initiated successfully" },
      { status: 202 }
    );
  } catch (error: unknown) {
    console.error("Error revoking VPN user:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
