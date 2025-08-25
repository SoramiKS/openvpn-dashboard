import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const actionLogs = await prisma.actionLog.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { node: { select: { name: true } } }
        });

        const activityLogs = await prisma.vpnActivityLog.findMany({
            take: 5,
            orderBy: { timestamp: 'desc' },
            include: { node: { select: { name: true } } }
        });

        // --- PERBAIKAN DI SINI ---
        // 1. Ubah kedua jenis log ke format yang sama dengan properti 'date' yang konsisten
        const formattedActionLogs = actionLogs.map(log => ({
            date: log.createdAt,
            logData: log
        }));

        const formattedActivityLogs = activityLogs.map(log => ({
            date: log.timestamp,
            logData: log
        }));

        // 2. Gabungkan, urutkan berdasarkan 'date', potong, lalu ambil data aslinya kembali
        const combinedLogs = [...formattedActionLogs, ...formattedActivityLogs]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 5)
            .map(item => item.logData);
        // --- AKHIR PERBAIKAN ---

        // Konversi BigInt menjadi string agar aman untuk JSON
        const serializableLogs = combinedLogs.map(log => {
            if ('bytesSent' in log && typeof log.bytesSent === 'bigint') {
                return {
                    ...log,
                    bytesSent: log.bytesSent.toString(),
                    bytesReceived: log.bytesReceived?.toString() || null,
                }
            }
            return log;
        });

        return new NextResponse(
  JSON.stringify(serializableLogs, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  ),
  {
    headers: { "Content-Type": "application/json" },
  }
);

    } catch (error) {
        console.error("Failed to fetch recent logs:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}