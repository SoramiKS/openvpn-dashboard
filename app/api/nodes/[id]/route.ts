import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Prisma } from "@prisma/client";

// Interface for the request body
interface UpdateNodeRequestBody {
  name?: string;
  ip?: string;
  location?: string;
}

// This defines the correct handler type for Next.js 15,
// where the params object is a Promise.
type ApiRouteHandler = (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => Promise<NextResponse>;


// Apply the defined type to the PUT handler.
export const PUT: ApiRouteHandler = async (req, context) => {
  // In Next.js 15, you must await the params.
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized: Not logged in." },
      { status: 401 }
    );
  }

  try {
    const body: UpdateNodeRequestBody = await req.json();
    const { name, ip, location } = body;

    if (!name?.trim() || !ip?.trim()) {
      return NextResponse.json(
        { message: "Node name and IP are required." },
        { status: 400 }
      );
    }

    const updatedNode = await prisma.node.update({
      where: { id },
      data: {
        name,
        ip,
        location,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Node updated successfully.", node: updatedNode },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating node:", error);
    // Check for specific Prisma errors first
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ message: "Node not found." }, { status: 404 });
      }
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "A node with that name or IP already exists." },
          { status: 409 }
        );
      }
    }
    // Then check for a generic Error
    if (error instanceof Error) {
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
    // Fallback for any other type of error
    return NextResponse.json(
        { message: "An unknown internal server error occurred." },
        { status: 500 }
    );
  }
};

// Apply the defined type to the DELETE handler.
export const DELETE: ApiRouteHandler = async (req, context) => {
  // In Next.js 15, you must await the params.
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized: Not logged in." },
      { status: 401 }
    );
  }

  try {
    const deletedNode = await prisma.node.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Node deleted successfully.", node: deletedNode },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting node:", error);
    // Check for specific Prisma errors first
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
            return NextResponse.json({ message: "Node not found." }, { status: 404 });
        }
    }
    // Then check for a generic Error
    if (error instanceof Error) {
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
    // Fallback for any other type of error
    return NextResponse.json(
        { message: "An unknown internal server error occurred." },
        { status: 500 }
    );
  }
};
