// app/api/nodes/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Prisma, ActionType, NodeStatus } from "@prisma/client";

async function checkAdminSession() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Access denied" }, { status: 403 });
  }
  return null;
}

// PUT handler unchanged
export async function PUT(request: NextRequest) {
  const denied = await checkAdminSession();
  if (denied) return denied;

  try {
    const nodeId = request.nextUrl.pathname.split("/").pop();
    if (!nodeId) {
      return NextResponse.json({ message: "Node ID not found in URL." }, { status: 400 });
    }
    const body = await request.json();
    const { name, ip, location, snmpCommunity } = body;
    if (!name?.trim() || !ip?.trim()) {
      return NextResponse.json({ message: "Node name and IP are required." }, { status: 400 });
    }
    const updatedNode = await prisma.node.update({
      where: { id: nodeId },
      data: { name, ip, location, snmpCommunity },
    });
    return NextResponse.json({ message: "Node updated successfully.", node: updatedNode }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") return NextResponse.json({ message: "Node not found." }, { status: 404 });
      if (error.code === "P2002") return NextResponse.json({ message: "A node with this name or IP already exists." }, { status: 409 });
    }
    return NextResponse.json({ message: "Internal server error occurred." }, { status: 500 });
  }
}

// DELETE handler with "Smart Delete" and "Soft Delete" logic
export async function DELETE(request: NextRequest) {
  const denied = await checkAdminSession();
  if (denied) return denied;

  try {
    const nodeIdToDelete = request.nextUrl.pathname.split("/").pop();
    if (!nodeIdToDelete) {
        return NextResponse.json({ message: "Node ID not found in URL." }, { status: 400 });
    }

    const node = await prisma.node.findUnique({ where: { id: nodeIdToDelete } });
    if (!node) {
      return NextResponse.json({ message: "Node not found." }, { status: 404 });
    }

    // If node is ONLINE, send self-destruct command and start soft delete
    if (node.status === NodeStatus.ONLINE) {
      await prisma.actionLog.create({
        data: {
          nodeId: nodeIdToDelete,
          action: ActionType.DECOMMISSION_AGENT,
          status: "PENDING",
          details: `Self-deletion command sent to agent on node ${node.name}.`,
        },
      });
      // Change status to DELETING and record the timestamp
      const updatedNode = await prisma.node.update({
        where: { id: nodeIdToDelete },
        data: { 
          status: NodeStatus.DELETING,
          deletionStartedAt: new Date() // Record when deletion started
        },
      });
      return NextResponse.json({ message: `Deletion process for node ${node.name} has started.`, node: updatedNode }, { status: 200 });
    } else {
      // If node is OFFLINE or UNKNOWN, delete directly from DB (Hard Delete)
      await prisma.node.delete({ where: { id: nodeIdToDelete } });
      return NextResponse.json({ message: `Inactive node ${node.name} has been permanently deleted.` }, { status: 200 });
    }
  } catch (error: unknown) {
    console.error("Error while deleting node:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Node not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Internal server error occurred." }, { status: 500 });
  }
}
