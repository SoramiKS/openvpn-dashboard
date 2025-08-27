// app/api/nodes/[id]/metrics/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import snmp from "net-snmp";

const OIDS = {
  cpuUser: "1.3.6.1.4.1.2021.11.9.0",     // ssCpuUser
  cpuSystem: "1.3.6.1.4.1.2021.11.10.0",  // ssCpuSystem
  memTotal: "1.3.6.1.4.1.2021.4.5.0",     // Total RAM
  memAvail: "1.3.6.1.4.1.2021.4.6.0",     // Available RAM
  memBuffer: "1.3.6.1.4.1.2021.4.14.0",   // Buffers
  memCached: "1.3.6.1.4.1.2021.4.15.0",   // Cached
};

interface Varbind {
  oid: string;
  value: number | string | Buffer;
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 401 });
  }

  const nodeId = request.nextUrl.pathname.split("/")[3];
  if (!nodeId) {
    return NextResponse.json({ message: "ID Node tidak ditemukan di URL." }, { status: 400 });
  }

  try {
    const node = await prisma.node.findUnique({ where: { id: nodeId } });
    if (!node) return NextResponse.json({ message: "Node tidak ditemukan." }, { status: 404 });

    if (!node.ip || !node.snmpCommunity) {
      return NextResponse.json(
        { message: "Informasi IP atau SNMP Community belum diatur." },
        { status: 400 }
      );
    }

    const metrics = await new Promise<{ [key: string]: number }>((resolve, reject) => {
      const snmpSession = snmp.createSession(node.ip!, node.snmpCommunity!, { timeout: 5000 });
      const oidsToFetch = Object.values(OIDS);

      snmpSession.get(oidsToFetch, (error: Error | null, varbinds: Varbind[]) => {
        if (error) {
          snmpSession.close();
          return reject(new Error("Gagal menghubungi agen SNMP. Cek IP, community, atau firewall."));
        }

        const results: { [key: string]: number } = {};
        for (const vb of varbinds) {
          if (!snmp.isVarbindError(vb)) {
            const numericValue = Number(vb.value);
            if (!isNaN(numericValue)) {
              for (const [key, oid] of Object.entries(OIDS)) {
                if (vb.oid === oid) results[key] = numericValue;
              }
            }
          } else {
            console.error("SNMP varbind error:", snmp.varbindError(vb));
          }
        }

        snmpSession.close();
        resolve(results);
      });
    });

    // CPU Usage
    const cpuUser = metrics.cpuUser ?? 0;
    const cpuSystem = metrics.cpuSystem ?? 0;
    const cpuUsagePercentage = Math.min(100, Math.max(0, cpuUser + cpuSystem));

    // RAM Usage (ala Proxmox/htop)
    const memTotal = metrics.memTotal || 1;
    const memAvail = metrics.memAvail ?? 0;
    const memBuffer = metrics.memBuffer ?? 0;
    const memCached = metrics.memCached ?? 0;

    const memUsed = memTotal - (memAvail + memBuffer + memCached);
    const ramUsagePercentage = Math.min(100, Math.max(0, (memUsed / memTotal) * 100));

    const formattedResponse = {
      cpuUsage: Number(cpuUsagePercentage.toFixed(2)),
      ramUsage: Number(ramUsagePercentage.toFixed(2)),
      lastUpdated: new Date().toISOString(),
    };

        // --- TAMBAHKAN BLOK INI ---
    // Setelah metrik berhasil dihitung, simpan hasilnya ke database.
    // Ini adalah "fire and forget", kita tidak perlu menunggu hasilnya.
    await prisma.node.update({
      where: { id: nodeId },
      data: {
        cpuUsage: formattedResponse.cpuUsage,
        ramUsage: formattedResponse.ramUsage,
      },
    });
    // --- AKHIR BLOK TAMBAHAN ---

    return NextResponse.json(formattedResponse, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan internal pada server.";
    console.error("Error fetching SNMP metrics:", error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
