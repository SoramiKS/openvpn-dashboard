// app/dashboard/logs/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  RefreshCw,
  Loader2,
  Download,
  XCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  ActionLog,
  ActionStatus,
  VpnActivityLog,
  ActionType,
} from "@prisma/client";

// Extended types
interface ExtendedActionLog extends ActionLog {
  node: { name: string } | null;
  vpnUser: { username: string } | null;
  initiator: { email: string } | null;
  nodeNameSnapshot: string | null;
}
interface ExtendedVpnActivityLog extends VpnActivityLog {
  node: { name: string };
}
interface NodeForSelect {
  id: string;
  name: string;
}

// Byte formatting function
const formatBytes = (
  bytes: number | string | bigint | null | undefined,
  decimals = 2
) => {
  if (bytes === null || bytes === undefined || Number(bytes) === 0)
    return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(Number(bytes)) / Math.log(k));
  return (
    parseFloat((Number(bytes) / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  );
};

const LOGS_PER_PAGE = 10;

export default function LogsPage() {
  const [actionLogs, setActionLogs] = useState<ExtendedActionLog[]>([]);
  const [vpnActivityLogs, setVpnActivityLogs] = useState<ExtendedVpnActivityLog[]>([]);
  const [nodes, setNodes] = useState<NodeForSelect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVpnLogLoading, setIsVpnLogLoading] = useState(true);
  const { toast } = useToast();

  const [totalActionLogs, setTotalActionLogs] = useState(0);
  const [actionLogPage, setActionLogPage] = useState(1);
  const [totalVpnActivityLogs, setTotalVpnActivityLogs] = useState(0);
  const [vpnActivityLogPage, setVpnActivityLogPage] = useState(1);

  const [actionLogFilter, setActionLogFilter] = useState({
    nodeId: "all",
    action: "all",
  });
  const [vpnActivityLogFilter, setVpnActivityLogFilter] = useState<{
    nodeId: string;
    action: string;
    startDate?: Date;
    endDate?: Date;
  }>({ nodeId: "all", action: "all" });

  // --- MODIFIKASI: Fungsi fetch kini mengirim filter ke API ---
  const fetchActionLogs = useCallback(
    async (page: number, filters: typeof actionLogFilter) => {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(LOGS_PER_PAGE),
        nodeId: filters.nodeId,
        action: filters.action,
      });
      try {
        const response = await fetch(`/api/logs?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch action logs");
        const { data, total } = await response.json();
        setActionLogs(data);
        setTotalActionLogs(total);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load action logs.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const fetchVpnActivityLogs = useCallback(
    async (page: number, filters: typeof vpnActivityLogFilter) => {
      setIsVpnLogLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(LOGS_PER_PAGE),
        nodeId: filters.nodeId,
        action: filters.action,
      });
      if (filters.startDate) {
        params.append("startDate", filters.startDate.toISOString());
      }
      if (filters.endDate) {
        params.append("endDate", filters.endDate.toISOString());
      }
      try {
        const response = await fetch(`/api/activity-logs?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch user activity logs");
        const { data, total } = await response.json();
        setVpnActivityLogs(data);
        setTotalVpnActivityLogs(total);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load user activity logs.",
          variant: "destructive",
        });
      } finally {
        setIsVpnLogLoading(false);
      }
    },
    [toast]
  );

  const fetchNodesForSelect = useCallback(async () => {
    try {
      const response = await fetch("/api/nodes");
      if (!response.ok) throw new Error("Failed to fetch nodes");
      setNodes(await response.json());
    } catch {
      toast({
        title: "Error",
        description: "Failed to load nodes for the filter.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleDownloadCsv = () => {
    const headers = ["Timestamp", "Node", "Username", "Action", "Public IP", "VPN IP", "Data Received", "Data Sent"];
    // Note: This now downloads the currently visible (and filtered) page, not the entire dataset.
    const rows = vpnActivityLogs.map((log) =>
      [
        new Date(log.timestamp).toLocaleString(),
        log.node.name,
        log.username || "N/A",
        log.action,
        log.publicIp || "N/A",
        log.vpnIp || "N/A",
        log.bytesReceived?.toString() || "0",
        log.bytesSent?.toString() || "0",
      ].map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `user-activity-logs-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- MODIFIKASI: useEffect kini bergantung pada filter juga ---
  useEffect(() => {
    fetchActionLogs(actionLogPage, actionLogFilter);
  }, [fetchActionLogs, actionLogPage, actionLogFilter]);

  useEffect(() => {
    fetchVpnActivityLogs(vpnActivityLogPage, vpnActivityLogFilter);
  }, [fetchVpnActivityLogs, vpnActivityLogPage, vpnActivityLogFilter]);

  useEffect(() => {
    fetchNodesForSelect();
  }, [fetchNodesForSelect]);


  // --- HAPUS: useMemo untuk filtering client-side tidak lagi diperlukan ---
  // const filteredActionLogs = ...
  // const filteredVpnActivityLogs = ...

  const getLogStatusBadgeVariant = (status: ActionStatus) => {
    switch (status) {
      case ActionStatus.COMPLETED: return "default";
      case ActionStatus.PENDING: return "secondary";
      case ActionStatus.FAILED: return "destructive";
      default: return "outline";
    }
  };

  const combinedLoading = isLoading || isVpnLogLoading;
  const totalActionLogPages = Math.ceil(totalActionLogs / LOGS_PER_PAGE) || 1;
  const totalVpnActivityLogPages = Math.ceil(totalVpnActivityLogs / LOGS_PER_PAGE) || 1;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Logs</h1>
          <p className="text-gray-600">Monitor system events and activities</p>
        </div>
        <Button
          className="hover:shadow-xl hover:scale-105 duration-200 transition-transform"
          variant="outline"
          onClick={() => {
            fetchActionLogs(actionLogPage, actionLogFilter);
            fetchVpnActivityLogs(vpnActivityLogPage, vpnActivityLogFilter);
          }}
          disabled={combinedLoading}
        >
          {combinedLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Action Logs Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            {/* --- MODIFIKASI: Filter handlers kini juga mereset halaman --- */}
            <Select
              value={actionLogFilter.nodeId}
              onValueChange={(value) => {
                setActionLogPage(1);
                setActionLogFilter((prev) => ({ ...prev, nodeId: value }));
              }}
            >
              <SelectTrigger><SelectValue placeholder="Filter by Node" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Nodes</SelectItem>
                {nodes.map((node) => (<SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select
              value={actionLogFilter.action}
              onValueChange={(value) => {
                setActionLogPage(1);
                setActionLogFilter((prev) => ({ ...prev, action: value }));
              }}
            >
              <SelectTrigger><SelectValue placeholder="Filter by Action" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {Object.values(ActionType).map((action) => (<SelectItem key={action} value={action}>{action}</SelectItem>))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              onClick={() => {
                setActionLogPage(1);
                setActionLogFilter({ nodeId: "all", action: "all" });
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Node</TableHead><TableHead>Action</TableHead><TableHead>Status</TableHead><TableHead>User/Details</TableHead><TableHead>Initiator</TableHead></TableRow></TableHeader>
              <TableBody>
                {/* --- MODIFIKASI: Gunakan state `actionLogs` langsung --- */}
                {actionLogs.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8">No logs found.</TableCell></TableRow>
                ) : (
                  actionLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        {log.node ? log.node.name : <span className="text-gray-400 italic">{log.nodeNameSnapshot || "[Node Deleted]"}</span>}
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell><Badge variant={getLogStatusBadgeVariant(log.status)}>{log.status}</Badge></TableCell>
                      <TableCell className="max-w-md truncate" title={log.message || log.details || ""}>
                        {log.vpnUser?.username ? `User: ${log.vpnUser.username}` : log.details}
                        {log.message && ` - ${log.message}`}
                      </TableCell>
                      <TableCell>{log.initiator?.email || 'System'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (actionLogPage > 1) setActionLogPage(actionLogPage - 1); }} /></PaginationItem>
              <PaginationItem><PaginationLink href="#">{actionLogPage} / {totalActionLogPages}</PaginationLink></PaginationItem>
              <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (actionLogPage < totalActionLogPages) setActionLogPage(actionLogPage + 1); }} /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>

      {/* User Activity Logs Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Activity</CardTitle>
            <Button variant="outline" onClick={handleDownloadCsv} disabled={vpnActivityLogs.length === 0}><Download className="h-4 w-4 mr-2" /> Download CSV</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
            {/* --- MODIFIKASI: Filter handlers kini juga mereset halaman --- */}
            <Select
              value={vpnActivityLogFilter.nodeId}
              onValueChange={(value) => {
                setVpnActivityLogPage(1);
                setVpnActivityLogFilter((prev) => ({ ...prev, nodeId: value }));
              }}
            >
              <SelectTrigger className="lg:col-span-1"><SelectValue placeholder="Filter by Node" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Nodes</SelectItem>
                {nodes.map((node) => (<SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select
              value={vpnActivityLogFilter.action}
              onValueChange={(value) => {
                setVpnActivityLogPage(1);
                setVpnActivityLogFilter((prev) => ({ ...prev, action: value }));
              }}
            >
              <SelectTrigger className="lg:col-span-1"><SelectValue placeholder="Filter by Action" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="CONNECT">CONNECT</SelectItem>
                <SelectItem value="DISCONNECT">DISCONNECT</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-full justify-start text-left font-normal truncate lg:col-span-1">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {vpnActivityLogFilter.startDate ? format(vpnActivityLogFilter.startDate, "PPP") : <span>Start Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={vpnActivityLogFilter.startDate} onSelect={(date) => { setVpnActivityLogPage(1); setVpnActivityLogFilter((prev) => ({ ...prev, startDate: date || undefined })); }} initialFocus />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-full justify-start text-left font-normal truncate lg:col-span-1">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {vpnActivityLogFilter.endDate ? format(vpnActivityLogFilter.endDate, "PPP") : <span>End Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={vpnActivityLogFilter.endDate} onSelect={(date) => { setVpnActivityLogPage(1); setVpnActivityLogFilter((prev) => ({ ...prev, endDate: date || undefined })); }} initialFocus />
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              className="lg:col-span-1"
              onClick={() => {
                setVpnActivityLogPage(1);
                setVpnActivityLogFilter({ nodeId: "all", action: "all", startDate: undefined, endDate: undefined });
              }}
            >
              <XCircle className="h-4 w-4 mr-2" /> Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isVpnLogLoading ? (
            <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Timestamp</TableHead><TableHead>Node</TableHead><TableHead>Username</TableHead><TableHead>Action</TableHead><TableHead>Public IP</TableHead><TableHead>VPN IP</TableHead><TableHead>Data Received</TableHead><TableHead>Data Sent</TableHead></TableRow></TableHeader>
              <TableBody>
                {/* --- MODIFIKASI: Gunakan state `vpnActivityLogs` langsung --- */}
                {vpnActivityLogs.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8">No activity found.</TableCell></TableRow>
                ) : (
                  vpnActivityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{log.node.name}</TableCell>
                      <TableCell>{log.username || "N/A"}</TableCell>
                      <TableCell><Badge variant={log.action === "CONNECT" ? "default" : "secondary"}>{log.action}</Badge></TableCell>
                      <TableCell>{log.publicIp || "N/A"}</TableCell>
                      <TableCell>{log.vpnIp || "N/A"}</TableCell>
                      <TableCell>{formatBytes(log.bytesReceived)}</TableCell>
                      <TableCell>{formatBytes(log.bytesSent)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (vpnActivityLogPage > 1) setVpnActivityLogPage(vpnActivityLogPage - 1); }} /></PaginationItem>
              <PaginationItem><PaginationLink href="#">{vpnActivityLogPage} / {totalVpnActivityLogPages}</PaginationLink></PaginationItem>
              <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (vpnActivityLogPage < totalVpnActivityLogPages) setVpnActivityLogPage(vpnActivityLogPage + 1); }} /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  );
}