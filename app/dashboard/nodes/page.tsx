"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Plus, Edit, Trash2, Save, X, Loader2 } from "lucide-react";
import { Node, NodeStatus } from "@/lib/generated/prisma";
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
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import NodeCopyButton from "@/components/NodeCopyButton";

interface NodeFormInput {
  name: string;
  ip: string;
  location: string;
}

export default function NodesPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNode, setNewNode] = useState<NodeFormInput>({
    name: "",
    ip: "",
    location: "",
  });
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editedNode, setEditedNode] = useState<Partial<NodeFormInput> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const translations = {
    addModalTitle: { id: 'Tambah Node Baru', en: 'Add New Node' },
    addModalDescription: { id: 'Masukkan detail untuk node server baru.', en: 'Enter the details for the new server node.' },
    labelName: { id: 'Nama', en: 'Name' },
    labelIpAddress: { id: 'IP Address', en: 'IP Address' },
    labelLocation: { id: 'Lokasi', en: 'Location' },
    buttonCancel: { id: 'Batal', en: 'Cancel' },
    buttonAdd: { id: 'Tambah Node', en: 'Add Node' },
    buttonSave: { id: 'Simpan', en: 'Save' },
    buttonCancelEdit: { id: 'Batal', en: 'Cancel' },
  };
  const [currentLang, setCurrentLang] = useState('id'); // Default: Indonesia

// GANTI useEffect LAMA YANG MENGGUNAKAN MutationObserver DENGAN YANG INI

useEffect(() => {
  // 1. Cari elemen pembungkus GTranslate
  const wrapper = document.querySelector('.gtranslate_wrapper');

  // 2. Buat fungsi yang akan dijalankan setiap kali ada klik di dalam wrapper
  const handleLanguageChange = (event: Event) => {
    const target = event.target as HTMLElement;

    // 3. Cek apakah yang diklik (atau elemen induknya) adalah link bahasa
    const langLink = target.closest('a[data-gt-lang]');

    if (langLink) {
      const lang = langLink.getAttribute('data-gt-lang');
      if (lang) {
        console.log(`Bahasa diubah ke: ${lang}`); // <-- Tambahkan ini untuk debugging di console browser
        setCurrentLang(lang);
      }
    }
  };

  // 4. Pasang "pendengar" ke wrapper
  if (wrapper) {
    wrapper.addEventListener('click', handleLanguageChange);
  }

  // 5. Fungsi cleanup: Penting untuk menghapus "pendengar" saat komponen tidak lagi digunakan
  return () => {
    if (wrapper) {
      wrapper.removeEventListener('click', handleLanguageChange);
    }
  };
}, []); // <-- Array dependensi kosong, berarti hanya berjalan sekali saat komponen pertama kali muncul

  // 4. Fungsi helper 't' untuk mengambil terjemahan
  const t = useCallback((key: keyof typeof translations) => {
    return translations[key][currentLang as keyof typeof translations[typeof key]] || translations[key]['id'];
  }, [currentLang, translations]);

  const fetchNodes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/nodes");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Node[] = await response.json();
      setNodes(data);
    } catch (error) {
      console.error("Failed to fetch nodes:", error);
      toast({
        title: "Error",
        description: "Failed to load nodes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNode.name.trim() || !newNode.ip.trim()) {
      toast({
        title: "Input Error",
        description: "Name and IP Address cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/nodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNode),
      });

      if (!response.ok) {
        // Handle non-OK responses gracefully, attempt to parse JSON
        let errorData = { message: "Failed to add node." };
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error("Failed to parse JSON error:", jsonError);
        }
        throw new Error(errorData.message);
      }

      toast({
        title: "Success",
        description: "Node added successfully!",
      });
      setNewNode({ name: "", ip: "", location: "" });
      setIsAddModalOpen(false);
      await fetchNodes();
    } catch (error) {
      console.error("Error adding node:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error && error.message
            ? error.message
            : "Failed to add node. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

const startEditing = (node: Node) => {
  setEditingNodeId(node.id);
  setEditedNode({
    name: node.name,
    ip: node.ip,
    location: node.location ?? "",
  });
};

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedNode((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const saveEditedNode = async () => {
    if (!editedNode || !editingNodeId) return;

    if (!editedNode.name?.trim() || !editedNode.ip?.trim()) {
      toast({
        title: "Input Error",
        description: "Name and IP Address cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/nodes/${editingNodeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedNode),
      });

      if (!response.ok) {
        let errorData = { message: "Failed to update node." };
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error("Failed to parse JSON error:", jsonError);
        }
        throw new Error(errorData.message);
      }

      toast({
        title: "Success",
        description: "Node updated successfully!",
      });
      setEditingNodeId(null);
      setEditedNode(null);
      await fetchNodes();
    } catch (error) {
      console.error("Error saving node:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error && error.message
            ? error.message
            : "Failed to update node. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEditing = () => {
    setEditingNodeId(null);
    setEditedNode(null);
  };

  const handleDeleteNode = async (id: string) => {
    toast({
      title: "Konfirmasi penghapusan",
      description: "Apakah Anda yakin ingin menghapus node ini? Tindakan ini tidak dapat dibatalkan.",
      variant: "destructive",
      action: (
        <Button
          variant="ghost"
          className="text-white hover:bg-white/20"
          onClick={async () => {
            setIsSubmitting(true);
            try {
              const response = await fetch(`/api/nodes/${id}`, {
                method: "DELETE",
              });

              if (!response.ok) {
                let errorData = { message: "Failed to delete node." };
                try {
                  errorData = await response.json();
                } catch (jsonError) {
                  console.error("Failed to parse JSON error:", jsonError);
                }
                throw new Error(errorData.message);
              }

              toast({
                title: "Success",
                description: "Node deleted successfully!",
              });
              await fetchNodes();
            } catch (error) {
              console.error("Error deleting node:", error);
              toast({
                title: "Error",
                description:
                  error instanceof Error && error.message
                    ? error.message
                    : "Failed to delete node. Please try again.",
                variant: "destructive",
              });
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          Ya, Hapus
        </Button>
      ),
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nodes</h1>
          <p className="text-gray-600">Kelola node server OpenVPN Anda</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Tambah Node
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Server Nodes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">Loading nodes...</span>
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pemakaian CPU</TableHead>
                    <TableHead>Pemakaian RAM</TableHead>
                    <TableHead>Terakhir di lihat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nodes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-gray-500"
                      >
                        Tidak ditemukan node. Tambahkan node baru untuk memulai!
                      </TableCell>
                    </TableRow>
                  ) : (
                    nodes.map((node) => (
                      <TableRow key={node.id}>
                        <TableCell className="font-medium">
                          {editingNodeId === node.id ? (
                            <Input
                              name="name"
                              value={editedNode?.name || ""}
                              onChange={handleEditChange}
                              className="w-full notranslate"
                              disabled={isSubmitting}
                            />
                          ) : (
                            <p className="notranslate">{node.name}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingNodeId === node.id ? (
                            <Input
                              name="ip"
                              value={editedNode?.ip || ""}
                              onChange={handleEditChange}
                              className="w-full"
                              disabled={isSubmitting}
                            />
                          ) : (
                            node.ip
                          )}
                        </TableCell>
                        <TableCell>
                          {editingNodeId === node.id ? (
                            <Input
                              name="location"
                              value={editedNode?.location || ""}
                              onChange={handleEditChange}
                              className="w-full"
                              disabled={isSubmitting}
                            />
                          ) : (
                            node.location
                          )}
                        </TableCell>
                        <TableCell className="notranslate">
                          <Badge
                            variant={
                              node.status === NodeStatus.ONLINE
                                ? "default"
                                : node.status === NodeStatus.OFFLINE
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {node.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {node.status === NodeStatus.ONLINE ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    (node.cpuUsage || 0) > 80
                                      ? "bg-red-500"
                                      : (node.cpuUsage || 0) > 60
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                  }`}
                                  style={{ width: `${node.cpuUsage || 0}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">
                                {node.cpuUsage || 0}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {node.status === NodeStatus.ONLINE ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    (node.ramUsage || 0) > 80
                                      ? "bg-red-500"
                                      : (node.ramUsage || 0) > 60
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                  }`}
                                  style={{ width: `${node.ramUsage || 0}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">
                                {node.ramUsage || 0}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {node.lastSeen
                            ? new Date(node.lastSeen).toLocaleString()
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          {editingNodeId === node.id ? (
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={saveEditedNode}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4" />
                                )}
                                <span className="ml-1 notranslate">{t('buttonSave')}</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelEditing}
                                disabled={isSubmitting}
                                type="button"
                              >
                                <X className="h-4 w-4" />
                                <span className="ml-1 notranslate">{t('buttonCancelEdit')}</span>
                              </Button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditing(node)}
                                disabled={isSubmitting}
                                type="button"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="ml-1">Edit</span>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteNode(node.id)}
                                disabled={isSubmitting}
                                type="button"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="ml-1">Hapus</span>
                              </Button>
                              <NodeCopyButton nodeId={node.id} />
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Node Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="notranslate">{t('addModalTitle')}</DialogTitle>
<DialogDescription className="notranslate">{t('addModalDescription')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddNode}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
<Label htmlFor="name" className="text-right notranslate">{t('labelName')}</Label>
                <Input
                  id="name"
                  name="name"
                  value={newNode.name}
                  onChange={(e) =>
                    setNewNode({ ...newNode, name: e.target.value })
                  }
                  className="col-span-3"
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
<Label htmlFor="ip" className="text-right notranslate">{t('labelIpAddress')}</Label>
                <Input
                  id="ip"
                  name="ip"
                  value={newNode.ip}
                  onChange={(e) =>
                    setNewNode({ ...newNode, ip: e.target.value })
                  }
                  className="col-span-3"
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
<Label htmlFor="location" className="text-right notranslate">{t('labelLocation')}</Label>
                <Input
                  id="location"
                  name="location"
                  value={newNode.location}
                  onChange={(e) =>
                    setNewNode({ ...newNode, location: e.target.value })
                  }
                  className="col-span-3"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                disabled={isSubmitting}
                type="button"
              >
                {t('buttonCancel')}
              </Button>
<Button onClick={() => setIsAddModalOpen(true)} disabled={isSubmitting}>
  <Plus className="h-4 w-4 mr-2" />
  {t('buttonAdd')}
</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
}
