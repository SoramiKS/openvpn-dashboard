"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Edit, Trash2, Save, X, Loader2, Copy, XCircle } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Node, NodeStatus } from "@prisma/client";
import NodeCopyButton from "@/components/NodeCopyButton";
import { NodeInstallationGuide } from "@/components/NodeInstallationGuide";

interface NodeFormInput {
  name: string;
  ip: string;
  location: string;
  snmpCommunity?: string;
}

interface NodesClientPageProps {
  apiKey: string;
  dashboardUrl: string;
}

export default function NodesClientPage({
  apiKey,
  dashboardUrl,
}: NodesClientPageProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [newNode, setNewNode] = useState<NodeFormInput>({ name: "", ip: "", location: "", snmpCommunity: "public" });
  const [nodeForGuide, setNodeForGuide] = useState<Node | null>(null);

  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editedNode, setEditedNode] = useState<Partial<NodeFormInput> | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<Node | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<NodeStatus | "all">("all");

  const fetchNodes = useCallback(async () => {
    if (nodes.length === 0) setIsLoading(true);
    try {
      const response = await fetch("/api/nodes");
      if (!response.ok) throw new Error("Failed to load node data.");
      const data: Node[] = await response.json();
      setNodes(data);
    } catch (error) {
      if (error instanceof Error)
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast, nodes.length]);

  useEffect(() => {
    fetchNodes();
    const interval = setInterval(fetchNodes, 15000);
    return () => clearInterval(interval);
  }, [fetchNodes]);

  useEffect(() => {
    const triggerMetricsUpdate = () => {
      if (nodes.length === 0) return;
      nodes.forEach((node) => {
        if (node.status === NodeStatus.ONLINE) {
          fetch(`/api/nodes/${node.id}/metrics`).catch((error) =>
            console.error(`Failed to trigger metrics update for ${node.name}:`, error)
          );
        }
      });
    };
    const interval = setInterval(triggerMetricsUpdate, 10000);
    return () => clearInterval(interval);
  }, [nodes]);

  useEffect(() => {
    if (nodeForGuide) setIsGuideModalOpen(true);
  }, [nodeForGuide]);

  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
        const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) || node.ip.includes(searchTerm);
        const matchesStatus = filterStatus === 'all' || node.status === filterStatus;
        return matchesSearch && matchesStatus;
    });
  }, [nodes, searchTerm, filterStatus]);

  const handleProceedToGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNode.name.trim() || !newNode.ip.trim()) {
      toast({ title: "Incomplete Input", description: "Name and IP Address are required.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/nodes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newNode) });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || "Failed to save new node.");
      const createdNode: Node = responseData.node;
      if (!createdNode || !createdNode.id) throw new Error("Invalid response from API.");
      toast({ title: "Success", description: "Node saved successfully. Continue to installation guide." });
      setIsAddModalOpen(false);
      setNodeForGuide(createdNode);
      await fetchNodes();
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to add node.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (node: Node) => {
    setEditingNodeId(node.id);
    setEditedNode({ name: node.name, ip: node.ip, location: node.location ?? "", snmpCommunity: node.snmpCommunity ?? "" });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedNode((prev) => (prev ? { ...prev, [e.target.name]: e.target.value } : null));
  };

  const saveEditedNode = async () => {
    if (!editedNode || !editingNodeId) return;
    if (!editedNode.name?.trim() || !editedNode.ip?.trim()) {
      toast({ title: "Input Error", description: "Name and IP Address cannot be empty.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/nodes/${editingNodeId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editedNode) });
      if (!response.ok) throw new Error((await response.json()).message || "Failed to update node.");
      toast({ title: "Success", description: "Node updated successfully!" });
      setEditingNodeId(null);
      setEditedNode(null);
      await fetchNodes();
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to update node.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEditing = () => { setEditingNodeId(null); setEditedNode(null); };
  const handleDeleteClick = (node: Node) => { setNodeToDelete(node); setIsDeleteModalOpen(true); };
  const handleConfirmDelete = async () => {
    if (!nodeToDelete) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/nodes/${nodeToDelete.id}`, { method: "DELETE" });
      const responseData = await response.json(); 
      if (!response.ok) throw new Error(responseData.message || "Failed to delete node.");
      toast({ title: "Success", description: responseData.message });
      await fetchNodes();
    } catch (error) {
      if (error instanceof Error) toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
      setNodeToDelete(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nodes</h1>
          <p className="text-gray-600">Manage your OpenVPN server nodes</p>
        </div>
        <Button onClick={() => { setNewNode({ name: "", ip: "", location: "", snmpCommunity: "public" }); setIsAddModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Node
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Filter Nodes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
            <Input 
                placeholder="Search by name or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
            />
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as NodeStatus | 'all')}>
                <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {Object.values(NodeStatus).map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button variant="ghost" onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}>
                <XCircle className="h-4 w-4 mr-2" />
                Clear Filters
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Server Nodes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>CPU</TableHead>
                  <TableHead>RAM</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNodes.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8">No nodes found matching the criteria.</TableCell></TableRow>
                ) : (
                  filteredNodes.map((node) => (
                    <TableRow key={node.id}>
                        <TableCell className="font-medium">{editingNodeId === node.id ? <Input name="name" value={editedNode?.name || ""} onChange={handleEditChange} disabled={isSubmitting} /> : <p>{node.name}</p>}</TableCell>
                        <TableCell>{editingNodeId === node.id ? <Input name="ip" value={editedNode?.ip || ""} onChange={handleEditChange} disabled={isSubmitting} /> : node.ip}</TableCell>
                        <TableCell>{editingNodeId === node.id ? <Input name="location" value={editedNode?.location || ""} onChange={handleEditChange} disabled={isSubmitting} /> : node.location}</TableCell>
                        <TableCell><Badge variant={node.status === NodeStatus.ONLINE ? "default" : node.status === NodeStatus.OFFLINE ? "destructive" : "secondary"}>{node.status}</Badge></TableCell>
                        {/* --- PERBAIKAN: Tampilkan data langsung dari 'node' --- */}
                        <TableCell>
                            {node.status === NodeStatus.ONLINE ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-16 bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${node.cpuUsage > 80 ? "bg-red-500" : node.cpuUsage > 60 ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${node.cpuUsage}%` }}></div></div>
                                    <span className="text-sm">{node.cpuUsage}%</span>
                                </div>
                            ) : <span className="text-gray-400">N/A</span>}
                        </TableCell>
                        <TableCell>
                            {node.status === NodeStatus.ONLINE ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-16 bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${node.ramUsage > 80 ? "bg-red-500" : node.ramUsage > 60 ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${node.ramUsage}%` }}></div></div>
                                    <span className="text-sm">{node.ramUsage}%</span>
                                </div>
                            ) : <span className="text-gray-400">N/A</span>}
                        </TableCell>
                        <TableCell>{node.lastSeen ? new Date(node.lastSeen).toLocaleString() : "Never"}</TableCell>
                        <TableCell>
                            {editingNodeId === node.id ? (
                                <div className="flex space-x-2"><Button variant="outline" size="sm" onClick={saveEditedNode} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}<span className="ml-1">Save</span></Button><Button variant="outline" size="sm" onClick={cancelEditing} disabled={isSubmitting} type="button"><X className="h-4 w-4" /><span className="ml-1">Cancel</span></Button></div>
                            ) : (
                                <div className="flex space-x-2"><Button variant="outline" size="sm" onClick={() => startEditing(node)} disabled={isSubmitting} type="button"><Edit className="h-4 w-4" /><span className="ml-1">Edit</span></Button><Button variant="destructive" size="sm" onClick={() => handleDeleteClick(node)} disabled={isSubmitting}><Trash2 className="h-4 w-4" /><span className="ml-1">Delete</span></Button><NodeCopyButton nodeId={node.id} /></div>
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
            <DialogFooter><Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Proceed to Guide</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isGuideModalOpen} onOpenChange={(isOpen) => { setIsGuideModalOpen(isOpen); if (!isOpen) setNodeForGuide(null); }}>
        <DialogContent className="max-w-3xl">{nodeForGuide && <NodeInstallationGuide nodeName={nodeForGuide.name} serverId={nodeForGuide.id} apiKey={apiKey} dashboardUrl={dashboardUrl} onFinish={() => setIsGuideModalOpen(false)} />}</DialogContent>
      </Dialog>

      <Toaster />
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle><DialogDescription>Are you sure you want to delete the node <span className="font-bold">{nodeToDelete?.name}</span>? This action will send a command to the agent to remove itself and cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleConfirmDelete} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Yes, Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
