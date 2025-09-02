// app/api/agent/report-status/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NodeStatus, Prisma } from "@prisma/client";
import { WebSocket } from "ws"; // <-- Impor WebSocket

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization'); // Gunakan 'request' dari parameter fungsi
        const agentApiKey = process.env.AGENT_API_KEY;

        if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== agentApiKey) {
          return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const body = await request.json();
        const { serverId, serviceStatus, activeUsers = [], cpuUsage, ramUsage } = body;

        if (!serverId) {
            return NextResponse.json(
                { message: "Server ID is required." },
                { status: 400 }
            );
        }

        const nodeStatus =
            serviceStatus === "running" ? NodeStatus.ONLINE : NodeStatus.OFFLINE; // --- DATA BARU UNTUK DISIARKAN --- // Kita siapkan data yang akan dikirim melalui WebSocket

        const updatePayload = {
            id: serverId,
            status: nodeStatus,
            lastSeen: new Date(),
            cpuUsage: cpuUsage, // <-- 2. Tambahkan ke payload WebSocket
            ramUsage: ramUsage, // <-- 2. Tambahkan ke payload WebSocket
        }; // --- AKHIR DATA BARU ---
        await prisma.$transaction(async (tx) => {
            await tx.node.update({
                where: { id: serverId },
                data: {
                    status: updatePayload.status,
                    lastSeen: updatePayload.lastSeen,
                    cpuUsage: cpuUsage, // <-- 3. Simpan juga ke database
                    ramUsage: ramUsage, // <-- 3. Simpan juga ke database
                },
            });

            // Logika untuk user aktif tetap sama
            await tx.vpnUser.updateMany({
                where: { nodeId: serverId },
                data: { isActive: false },
            });

            if (activeUsers.length > 0) {
                await tx.vpnUser.updateMany({
                    where: {
                        nodeId: serverId,
                        username: { in: activeUsers },
                    },
                    data: {
                        isActive: true,
                        lastConnected: new Date(),
                    },
                });
            }
        }); // --- BAGIAN BARU: MENYIARKAN PEMBARUAN --- // Cek apakah server WebSocket kita sudah berjalan

        if (global._webSocketServer) {
            const message = JSON.stringify({
                type: "NODE_STATUS_UPDATE",
                payload: updatePayload,
            }); // Kirim pesan ke semua klien yang terhubung

            global._webSocketServer.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        } // --- AKHIR BAGIAN BARU ---
        console.log(
            `Node ${serverId} status report processed, with ${activeUsers.length} active user(s).`
        );
        return NextResponse.json(
            { message: "Status updated successfully." },
            { status: 200 }
        );
    } catch (error: unknown) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            console.log(`Received status report for a deleted node. Ignoring.`);
            return NextResponse.json(
                { message: "Node not found, report ignored." },
                { status: 200 }
            );
        }

        console.error("Error processing agent status report:", error);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
