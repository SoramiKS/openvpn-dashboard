// app/api/nodes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Prisma, ActionType, NodeStatus, ActionStatus } from "@prisma/client";

// helper buat check role ADMIN
async function checkAdminSession() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ message: "Access denied" }, { status: 403 });
  }
  return null;
}

// ========== PUT ==========
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const denied = await checkAdminSession();
  if (denied) return denied;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "User session not found." },
      { status: 401 }
    );
  }

  try {
    const params = await context.params;
    const nodeId = params.id;

    const { newData } = await request.json();

    if (!newData?.name?.trim() || !newData?.ip?.trim()) {
      return NextResponse.json(
        { message: "Node name and IP are required." },
        { status: 400 }
      );
    }

    const updatedNode = await prisma.$transaction(async (tx) => {
      const nodeBeforeUpdate = await tx.node.findUnique({
        where: { id: nodeId },
      });

      if (!nodeBeforeUpdate) throw new Error("P2025");

      const updated = await tx.node.update({
        where: { id: nodeId },
        data: {
          name: newData.name,
          ip: newData.ip,
          location: newData.location,
        },
      });

      // ✅ PERBAIKAN: Gunakan nodeBeforeUpdate untuk log, bukan originalData dari frontend
      await tx.actionLog.create({
        data: {
          action: ActionType.UPDATE_NODE,
          status: ActionStatus.COMPLETED,
          details: `Node '${nodeBeforeUpdate.name}' updated. Name: '${nodeBeforeUpdate.name}' -> '${newData.name}', IP: '${nodeBeforeUpdate.ip}' -> '${newData.ip}', Location: '${nodeBeforeUpdate.location}' -> '${newData.location}'`,
          nodeId,
          initiatorId: session.user.id,
          nodeNameSnapshot: nodeBeforeUpdate.name,
        },
      });

      return updated;
    });

    return NextResponse.json(
      { message: "Node updated successfully.", node: updatedNode },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ message: "Node not found." }, { status: 404 });
      }
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "A node with this name or IP already exists." },
          { status: 409 }
        );
      }
    }

    console.error("Error updating node:", error);
    return NextResponse.json(
      { message: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

// ========== DELETE ==========
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Perbaikan: Tambahkan Promise
) {
  const denied = await checkAdminSession();
  if (denied) return denied;

  try {
    const params = await context.params; // ✅ AWAIT params
    const nodeIdToDelete = params.id;   // ✅ Gunakan params.id

    if (!nodeIdToDelete) {
      return NextResponse.json(
        { message: "Node ID not found in URL." },
        { status: 400 }
      );
    }

    const node = await prisma.node.findUnique({
      where: { id: nodeIdToDelete },
    });
    if (!node) {
      return NextResponse.json({ message: "Node not found." }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Session or user ID not found." },
        { status: 401 }
      );
    }

    // Log awal sebelum delete
    await prisma.actionLog.create({
      data: {
        action: ActionType.DELETE_NODE,
        status: ActionStatus.COMPLETED,
        details: `Deletion initiated for node '${node.name}'.`,
        nodeId: nodeIdToDelete,
        initiatorId: session.user.id,
        nodeNameSnapshot: node.name,
      },
    });

    if (node.status === NodeStatus.ONLINE) {
      // Soft delete
      await prisma.actionLog.create({
        data: {
          nodeId: nodeIdToDelete,
          action: ActionType.DECOMMISSION_AGENT,
          status: ActionStatus.PENDING,
          details: `Self-deletion command sent to agent on node ${node.name}.`,
          nodeNameSnapshot: node.name,
        },
      });

      const updatedNode = await prisma.node.update({
        where: { id: nodeIdToDelete },
        data: {
          status: NodeStatus.DELETING,
          deletionStartedAt: new Date(),
        },
      });

      return NextResponse.json(
        {
          message: `Deletion process for node ${node.name} has started.`,
          node: updatedNode,
        },
        { status: 200 }
      );
    } else {
      // Hard delete
      await prisma.node.delete({ where: { id: nodeIdToDelete } });
      return NextResponse.json(
        { message: `Inactive node ${node.name} has been permanently deleted.` },
        { status: 200 }
      );
    }
  } catch (error: unknown) {
    console.error("Error while deleting node:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ message: "Node not found." }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Internal server error occurred." },
      { status: 500 }
    );
  }
}