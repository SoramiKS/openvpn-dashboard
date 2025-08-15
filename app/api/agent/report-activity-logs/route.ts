// app/api/agent/report-activity-logs/route.ts
import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

// Define the expected structure of a single log entry from the agent
interface ActivityLogPayload {
  timestamp: string;
  action: string;
  username: string | null;
  publicIp: string | null;
  vpnIp: string | null;
  bytesReceived: number | null;
  bytesSent: number | null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serverId, activityLogs } = body; // 'serverId' from agent is the 'id' in the DB

    // 1. Basic Validation
    if (!serverId || !Array.isArray(activityLogs)) {
      return NextResponse.json({ message: 'Missing serverId or activityLogs' }, { status: 400 });
    }

    // 2. Find the corresponding Node using its unique id
    // ------------------- THIS IS THE CORRECTED LINE -------------------
    const node = await prisma.node.findUnique({
      where: { id: serverId }, // Search by the primary key 'id'
    });
    // ------------------------------------------------------------------

    if (!node) {
      return NextResponse.json({ message: `Node with id ${serverId} not found` }, { status: 404 });
    }

    // 3. Clear old logs for this node
    await prisma.vpnActivityLog.deleteMany({
      where: { nodeId: node.id },
    });

    // 4. Prepare the new log data for insertion
    const logsToCreate = activityLogs.map((log: ActivityLogPayload) => ({
      nodeId: node.id,
      timestamp: new Date(log.timestamp),
      action: log.action,
      username: log.username,
      publicIp: log.publicIp,
      vpnIp: log.vpnIp,
      bytesReceived: log.bytesReceived !== null ? BigInt(log.bytesReceived) : null,
      bytesSent: log.bytesSent !== null ? BigInt(log.bytesSent) : null,
    }));

    // 5. Insert the new logs
    if (logsToCreate.length > 0) {
      await prisma.vpnActivityLog.createMany({
        data: logsToCreate,
      });
    }

    console.log(`Successfully processed ${logsToCreate.length} activity logs for node ${node.name}.`);
    return NextResponse.json({ message: 'Activity logs processed successfully' }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error processing activity logs:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal server error', error: errorMessage }, { status: 500 });
  }
}