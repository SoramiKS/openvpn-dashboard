"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { format } from "date-fns"; // BARU
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // BARU
import { Calendar } from "@/components/ui/calendar"; // BARU
import { RefreshCw, Loader2, Download, XCircle, Calendar as CalendarIcon } from "lucide-react"; // BARU
import { useToast } from "@/hooks/use-toast";
import { ActionLog, ActionStatus, VpnActivityLog, ActionType } from "@prisma/client";

// Tipe yang diperluas
interface ExtendedActionLog extends ActionLog {
  node: { name: string };
  vpnUser: { username: string } | null;
}
interface ExtendedVpnActivityLog extends VpnActivityLog {
  node: { name: string };
}
interface NodeForSelect {
  id: string;
  name: string;
}

// Fungsi format byte
const formatBytes = (bytes: number | string | bigint | null | undefined, decimals = 2) => {
  if (bytes === null || bytes === undefined || Number(bytes) === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(Number(bytes)) / Math.log(k));
  return parseFloat((Number(bytes) / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function LogsPage() {
  const [actionLogs, setActionLogs] = useState<ExtendedActionLog[]>([]);
  const [vpnActivityLogs, setVpnActivityLogs] = useState<ExtendedVpnActivityLog[]>([]);
  const [nodes, setNodes] = useState<NodeForSelect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVpnLogLoading, setIsVpnLogLoading] = useState(true);
  const { toast } = useToast();

  const [actionLogFilter, setActionLogFilter] = useState({ nodeId: 'all', action: 'all' });
  // --- MODIFIKASI: State filter dengan tanggal ---
  const [vpnActivityLogFilter, setVpnActivityLogFilter] = useState<{
    nodeId: string;
    action: string;
    startDate?: Date;
    endDate?: Date;
  }>({ nodeId: 'all', action: 'all' });

  // ... (fungsi fetchActionLogs, fetchVpnActivityLogs, fetchNodesForSelect tidak berubah)
  const fetchActionLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/logs");
      if (!response.ok) throw new Error("Gagal mengambil action logs");
      setActionLogs(await response.json());
    } catch {
      toast({
        title: "Error",
        description: "Gagal memuat action logs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchVpnActivityLogs = useCallback(async () => {
    setIsVpnLogLoading(true);
    try {
      const response = await fetch("/api/activity-logs");
      if (!response.ok) throw new Error("Gagal mengambil user activity logs");
      setVpnActivityLogs(await response.json());
    } catch {
      toast({
        title: "Error",
        description: "Gagal memuat user activity logs.",
        variant: "destructive",
      });
    } finally {
      setIsVpnLogLoading(false);
    }
  }, [toast]);

  const fetchNodesForSelect = useCallback(async () => {
    try {
      const response = await fetch("/api/nodes");
      if (!response.ok) throw new Error("Gagal mengambil node");
      setNodes(await response.json());
    } catch {
      toast({
        title: "Error",
        description: "Gagal memuat node untuk filter.",
        variant: "destructive",
      });
    }
  }, [toast]);


  const handleDownloadCsv = () => {
    // ... (fungsi ini tidak berubah)
    const headers = ["Timestamp", "Node", "Username", "Action", "Public IP", "VPN IP", "Data Received", "Data Sent"]; const rows = filteredVpnActivityLogs.map(log => [new Date(log.timestamp).toLocaleString(), log.node.name, log.username || "N/A", log.action, log.publicIp || "N/A", log.vpnIp || "N/A", log.bytesReceived?.toString() || "0", log.bytesSent?.toString() || "0"].map(field => `"${field.replace(/"/g, '""')}"`).join(',')); const csvContent = [headers.join(','), ...rows].join('\n'); const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); const link = document.createElement('a'); const url = URL.createObjectURL(blob); link.setAttribute('href', url); link.setAttribute('download', `user-activity-logs-${new Date().toISOString().split('T')[0]}.csv`); document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  useEffect(() => {
    fetchActionLogs();
    fetchVpnActivityLogs();
    fetchNodesForSelect();
  }, [fetchActionLogs, fetchVpnActivityLogs, fetchNodesForSelect]);

  const filteredActionLogs = useMemo(() => {
    // ... (logika ini tidak berubah)
    return actionLogs.filter(log => { const matchesNode = actionLogFilter.nodeId === 'all' || log.nodeId === actionLogFilter.nodeId; const matchesAction = actionLogFilter.action === 'all' || log.action === actionLogFilter.action; return matchesNode && matchesAction; });
  }, [actionLogs, actionLogFilter]);

  // --- MODIFIKASI: Logika filter dengan tanggal ---
  const filteredVpnActivityLogs = useMemo(() => {
    return vpnActivityLogs.filter(log => {
      const matchesNode = vpnActivityLogFilter.nodeId === 'all' || log.nodeId === vpnActivityLogFilter.nodeId;
      const matchesAction = vpnActivityLogFilter.action === 'all' || log.action === vpnActivityLogFilter.action;

      const logDate = new Date(log.timestamp);
      const startDate = vpnActivityLogFilter.startDate;
      const endDate = vpnActivityLogFilter.endDate;

      // Atur startDate ke awal hari
      if (startDate) {
        startDate.setHours(0, 0, 0, 0);
      }
      // Atur endDate ke akhir hari agar inklusif
      if (endDate) {
        endDate.setHours(23, 59, 59, 999);
      }

      const matchesDate = (!startDate || logDate >= startDate) && (!endDate || logDate <= endDate);

      return matchesNode && matchesAction && matchesDate;
    });
  }, [vpnActivityLogs, vpnActivityLogFilter]);

  const getLogStatusBadgeVariant = (status: ActionStatus) => { /* ... (tidak berubah) ... */ switch (status) { case ActionStatus.COMPLETED: return "default"; case ActionStatus.PENDING: return "secondary"; case ActionStatus.FAILED: return "destructive"; default: return "outline"; } };
  const combinedLoading = isLoading || isVpnLogLoading;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Logs Sistem</h1>
          <p className="text-gray-600">Memantau event dan aktivitas sistem</p>
        </div>
        <Button variant="outline" onClick={() => { fetchActionLogs(); fetchVpnActivityLogs(); fetchNodesForSelect(); }} disabled={combinedLoading}>
          {combinedLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>

      {/* --- Kartu Recent Activity (tidak berubah signifikan) --- */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <Select value={actionLogFilter.nodeId} onValueChange={(value) => setActionLogFilter(prev => ({ ...prev, nodeId: value }))}>
              <SelectTrigger><SelectValue placeholder="Filter Node" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Semua Node</SelectItem>{nodes.map(node => <SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={actionLogFilter.action} onValueChange={(value) => setActionLogFilter(prev => ({ ...prev, action: value }))}>
              <SelectTrigger><SelectValue placeholder="Filter Aksi" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Semua Aksi</SelectItem>{Object.values(ActionType).map(action => <SelectItem key={action} value={action}>{action}</SelectItem>)}</SelectContent>
            </Select>
            <Button variant="ghost" onClick={() => setActionLogFilter({ nodeId: 'all', action: 'all' })}><XCircle className="h-4 w-4 mr-2" />Bersihkan</Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* ... (Isi tabel recent activity tidak berubah) ... */}
          {isLoading ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div>) : (<Table> <TableHeader> <TableRow> <TableHead>Tanggal</TableHead> <TableHead>Node</TableHead> <TableHead>Aksi</TableHead> <TableHead>Status</TableHead> <TableHead>Pengguna/Rincian</TableHead> </TableRow> </TableHeader> <TableBody> {filteredActionLogs.length === 0 ? (<TableRow><TableCell colSpan={5} className="text-center py-8">Tidak ada log yang cocok dengan filter.</TableCell></TableRow>) : (filteredActionLogs.map((log) => (<TableRow key={log.id}> <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell> <TableCell>{log.node?.name || "N/A"}</TableCell> <TableCell>{log.action}</TableCell> <TableCell><Badge variant={getLogStatusBadgeVariant(log.status)}>{log.status}</Badge></TableCell> <TableCell className="max-w-md truncate" title={log.message || log.details || ""}> {log.vpnUser?.username ? `User: ${log.vpnUser.username}` : log.details}{log.message && ` - ${log.message}`} </TableCell> </TableRow>)))} </TableBody> </Table>)}
        </CardContent>
      </Card>

      {/* --- Kartu User Activity (DENGAN FILTER TANGGAL) --- */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Activity</CardTitle>
            <Button variant="outline" onClick={handleDownloadCsv} disabled={filteredVpnActivityLogs.length === 0}>
              <Download className="h-4 w-4 mr-2" /> Download CSV
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
            <Select value={vpnActivityLogFilter.nodeId} onValueChange={(value) => setVpnActivityLogFilter(prev => ({ ...prev, nodeId: value }))}>
              <SelectTrigger className="lg:col-span-1"><SelectValue placeholder="Filter Node" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Semua Node</SelectItem>{nodes.map(node => <SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={vpnActivityLogFilter.action} onValueChange={(value) => setVpnActivityLogFilter(prev => ({ ...prev, action: value }))}>
              <SelectTrigger className="lg:col-span-1"><SelectValue placeholder="Filter Aksi" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Semua Aksi</SelectItem><SelectItem value="CONNECT">CONNECT</SelectItem><SelectItem value="DISCONNECT">DISCONNECT</SelectItem></SelectContent>
            </Select>

            {/* --- BARU: Date Picker untuk Tanggal Mulai --- */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-full justify-start text-left font-normal lg:col-span-1">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {vpnActivityLogFilter.startDate ? format(vpnActivityLogFilter.startDate, "PPP") : <span>Tanggal Mulai</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={vpnActivityLogFilter.startDate} onSelect={(date) => setVpnActivityLogFilter(prev => ({ ...prev, startDate: date }))} initialFocus /></PopoverContent>
            </Popover>

            {/* --- BARU: Date Picker untuk Tanggal Akhir --- */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-full justify-start text-left font-normal lg:col-span-1">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {vpnActivityLogFilter.endDate ? format(vpnActivityLogFilter.endDate, "PPP") : <span>Tanggal Akhir</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={vpnActivityLogFilter.endDate} onSelect={(date) => setVpnActivityLogFilter(prev => ({ ...prev, endDate: date }))} initialFocus /></PopoverContent>
            </Popover>

            <Button variant="ghost" className="lg:col-span-1" onClick={() => setVpnActivityLogFilter({ nodeId: 'all', action: 'all', startDate: undefined, endDate: undefined })}>
              <XCircle className="h-4 w-4 mr-2" /> Bersihkan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isVpnLogLoading ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div>) : (
            <Table>
              {/* ... (Isi tabel user activity tidak berubah) ... */}
              <TableHeader> <TableRow> <TableHead>Timestamp</TableHead> <TableHead>Node</TableHead> <TableHead>Username</TableHead> <TableHead>Action</TableHead> <TableHead>Public IP</TableHead> <TableHead>VPN IP</TableHead> <TableHead>Data Received</TableHead> <TableHead>Data Sent</TableHead> </TableRow> </TableHeader> <TableBody> {filteredVpnActivityLogs.length === 0 ? (<TableRow><TableCell colSpan={8} className="text-center py-8">Tidak ada aktivitas yang cocok dengan filter.</TableCell></TableRow>) : (filteredVpnActivityLogs.map((log) => (<TableRow key={log.id}> <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell> <TableCell>{log.node.name}</TableCell> <TableCell>{log.username || 'N/A'}</TableCell> <TableCell><Badge variant={log.action === 'CONNECT' ? 'default' : 'secondary'}>{log.action}</Badge></TableCell> <TableCell>{log.publicIp || 'N/A'}</TableCell> <TableCell>{log.vpnIp || 'N/A'}</TableCell> <TableCell>{formatBytes(log.bytesReceived)}</TableCell> <TableCell>{formatBytes(log.bytesSent)}</TableCell> </TableRow>)))} </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}