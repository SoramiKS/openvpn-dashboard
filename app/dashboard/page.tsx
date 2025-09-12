// app/dashboard/page.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Server,
  Users,
  Activity,
  Shield,
  Loader2,
  Cpu,
  MemoryStick,
  ArrowDown,
  ArrowUp,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Node,
  VpnUser,
  VpnCertificateStatus,
  NodeStatus,
  ActionLog,
  VpnActivityLog,
} from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // BARU: Impor Button
import { useSession } from "next-auth/react"; // BARU: Impor useSession untuk memeriksa role

// Tipe data yang diperluas
interface NodeWithMetrics extends Node {
  cpuUsage: number;
  ramUsage: number;
}
type RecentLog =
  | (ActionLog & { node: { name: string } })
  | (VpnActivityLog & { node: { name: string } });

// Fungsi format byte (tetap sama)
const formatBytes = (
  bytes: number | string | bigint | null | undefined,
  decimals = 2
) => {
  if (bytes === null || bytes === undefined || Number(bytes) === 0)
    return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(Number(bytes)) / Math.log(k));
  return (
    parseFloat((Number(bytes) / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  );
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [nodesData, setNodesData] = useState<NodeWithMetrics[]>([]);
  const [vpnUsersData, setVpnUsersData] = useState<VpnUser[]>([]);
  const [recentLogs, setRecentLogs] = useState<RecentLog[]>([]);
  const [trafficStats, setTrafficStats] = useState({
    totalSent: "0",
    totalReceived: "0",
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fungsi fetch data awal tetap diperlukan untuk memuat data saat pertama kali halaman dibuka
  const fetchInitialDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [nodesRes, usersRes, recentLogsRes, trafficRes] = await Promise.all(
        [
          fetch("/api/nodes"),
          fetch("/api/profiles"),
          fetch("/api/logs/recent"),
          fetch("/api/stats/traffic"),
        ]
      );

      if (!nodesRes.ok || !usersRes.ok || !recentLogsRes.ok || !trafficRes.ok) {
        throw new Error("Gagal mengambil sebagian data dashboard.");
      }

      setNodesData(await nodesRes.json());
      setVpnUsersData(await usersRes.json());
      setRecentLogs(await recentLogsRes.json());
      setTrafficStats(await trafficRes.json());
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // --- BAGIAN BARU: LOGIKA WEBSOCKET ---
  useEffect(() => {
    fetchInitialDashboardData();
  }, [fetchInitialDashboardData]);


  // --- TIDAK ADA PERUBAHAN DARI SINI KE BAWAH ---
  // Semua logika useMemo, getSystemStatus, dan JSX tetap sama persis
  const stats = useMemo(() => {
    const onlineNodes = nodesData.filter((n) => n.status === NodeStatus.ONLINE);
    const statusCounts = nodesData.reduce((acc, node) => {
      acc[node.status] = (acc[node.status] || 0) + 1;
      return acc;
    }, {} as Record<NodeStatus, number>);
    const chartData = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
    const avgCpu =
      onlineNodes.length > 0
        ? onlineNodes.reduce((sum, node) => sum + node.cpuUsage, 0) /
        onlineNodes.length
        : 0;
    const avgRam =
      onlineNodes.length > 0
        ? onlineNodes.reduce((sum, node) => sum + node.ramUsage, 0) /
        onlineNodes.length
        : 0;
    const topCpuNodes = [...onlineNodes]
      .sort((a, b) => b.cpuUsage - a.cpuUsage)
      .slice(0, 3);
    const topRamNodes = [...onlineNodes]
      .sort((a, b) => b.ramUsage - a.ramUsage)
      .slice(0, 3);

    return {
      totalNodes: nodesData.length,
      onlineNodesCount: onlineNodes.length,
      totalUsers: vpnUsersData.length,
      validUsersCount: vpnUsersData.filter(
        (u) => u.status === VpnCertificateStatus.VALID
      ).length,
      activeSessions: vpnUsersData.filter((u) => u.isActive).length,
      statusChartData: chartData,
      avgCpu: parseFloat(avgCpu.toFixed(2)),
      avgRam: parseFloat(avgRam.toFixed(2)),
      topCpuNodes,
      topRamNodes,
    };
  }, [nodesData, vpnUsersData]);

  const getSystemStatus = () => {
    if (stats.totalNodes === 0)
      return {
        status: "No Nodes",
        description: "Add a node to begin monitoring.",
        color: "text-gray-600",
      };
    const onlinePercentage = (stats.onlineNodesCount / stats.totalNodes) * 100;
    const offlineCount = stats.totalNodes - stats.onlineNodesCount;
    if (onlinePercentage === 100)
      return {
        status: "Healthy",
        description: "All systems are operating normally.",
        color: "text-green-600",
      };
    if (onlinePercentage >= 90)
      return {
        status: "Warning",
        description: `${offlineCount} node(s) may be offline.`,
        color: "text-yellow-500",
      };
    if (onlinePercentage >= 50)
      return {
        status: "Degraded",
        description: `Partial outage. ${offlineCount} node(s) are offline.`,
        color: "text-orange-600",
      };
    return {
      status: "Critical",
      description: `Major outage. ${offlineCount} node(s) are offline.`,
      color: "text-red-600",
    };
  };
  const systemStatusInfo = getSystemStatus();
  const COLORS: Record<string, string> = {
    ONLINE: "#22c55e",
    OFFLINE: "#ef4444",
    DELETING: "#f97316",
    UNKNOWN: "#64748b",
    ERROR: "#e11d48",
    PENDING: "#a1a1aa",
  };
  const getProgressBarColor = (val: number) => {
    if (val > 80) return "bg-red-500";
    if (val > 60) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <div className="space-y-6 p-6">
      {/* DIUBAH: Mengubah layout menjadi flex untuk mensejajarkan tombol */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Overview</h1>
          <p className="text-gray-600">
            Monitor your OpenVPN infrastructure at a glance.
          </p>
        </div>
        {/* DIUBAH: Tombol sekarang menjadi Link yang mengarah ke halaman profil dengan query parameter */}
        {session?.user?.role === "ADMIN" && (
          <Link href="/dashboard/profiles?action=create" passHref>
            <Button className="hover:shadow-xl hover:scale-105 duration-200 transition-transform">
              <Plus className="h-4 w-4 mr-2" />
              <p>
                Create Profile
              </p>
            </Button>
          </Link>
        )}
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <>
          {/* Kartu Statistik Atas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="hover:shadow-xl hover:scale-105 duration-200 transition-transform">
              <Link href="/dashboard/nodes">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Nodes
                  </CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalNodes}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.onlineNodesCount} online
                  </p>
                </CardContent>
              </Link>
            </Card>
            <Card className="hover:shadow-xl hover:scale-105 duration-200 transition-transform">
              <Link href="/dashboard/users">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.validUsersCount} valid
                  </p>
                </CardContent>
              </Link>
            </Card>
            <Card className="hover:shadow-xl hover:scale-105 duration-200 transition-transform">
              <Link href="/dashboard/users">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Sessions
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeSessions}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently connected
                  </p>
                </CardContent>
              </Link>
            </Card>
            <Card className="hover:shadow-xl hover:scale-105 duration-200 transition-transform">
              <Link href="/dashboard/logs">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Traffic (24h)
                  </CardTitle>
                  <ArrowUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold flex items-center">
                    <ArrowUp className="h-4 w-4 mr-2 text-gray-500" />
                    {formatBytes(trafficStats.totalSent)}
                  </div>
                  <div className="text-lg font-bold flex items-center">
                    <ArrowDown className="h-4 w-4 mr-2 text-gray-500" />
                    {formatBytes(trafficStats.totalReceived)}
                  </div>
                </CardContent>
              </Link>
            </Card>
            <Card className="hover:shadow-xl hover:scale-105 duration-200 transition-transform">
              <Link href="/dashboard/nodes">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    System Status
                  </CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${systemStatusInfo.color}`}>
                    {systemStatusInfo.status}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {systemStatusInfo.description}
                  </p>
                </CardContent>
              </Link>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Node Status dengan Donut Chart */}
              <Card className="hover:shadow-xl hover:scale-105 duration-200 transition-transform">
                <Link href="/dashboard/nodes">
                  <CardHeader>
                    <CardTitle>Node Status</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="h-48 w-full">
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={stats.statusChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                          >
                            {stats.statusChartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[entry.name] || "#cccccc"}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      {stats.statusChartData.map((entry) => (
                        <div
                          key={entry.name}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center">
                            <span
                              className="h-3 w-3 rounded-full mr-2"
                              style={{
                                backgroundColor: COLORS[entry.name] || "#cccccc",
                              }}
                            ></span>
                            <span>{entry.name}</span>
                          </div>
                          <span className="font-medium">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Link>
              </Card>
              {/* Resource Usage dengan Rata-rata & Top 3 */}
              <Card className="hover:shadow-xl hover:scale-105 duration-200 transition-transform">
                <Link href="/dashboard/nodes">
                  <CardHeader>
                    <CardTitle>Average Resource Usage (Online Nodes)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm font-medium">
                          <span className="flex items-center">
                            <Cpu className="h-4 w-4 mr-2" /> Average CPU
                          </span>
                          <span>{stats.avgCpu}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`${getProgressBarColor(
                              stats.avgCpu
                            )} h-2.5 rounded-full`}
                            style={{ width: `${stats.avgCpu}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm font-medium">
                          <span className="flex items-center">
                            <MemoryStick className="h-4 w-4 mr-2" /> Average RAM
                          </span>
                          <span>{stats.avgRam}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`${getProgressBarColor(
                              stats.avgRam
                            )} h-2.5 rounded-full`}
                            style={{ width: `${stats.avgRam}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">
                            Top 3 Utilized (CPU)
                          </h4>
                          <div className="space-y-2 text-xs text-muted-foreground">
                            {stats.topCpuNodes.map((node) => (
                              <div key={node.id} className="flex justify-between">
                                <span>{node.name}</span>
                                <span className="font-mono">
                                  {node.cpuUsage}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-2">
                            Top 3 Utilized (RAM)
                          </h4>
                          <div className="space-y-2 text-xs text-muted-foreground">
                            {stats.topRamNodes.map((node) => (
                              <div key={node.id} className="flex justify-between">
                                <span>{node.name}</span>
                                <span className="font-mono">
                                  {node.ramUsage}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </div>

            {/* Aktivitas Terbaru */}
            <Card className="lg:col-span-1 hover:shadow-xl hover:scale-105 duration-200 transition-transform">
              <Link href="/dashboard/logs">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentLogs.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No recent activities.
                      </p>
                    ) : (
                      recentLogs.map((log) => {
                        // --- PERBAIKAN: Gunakan type guard untuk membedakan log ---
                        const isActionLog = "details" in log;
                        const logDate = isActionLog
                          ? log.createdAt
                          : log.timestamp;
                        const logAction = log.action;

                        return (
                          <div
                            key={log.id}
                            className="flex items-start space-x-3"
                          >
                            <div className="flex-shrink-0">
                              <div
                                className={`h-2 w-2 rounded-full mt-1.5 ${logAction === "CONNECT"
                                  ? "bg-green-500"
                                  : logAction === "DISCONNECT"
                                    ? "bg-gray-400"
                                    : "bg-blue-500"
                                  }`}
                              ></div>
                            </div>
                            <div className="text-sm">
                              {isActionLog ? (
                                <p>
                                  User{" "}
                                  <span className="font-semibold">
                                    {log.details}
                                  </span>{" "}
                                  was{" "}
                                  {log.action === "CREATE_USER"
                                    ? "created"
                                    : "revoked"}{" "}
                                  on{" "}
                                  <span className="font-semibold">
                                    {log.nodeNameSnapshot ?? "Unknown node"}
                                  </span>
                                  .
                                </p>
                              ) : (
                                <p>
                                  User{" "}
                                  <span className="font-semibold">
                                    {log.username}
                                  </span>{" "}
                                  {log.action.toLowerCase()} to{" "}
                                  <span className="font-semibold">
                                    {log.node.name}
                                  </span>
                                  .
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {new Date(logDate).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
