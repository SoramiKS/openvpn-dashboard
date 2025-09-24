// app/dashboard/profiles/ProfilesClient.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Plus, Loader2, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { VpnUser, VpnCertificateStatus, NodeStatus } from "@prisma/client";
import { useTableSorting } from "@/hooks/useTableSorting";
import { ProfileTable } from "@/components/dashboard/ProfileTable";

// Tipe data diekspor agar bisa digunakan oleh ProfileTable
export type ExtendedVpnUser = VpnUser & { node: { name: string; status: NodeStatus } };
export interface NodeForSelect { id: string; name: string; ip: string; }
export type FilterState = {
  searchTerm: string;
  nodeId: string;
  status?: VpnCertificateStatus | "all";
};

const PROFILES_PER_PAGE = 10;

export default function ProfilesClient() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [validProfiles, setValidProfiles] = useState<ExtendedVpnUser[]>([]);
  const [totalValid, setTotalValid] = useState(0);
  const [revokedProfiles, setRevokedProfiles] = useState<ExtendedVpnUser[]>([]);
  const [totalRevoked, setTotalRevoked] = useState(0);
  const [nodes, setNodes] = useState<NodeForSelect[]>([]);
  const [isLoading, setIsLoading] = useState({ valid: true, revoked: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [validUsersFilter, setValidUsersFilter] = useState<Omit<FilterState, 'status'>>({ searchTerm: "", nodeId: "all" });
  const [revokedUsersFilter, setRevokedUsersFilter] = useState<FilterState>({ searchTerm: "", nodeId: "all", status: "all" });
  const [validUsersPage, setValidUsersPage] = useState(1);
  const [revokedUsersPage, setRevokedUsersPage] = useState(1);
  const { sortBy: validSortBy, sortOrder: validSortOrder, handleSort: handleValidSort } = useTableSorting('username', 'asc');
  const { sortBy: revokedSortBy, sortOrder: revokedSortOrder, handleSort: handleRevokedSort } = useTableSorting('revocationDate', 'desc');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({ username: "", nodeId: "" });
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [userToRevoke, setUserToRevoke] = useState<{ id: string; username: string } | null>(null);

  const fetchProfiles = useCallback(async (
    statusGroup: 'active' | 'revoked',
    page: number,
    filters: Omit<FilterState, 'status'> | FilterState,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ) => {
    setIsLoading(prev => ({ ...prev, [statusGroup === 'active' ? 'valid' : 'revoked']: true }));
    const params = new URLSearchParams({
      statusGroup,
      page: String(page),
      pageSize: String(PROFILES_PER_PAGE),
      searchTerm: filters.searchTerm,
      nodeId: filters.nodeId,
      sortBy,
      sortOrder,
    });
    if ('status' in filters && filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    try {
      const response = await fetch(`/api/profiles?${params.toString()}`);
      if (!response.ok) throw new Error(`Failed to fetch ${statusGroup} profiles.`);
      const { data, total } = await response.json();
      if (statusGroup === 'active') {
        setValidProfiles(data);
        setTotalValid(total);
      } else {
        setRevokedProfiles(data);
        setTotalRevoked(total);
      }
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsLoading(prev => ({ ...prev, [statusGroup === 'active' ? 'valid' : 'revoked']: false }));
    }
  }, [toast]);

  const fetchNodesForSelect = useCallback(async () => {
    try {
      const response = await fetch("/api/nodes");
      if (!response.ok) throw new Error("Failed to fetch nodes");
      setNodes(await response.json());
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    fetchProfiles('active', validUsersPage, validUsersFilter, validSortBy, validSortOrder);
  }, [validUsersPage, validUsersFilter, validSortBy, validSortOrder, fetchProfiles]);

  useEffect(() => {
    fetchProfiles('revoked', revokedUsersPage, revokedUsersFilter, revokedSortBy, revokedSortOrder);
  }, [revokedUsersPage, revokedUsersFilter, revokedSortBy, revokedSortOrder, fetchProfiles]);

  useEffect(() => {
    fetchNodesForSelect();
  }, [fetchNodesForSelect]);

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create' && session?.user?.role === "ADMIN") {
      setIsAddModalOpen(true);
    }
  }, [searchParams, session]);

  const handleAddProfile = async () => {
    if (!newProfile.username.trim() || !newProfile.nodeId) {
      return toast({ title: "Input Error", description: "Username and Node are required.", variant: "destructive" });
    }
    // PERBAIKAN: Tambahkan validasi Regex di sini untuk keamanan tambahan
    if (!/^[a-zA-Z0-9_-]+$/.test(newProfile.username)) {
      return toast({ title: "Input Error", description: "Username contains invalid characters.", variant: "destructive" });
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfile),
      });
      if (!response.ok) throw new Error((await response.json()).message || "Failed to create profile");
      toast({ title: "Success", description: "VPN profile creation has started!" });
      fetchProfiles('active', 1, { searchTerm: "", nodeId: "all" }, 'username', 'asc');
      setNewProfile({ username: "", nodeId: "" });
      setIsAddModalOpen(false);
    } catch (error) {
      if (error instanceof Error) toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeClick = (user: { id: string; username: string }) => {
    setUserToRevoke(user);
    setIsRevokeModalOpen(true);
  };

  const handleConfirmRevoke = async () => {
    if (!userToRevoke) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/profiles/${userToRevoke.id}/revoke`, { method: "POST" });
      if (!response.ok) throw new Error((await response.json()).message || "Failed to revoke profile");
      toast({ title: "Success", description: `Revocation for ${userToRevoke.username} has started!` });
      setIsRevokeModalOpen(false);
      setUserToRevoke(null);
      fetchProfiles('active', validUsersPage, validUsersFilter, validSortBy, validSortOrder);
      fetchProfiles('revoked', 1, revokedUsersFilter, revokedSortBy, revokedSortOrder);
    } catch (error) {
      if (error instanceof Error) toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadOvpn = (ovpnFileContent: string | null | undefined, username: string) => {
    if (ovpnFileContent) {
      const blob = new Blob([ovpnFileContent], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${username}.ovpn`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      toast({ title: "File Not Available", description: "OVPN file has not been generated yet.", variant: "default" });
    }
  };

  const totalValidPages = Math.ceil(totalValid / PROFILES_PER_PAGE) || 1;
  const totalRevokedPages = Math.ceil(totalRevoked / PROFILES_PER_PAGE) || 1;

  // PERBAIKAN 2: Siapkan data node yang terpilih untuk ditampilkan di tombol
  const selectedNode = nodes.find(n => n.id === newProfile.nodeId);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">VPN Profiles</h1>
          <p className="text-muted-foreground">Manage VPN configuration profiles</p>
        </div>
        {session?.user?.role === "ADMIN" && (
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Profile
          </Button>
        )}
      </div>

      <ProfileTable
        id="active-user"
        title="Active User Profiles"
        profiles={validProfiles}
        isLoading={isLoading.valid}
        noDataMessage="No active profiles found."
        filterState={validUsersFilter}
        onFilterChange={setValidUsersFilter}
        nodes={nodes}
        pagination={{ currentPage: validUsersPage, totalPages: totalValidPages, setPage: setValidUsersPage }}
        sorting={{ sortBy: validSortBy, sortOrder: validSortOrder, onSort: handleValidSort }}
        actions={{ onDownload: handleDownloadOvpn, onRevoke: handleRevokeClick, isSubmitting }}
      />

      <div className="pt-8" />

      <ProfileTable
        id="revoked-user"
        title="Revoked & Expired Profiles"
        profiles={revokedProfiles}
        isLoading={isLoading.revoked}
        noDataMessage="No revoked or expired profiles found."
        filterState={revokedUsersFilter}
        onFilterChange={setRevokedUsersFilter}
        nodes={nodes}
        pagination={{ currentPage: revokedUsersPage, totalPages: totalRevokedPages, setPage: setRevokedUsersPage }}
        sorting={{ sortBy: revokedSortBy, sortOrder: revokedSortOrder, onSort: handleRevokedSort }}
        actions={{ onDownload: handleDownloadOvpn, onRevoke: handleRevokeClick, isSubmitting }}
        isRevokedTable={true}
      />

      {/* Dialogs */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New VPN Profile</DialogTitle>
            <DialogDescription>Enter a username and select a node.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">Username</Label>
              {/* PERBAIKAN 1: Batasi panjang dan format username */}
              <Input
                id="username"
                value={newProfile.username}
                onChange={(e) => {
                  const formatted = e.target.value.replace(/[^a-zA-Z0-9_-]/g, '');
                  setNewProfile({ ...newProfile, username: formatted });
                }}
                maxLength={32}
                className="col-span-3"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="node" className="text-right">Node</Label>
              <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" aria-expanded={isComboboxOpen} className="col-span-3 justify-between font-normal text-left h-auto">
                    {/* PERBAIKAN 3: Tampilkan nama node (truncate jika perlu) dan IP pada tombol */}
                    {selectedNode ? (
                      <div className="flex flex-col items-start">
                        <span className="truncate max-w-[180px]">{selectedNode.name}</span>
                        <span className="text-xs text-muted-foreground">{selectedNode.ip}</span>
                      </div>
                    ) : (
                      "Select Node..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}>
                    <CommandInput placeholder="Search node..." />
                    <CommandList>
                      <CommandEmpty>No node found.</CommandEmpty>
                      <CommandGroup>
                        {/* CATATAN: Bagian ini sudah benar menampilkan nama (truncate) dan IP di dalam list */}
                        {nodes.map((node) => (
                          <CommandItem key={node.id} value={`${node.name} ${node.ip}`} onSelect={() => { setNewProfile({ ...newProfile, nodeId: node.id }); setIsComboboxOpen(false); }}>
                            <Check className={cn("mr-2 h-4 w-4", newProfile.nodeId === node.id ? "opacity-100" : "opacity-0")} />
                            <div className="flex justify-between w-full items-center">
                              <span className="truncate max-w-[150px]">{node.name}</span>
                              <span className="text-xs text-muted-foreground">{node.ip}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleAddProfile} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRevokeModalOpen} onOpenChange={setIsRevokeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Revocation</DialogTitle>
            <DialogDescription>{userToRevoke ? `Are you sure you want to revoke the VPN profile for ${userToRevoke.username}? This action cannot be undone.` : ""}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsRevokeModalOpen(false); setUserToRevoke(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmRevoke} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Revoke"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}