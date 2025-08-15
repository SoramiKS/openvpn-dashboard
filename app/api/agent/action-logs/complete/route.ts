// app/api/agent/action-logs/complete/route.ts
import { ActionStatus, ActionType } from '@prisma/client';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client'; // Import the Prisma namespace

interface CompleteActionRequestBody {
  actionLogId: string;
  status: 'success' | 'failed';
  message: string;
  ovpnFileContent?: string | null; // For CREATE_USER actions
}

export async function POST(req: Request) {
  try {
    const { actionLogId, status, message, ovpnFileContent }: CompleteActionRequestBody = await req.json();

    const agentApiKey = req.headers.get('Authorization')?.split(' ')[1];
    if (agentApiKey !== process.env.AGENT_API_KEY) {
      console.warn(`Unauthorized access attempt to /api/agent/action-logs/complete. Invalid API Key: ${agentApiKey}`);
      return NextResponse.json({ message: 'Unauthorized: Invalid Agent API Key.' }, { status: 401 });
    }

    // Use the specific 'Prisma.TransactionClient' type for the transaction object 'tx'
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const actionLog = await tx.actionLog.findUnique({
        where: { id: actionLogId },
      });

      if (!actionLog) {
        console.warn(`Action log with ID ${actionLogId} not found during completion.`);
        // Note: Returning a response inside a transaction will cause it to rollback.
        // This should be handled carefully. For now, we'll throw an error to ensure rollback.
        throw new Error(`Action log with ID ${actionLogId} not found.`);
      }

      // Update the ActionLog status and message
      await tx.actionLog.update({
        where: { id: actionLogId },
        data: {
          status: status === 'success' ? ActionStatus.COMPLETED : ActionStatus.FAILED,
          message: message,
          executedAt: new Date(),
        },
      });

      // Special handling for CREATE_USER success
      if (actionLog.action === ActionType.CREATE_USER && status === 'success') {
        const username = actionLog.details;
        if (username) {
          const vpnUser = await tx.vpnUser.findUnique({
            where: { username: username },
          });

          if (vpnUser) {
            await tx.actionLog.update({
              where: { id: actionLogId },
              data: {
                vpnUserId: vpnUser.id,
              },
            });

            if (ovpnFileContent) {
              await tx.vpnUser.update({
                where: { id: vpnUser.id },
                data: {
                  ovpnFileContent: ovpnFileContent,
                },
              });
            }
          } else {
            console.warn(`VpnUser with username '${username}' not found for actionLogId: ${actionLogId}.`);
            // This will cause the transaction to rollback.
            throw new Error(`VpnUser with username '${username}' not found.`);
          }
        }
      }
    });

    console.log(`Action log ${actionLogId} completed successfully.`);
    return NextResponse.json({ message: 'Action log completed successfully' }, { status: 200 });
  } catch (error: unknown) { // Use 'unknown' for better type safety
    console.error('Error completing action log:', error);

    // Check if the error is a known Prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return NextResponse.json(
            { message: `A unique constraint violation occurred: ${error.meta?.target || 'unknown field'}.`, error: error.message },
            { status: 409 }
        );
    }
    
    // Check if it's a standard Error object
    if (error instanceof Error) {
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }

    // Fallback for unknown errors
    return NextResponse.json({ message: 'An unknown internal server error occurred' }, { status: 500 });
  }
}
