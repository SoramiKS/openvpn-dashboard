// app/api/nodes/[id]/metrics/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import snmp from "net-snmp";
import { Node } from "@prisma/client";

const OIDS = {
  cpuUser: "1.3.6.1.4.1.2021.11.9.0",
  cpuSystem: "1.3.6.1.4.1.2021.11.10.0",
  memTotal: "1.3.6.1.4.1.2021.4.5.0",
  memAvail: "1.3.6.1.4.1.2021.4.6.0",
  memBuffer: "1.3.6.1.4.1.2021.4.14.0",
  memCached: "1.3.6.1.4.1.2021.4.15.0",
};

type RawMetrics = { [key in keyof typeof OIDS]?: number };

// --- FUNGSI HELPER 1: Mengambil data mentah dari SNMP ---
async function fetchSnmpMetrics(node: Node): Promise<RawMetrics> {
  // Buat peta terbalik untuk pencarian OID yang efisien (O(1))
  const oidToKeyMap = new Map(Object.entries(OIDS).map(([key, oid]) => [oid, key]));

  return new Promise((resolve, reject) => {
    const session = snmp.createSession(node.ip, node.snmpCommunity!, { timeout: 5000 });
    session.get(Object.values(OIDS), (error: any, varbinds: any) => {
      session.close();
      if (error) {
        return reject(new Error("Gagal menghubungi agen SNMP. Cek IP, community, atau firewall."));
      }

      const results: RawMetrics = {};
      for (const vb of varbinds) {
        if (snmp.isVarbindError(vb)) {
          console.error("SNMP varbind error:", snmp.varbindError(vb));
          continue; // Lanjut ke varbind berikutnya
        }

        // Hapus loop bersarang dengan pencarian langsung di peta
        const key = oidToKeyMap.get(vb.oid);
        if (key) {
          const numericValue = Number(vb.value);
          if (!isNaN(numericValue)) {
            results[key as keyof typeof OIDS] = numericValue;
          }
        }
      }
      resolve(results);
    });
  });
}

// --- FUNGSI HELPER 2: Menghitung persentase penggunaan ---
function calculateUsage(metrics: RawMetrics) {
  const cpuUser = metrics.cpuUser ?? 0;
  const cpuSystem = metrics.cpuSystem ?? 0;
  const cpuUsage = Math.min(100, Math.max(0, cpuUser + cpuSystem));

  const memTotal = metrics.memTotal || 1;
  const memUsed = memTotal - (metrics.memAvail ?? 0) - (metrics.memBuffer ?? 0) - (metrics.memCached ?? 0);
  const ramUsage = Math.min(100, Math.max(0, (memUsed / memTotal) * 100));

  return {
    cpuUsage: Number(cpuUsage.toFixed(2)),
    ramUsage: Number(ramUsage.toFixed(2)),
  };
}

// --- FUNGSI HELPER 3: Memperbarui database (fire-and-forget) ---
async function updateNodeMetricsInDb(nodeId: string, metrics: { cpuUsage: number; ramUsage: number }) {
  try {
    await prisma.node.update({
      where: { id: nodeId },
      data: metrics,
    });
  } catch (dbError) {
    console.error(`Failed to update metrics in DB for node ${nodeId}:`, dbError);
  }
}

// --- HANDLER UTAMA ---
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 401 });
  }

  const { id: nodeId } = params;
  if (!nodeId) {
    return NextResponse.json({ message: "ID Node tidak ditemukan di URL." }, { status: 400 });
  }

  try {
    const node = await prisma.node.findUnique({ where: { id: nodeId } });
    if (!node) return NextResponse.json({ message: "Node tidak ditemukan." }, { status: 404 });
    if (!node.ip || !node.snmpCommunity) {
      return NextResponse.json({ message: "Informasi IP atau SNMP Community belum diatur." }, { status: 400 });
    }

    // Gunakan fungsi-fungsi helper
    const rawMetrics = await fetchSnmpMetrics(node);
    const calculatedMetrics = calculateUsage(rawMetrics);

    // Update DB di latar belakang tanpa menunggu
    updateNodeMetricsInDb(nodeId, calculatedMetrics);

    const response = {
      ...calculatedMetrics,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan internal pada server.";
    console.error("Error in GET /metrics:", error);
    return NextResponse.json({ message }, { status: 500 });
  }
}