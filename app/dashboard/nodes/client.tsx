// app/dashboard/nodes/client.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  XCircle,
  FileText,
  Server,
  Cpu,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Node, NodeStatus } from "@prisma/client";
import NodeCopyButton from "@/components/NodeCopyButton";
import { NodeInstallationGuide } from "@/components/NodeInstallationGuide";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { useWS } from "@/components/WebSocketProvider";
import countryEmoji from "country-emoji";
import { useTableSorting } from "@/hooks/useTableSorting";
import { SortableHeader } from "@/components/SortableHeader";
import { useSession } from "next-auth/react";

const getFlagFromLocation = (location: string | null) => {
  if (!location) return "🏳️";
  const parts = location.split(",").map((p) => p.trim());
  const countryName = parts[parts.length - 1];
  if (!countryName) return "🏳️";
  return countryEmoji.flag(countryName) || "🏳️";
};

const COLORS: { [key in NodeStatus]?: string } = {
  ONLINE: "#22c55e",
  OFFLINE: "#ef4444",
  UNKNOWN: "#a1a1aa",
  ERROR: "#f97316",
  DELETING: "#e11d48",
};

interface NodeFormInput {
  name: string;
  ip: string;
  location: string;
  snmpCommunity?: string;
}

interface NodesClientPageProps {
  readonly apiKey: string;
  readonly dashboardUrl: string;
}

export default function NodesClientPage({ apiKey, dashboardUrl }: NodesClientPageProps) {
  // BARU: State lokal untuk menampung data dari provider
  const { sortBy, sortOrder, handleSort } = useTableSorting('name', 'asc');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // BARU: Ambil data yang sudah diproses dari WebSocketProvider
  const { nodesData, isConnected } = useWS();

  // State lainnya tetap sama
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<NodeStatus | "all">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newNode, setNewNode] = useState<NodeFormInput>({ name: "", ip: "", location: "", snmpCommunity: "public" });
  const [nodeForGuide, setNodeForGuide] = useState<Node | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editedNode, setEditedNode] = useState<Partial<NodeFormInput> | null>(null);
  const [nodeToDelete, setNodeToDelete] = useState<Node | null>(null);
  const { data: session } = useSession();

  // BARU: useEffect ini menyinkronkan data dari provider ke state lokal
  useEffect(() => {
    if (nodesData.length > 0) {
      setNodes(nodesData);
      setIsLoading(false);
    }
    // Jika koneksi WS ada tapi data kosong (misal baru connect), set loading true
    if (isConnected && nodesData.length === 0) {
      setIsLoading(true);
    }
  }, [nodesData, isConnected]);

  // DIHAPUS: Semua logika fetch dan useEffect untuk `lastMessage` dihapus dari sini.
  // Provider yang akan menanganinya.

  const fetchNodes = useCallback(async () => {
    try {
      const response = await fetch("/api/nodes");
      if (!response.ok) throw new Error("Failed to reload node data.");
      const data = await response.json();

      // PERBAIKAN: Beri tipe eksplisit pada parameter 'node'
      const typedData: Node[] = data.map((node: Node) => ({
        ...node,
        createdAt: new Date(node.createdAt),
        updatedAt: new Date(node.updatedAt),
        lastSeen: node.lastSeen ? new Date(node.lastSeen) : null,
        deletionStartedAt: node.deletionStartedAt ? new Date(node.deletionStartedAt) : null,
      }));
      setNodes(typedData);
    } catch (error) {
      if (error instanceof Error) toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }, [toast]);


  useEffect(() => {
    if (nodeForGuide) setIsGuideModalOpen(true);
  }, [nodeForGuide]);

  // Semua logika `useMemo` tidak berubah, karena sudah benar
  const nodeStats = useMemo(() => {
    const statusCounts = { ONLINE: 0, OFFLINE: 0, UNKNOWN: 0, ERROR: 0, DELETING: 0 };
    let totalCpu = 0;
    let totalRam = 0;
    let onlineNodeCount = 0;

    nodes.forEach((node) => {
      statusCounts[node.status as keyof typeof statusCounts]++;
      if (node.status === "ONLINE") {
        totalCpu += node.cpuUsage;
        totalRam += node.ramUsage;
        onlineNodeCount++;
      }
    });

    const statusChartData = Object.entries(statusCounts)
      .map(([name, value]) => ({ name, value }))
      .filter((item) => item.value > 0);

    const avgCpu = onlineNodeCount > 0 ? totalCpu / onlineNodeCount : 0;
    const avgRam = onlineNodeCount > 0 ? totalRam / onlineNodeCount : 0;

    return { statusChartData, avgCpu, avgRam, totalNodes: nodes.length, onlineNodes: onlineNodeCount };
  }, [nodes]);

  const filteredAndSortedNodes = useMemo(() => {
    const nodesWithFlags = nodes.map(node => ({ ...node, flag: getFlagFromLocation(node.location) }));

    const filtered = nodesWithFlags.filter((node) => {
      const matchesSearch =
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.ip.includes(searchTerm);
      const matchesStatus = filterStatus === "all" || node.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    if (sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[sortBy as keyof Node];
        const bValue = b[sortBy as keyof Node];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue instanceof Date && bValue instanceof Date) {
          return sortOrder === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    }
    return filtered;
  }, [nodes, searchTerm, filterStatus, sortBy, sortOrder]);

  // Semua handler (add, edit, delete, sort) tidak berubah, tapi mereka memanggil `fetchNodes` untuk sinkronisasi
  const handleProceedToGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNode.name.trim() || !newNode.ip.trim()) {
      return toast({ title: "Incomplete Input", description: "Name and IP Address are required.", variant: "destructive" });
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/nodes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newNode) });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || "Failed to save new node.");

      const createdNode: Node = responseData.node;
      toast({ title: "Success", description: "Node saved successfully. Continue to installation guide." });
      setIsAddModalOpen(false);
      setNodeForGuide(createdNode);
      fetchNodes(); // Ambil data terbaru setelah berhasil menambah
    } catch (error) {
      if (error instanceof Error) toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (node: Node) => {
    setEditingNodeId(node.id);
    setEditedNode({ name: node.name, ip: node.ip, location: node.location ?? "", snmpCommunity: node.snmpCommunity ?? "" });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedNode(prev => (prev ? { ...prev, [e.target.name]: e.target.value } : null));
  };

  const saveEditedNode = async () => {
    if (!editedNode || !editingNodeId) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/nodes/${editingNodeId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editedNode) });
      if (!response.ok) throw new Error((await response.json()).message || "Failed to update node.");
      toast({ title: "Success", description: "Node updated successfully!" });
      setEditingNodeId(null);
      setEditedNode(null);
      fetchNodes();
    } catch (error) {
      if (error instanceof Error) toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEditing = () => {
    setEditingNodeId(null);
    setEditedNode(null);
  };

  const handleDeleteClick = (node: Node) => {
    setNodeToDelete(node);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!nodeToDelete) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/nodes/${nodeToDelete.id}`, { method: "DELETE" });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || "Failed to delete node.");
      toast({ title: "Success", description: responseData.message });
      fetchNodes();
    } catch (error) {
      if (error instanceof Error) toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
      setNodeToDelete(null);
    }
  };

  // Render method tidak berubah
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nodes</h1>
          <p className="text-gray-600">Manage and monitor your OpenVPN server nodes</p>
        </div>
        {session?.user?.role === 'ADMIN' && (
          <Button onClick={() => { setNewNode({ name: "", ip: "", location: "", snmpCommunity: "public" }); setIsAddModalOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Node
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-xl hover:scale-105 duration-200 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Node Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="h-48 w-full">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={nodeStats.statusChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={40}>
                        {nodeStats.statusChartData.map((entry) => <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS] || "#cccccc"} stroke={COLORS[entry.name as keyof typeof COLORS] || "#cccccc"} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {nodeStats.statusChartData.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] || "#cccccc" }}></span>
                        <span>{entry.name}</span>
                      </div>
                      <span className="font-medium">{entry.value}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex items-center justify-between text-sm font-bold">
                    <span>Total Nodes</span>
                    <span>{nodeStats.totalNodes}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 hover:shadow-xl hover:scale-105 duration-200 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Resource Usage (Online Nodes)</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1"><span className="text-sm font-medium">CPU Usage</span><span className="text-sm text-muted-foreground">{nodeStats.avgCpu.toFixed(1)}%</span></div>
                  <div className="w-full bg-muted rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${nodeStats.avgCpu}%` }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1"><span className="text-sm font-medium">RAM Usage</span><span className="text-sm text-muted-foreground">{nodeStats.avgRam.toFixed(1)}%</span></div>
                  <div className="w-full bg-muted rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${nodeStats.avgRam}%` }}></div></div>
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t">Based on {nodeStats.onlineNodes} online nodes from a total of {nodeStats.totalNodes}.</div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Filter Nodes</CardTitle></CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <Input placeholder="Search by name or IP..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-grow" />
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as NodeStatus | "all")}>
            <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(NodeStatus).map((status) => (<SelectItem key={status} value={status}>{status}</SelectItem>))}
            </SelectContent>
          </Select>
          <Button variant="ghost" onClick={() => { setSearchTerm(""); setFilterStatus("all"); }}>
            <XCircle className="h-4 w-4 mr-2" />Clear Filters
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Server Nodes List</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader column="name" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>Name</SortableHeader>
                  <SortableHeader column="ip" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>IP Address</SortableHeader>
                  <SortableHeader column="location" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>Location</SortableHeader>
                  <SortableHeader column="status" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>Status</SortableHeader>
                  <SortableHeader column="cpuUsage" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>CPU</SortableHeader>
                  <SortableHeader column="ramUsage" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>RAM</SortableHeader>
                  <SortableHeader column="lastSeen" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}>Last Seen</SortableHeader>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedNodes.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8">No nodes found matching the criteria.</TableCell></TableRow>
                ) : (
                  filteredAndSortedNodes.map((node) => (
                    <TableRow key={node.id}>
                      <TableCell className="font-medium">
                        {editingNodeId === node.id ? <Input name="name" value={editedNode?.name || ""} onChange={handleEditChange} disabled={isSubmitting} /> : node.name}
                      </TableCell>
                      <TableCell>
                        {editingNodeId === node.id ? <Input name="ip" value={editedNode?.ip || ""} onChange={handleEditChange} disabled={isSubmitting} /> : node.ip}
                      </TableCell>
                      <TableCell>
                        {editingNodeId === node.id ? <Input name="location" value={editedNode?.location || ""} onChange={handleEditChange} disabled={isSubmitting} /> : <>{node.flag} {node.location}</>}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          let badgeVariant: "default" | "destructive" | "secondary";
                          if (node.status === NodeStatus.ONLINE) {
                            badgeVariant = "default";
                          } else if (node.status === NodeStatus.OFFLINE) {
                            badgeVariant = "destructive";
                          } else {
                            badgeVariant = "secondary";
                          }
                          return <Badge variant={badgeVariant}>{node.status}</Badge>;
                        })()}
                      </TableCell>
                      <TableCell>
                        {node.status === NodeStatus.ONLINE ? (
                          (() => {
                            let cpuColorClass = "bg-green-500";
                            if (node.cpuUsage > 80) {
                              cpuColorClass = "bg-red-500";
                            } else if (node.cpuUsage > 60) {
                              cpuColorClass = "bg-yellow-500";
                            }
                            return (
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${cpuColorClass}`}
                                    style={{ width: `${node.cpuUsage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm">{node.cpuUsage}%</span>
                              </div>
                            );
                          })()
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {node.status === NodeStatus.ONLINE ? (
                          (() => {
                            let ramColorClass = "bg-green-500";
                            if (node.ramUsage > 80) {
                              ramColorClass = "bg-red-500";
                            } else if (node.ramUsage > 60) {
                              ramColorClass = "bg-yellow-500";
                            }
                            return (
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div className={`h-2 rounded-full ${ramColorClass}`} style={{ width: `${node.ramUsage}%` }}></div>
                                </div>
                                <span className="text-sm">{node.ramUsage}%</span>
                              </div>
                            );
                          })()
                        ) : (<span className="text-gray-400">N/A</span>)}
                      </TableCell>
                      <TableCell>{node.lastSeen ? node.lastSeen.toLocaleString('id-ID') : "Never"}</TableCell>
                      <TableCell>
                        {editingNodeId === node.id ? (
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={saveEditedNode} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}<span className="ml-1">Save</span></Button>
                            <Button variant="outline" size="sm" onClick={cancelEditing} disabled={isSubmitting} type="button"><X className="h-4 w-4" /><span className="ml-1">Cancel</span></Button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => startEditing(node)} disabled={isSubmitting} type="button"><Edit className="h-4 w-4" /><span className="ml-1">Edit</span></Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(node)} disabled={isSubmitting}><Trash2 className="h-4 w-4" /><span className="ml-1">Delete</span></Button>
                            <Button variant="secondary" size="sm" onClick={() => setNodeForGuide(node)} type="button"><FileText className="h-4 w-4" /><span className="ml-1">Guide</span></Button>
                            <NodeCopyButton nodeId={node.id} />
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {session?.user?.role === 'ADMIN' && (
        <>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader><DialogTitle>Add New Node</DialogTitle><DialogDescription>Enter the details for the new server node. After saving, you will be guided through the installation.</DialogDescription></DialogHeader>
              <form onSubmit={handleProceedToGuide}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" value={newNode.name} onChange={(e) => setNewNode({ ...newNode, name: e.target.value })} className="col-span-3" disabled={isSubmitting} /></div>
                  <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="ip" className="text-right">IP Address</Label><Input id="ip" value={newNode.ip} onChange={(e) => setNewNode({ ...newNode, ip: e.target.value })} className="col-span-3" disabled={isSubmitting} /></div>
                  <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="location" className="text-right">Location</Label><Input id="location" value={newNode.location} onChange={(e) => setNewNode({ ...newNode, location: e.target.value })} className="col-span-3" disabled={isSubmitting} /></div>
                  <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="snmpCommunity" className="text-right">SNMP Community</Label><Input id="snmpCommunity" value={newNode.snmpCommunity} onChange={(e) => setNewNode({ ...newNode, snmpCommunity: e.target.value })} className="col-span-3" disabled={isSubmitting} /></div>
                </div>
                <DialogFooter><Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting && (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)} Proceed to Guide</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isGuideModalOpen} onOpenChange={(isOpen) => { setIsGuideModalOpen(isOpen); if (!isOpen) setNodeForGuide(null); }}>
            <DialogContent className="max-w-3xl">{nodeForGuide && (<NodeInstallationGuide nodeName={nodeForGuide.name} serverId={nodeForGuide.id} apiKey={apiKey} dashboardUrl={dashboardUrl} onFinish={() => setIsGuideModalOpen(false)} />)}</DialogContent>
          </Dialog>
          <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent>
              <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle><DialogDescription>Are you sure you want to delete the node <span className="font-bold">{nodeToDelete?.name}</span>? This action will send a command to the agent to remove itself and cannot be undone.</DialogDescription></DialogHeader>
              <DialogFooter><Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleConfirmDelete} disabled={isSubmitting}>{isSubmitting && (<Loader2 className="mr-2 h-4 w-4 animate-spin" />)} Yes, Delete</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
      <Toaster />
    </div>
  );
}