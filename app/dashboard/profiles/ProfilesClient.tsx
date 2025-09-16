// app/dashboard/profiles/ProfilesClient.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from 'next/navigation';
// ... (import lainnya tetap sama)
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Download, Loader2, Wifi, PowerOff, XCircle, ChevronsUpDown, Check, ArrowUp, ArrowDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { VpnUser, VpnCertificateStatus, NodeStatus } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTableSorting } from "@/hooks/useTableSorting";
import { SortableHeader } from "@/components/SortableHeader";

type FilterState = {
  searchTerm: string;
  nodeId: string;
  status?: VpnCertificateStatus | "all";
  sortBy: string;
  sortOrder: 'asc' | 'desc';
};

// Tipe data tidak berubah
interface NodeForSelect {
  id: string;
  name: string;
  ip: string;
}
type ExtendedVpnUser = VpnUser & { node: { name: string; status: NodeStatus } };

const PROFILES_PER_PAGE = 10;

// Ganti nama komponen agar sesuai dengan nama file
export default function ProfilesClient() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { toast } = useToast();


  // --- STATE BARU: Data dipisah per tabel ---
  const [validProfiles, setValidProfiles] = useState<ExtendedVpnUser[]>([]);
  const [totalValid, setTotalValid] = useState(0);
  const [revokedProfiles, setRevokedProfiles] = useState<ExtendedVpnUser[]>([]);
  const [totalRevoked, setTotalRevoked] = useState(0);

  const [nodes, setNodes] = useState<NodeForSelect[]>([]);
  const [isLoading, setIsLoading] = useState({ valid: true, revoked: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk filter dan pagination (tetap sama, ini sudah bagus)
  const [validUsersFilter, setValidUsersFilter] = useState<Omit<FilterState, 'status'>>({
    searchTerm: "",
    nodeId: "all",
    sortBy: "username",
    sortOrder: "asc",
  });
  const [revokedUsersFilter, setRevokedUsersFilter] = useState<FilterState>({
    searchTerm: "",
    nodeId: "all",
    status: "all",
    sortBy: "revocationDate",
    sortOrder: "desc",
  });
  const [validUsersPage, setValidUsersPage] = useState(1);
  const [revokedUsersPage, setRevokedUsersPage] = useState(1);

  // State untuk modal (tetap sama)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({ username: "", nodeId: "" });
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [userToRevoke, setUserToRevoke] = useState<{ id: string; username: string } | null>(null);

  const { sortBy: validSortBy, sortOrder: validSortOrder, handleSort: handleValidSort } = useTableSorting('username', 'asc');
  const { sortBy: revokedSortBy, sortOrder: revokedSortOrder, handleSort: handleRevokedSort } = useTableSorting('revocationDate', 'desc');

  // --- FUNGSI FETCH BARU ---
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
      sortBy, // Tambahkan sortBy
      sortOrder, // Tambahkan sortOrder
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

  // Fetch nodes untuk filter dropdown
  const fetchNodesForSelect = useCallback(async () => {
    try {
      const response = await fetch("/api/nodes");
      if (!response.ok) throw new Error("Failed to fetch nodes");
      setNodes(await response.json());
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    }
  }, [toast]);

  // Trigger fetch saat filter atau halaman berubah
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

  // Fungsi-fungsi handler (add, revoke, download) sebagian besar tetap sama
  // ... (Sisa fungsi handler seperti handleAddProfile, handleRevokeClick, handleConfirmRevoke, handleDownloadOvpn, getCertificateStatusBadgeVariant tidak perlu diubah)
  const handleAddProfile = async () => {
    if (!newProfile.username.trim() || !newProfile.nodeId) {
      toast({
        title: "Input Error",
        description: "Username and Node are required.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfile),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create VPN profile");
      }
      toast({
        title: "Success",
        description: "VPN profile creation has started successfully!",
      });
      // Refresh data setelah berhasil
      fetchProfiles('active', 1, validUsersFilter, validSortBy, validSortOrder);
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
      const response = await fetch(`/api/profiles/${userToRevoke.id}/revoke`, {
        method: "POST",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to revoke VPN profile.");
      }
      toast({
        title: "Success",
        description: `Revocation for profile ${userToRevoke.username} has started!`,
      });
      setIsRevokeModalOpen(false);
      setUserToRevoke(null);
      // Refresh kedua tabel
      fetchProfiles('active', validUsersPage, validUsersFilter, validSortBy, validSortOrder);
      fetchProfiles('revoked', revokedUsersPage, revokedUsersFilter, revokedSortBy, revokedSortOrder);
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
      toast({ title: "Download Started", description: `The OVPN file for ${username} is downloading.` });
    } else {
      toast({ title: "No OVPN File", description: "This profile does not have an OVPN file yet." });
    }
  };

  const handleSort = (column: string, filter: FilterState, setFilter: React.Dispatch<React.SetStateAction<FilterState>>) => {
    const isAsc = filter.sortBy === column && filter.sortOrder === 'asc';
    setFilter({
      ...filter,
      sortBy: column,
      sortOrder: isAsc ? 'desc' : 'asc',
    });
  };

  const SortIndicator = ({ column, filter }: { column: string; filter: FilterState; }) => {
    if (filter.sortBy !== column) return null;
    return filter.sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const getCertificateStatusBadgeVariant = (status: VpnCertificateStatus) => {
    switch (status) {
      case VpnCertificateStatus.VALID: return "default";
      case VpnCertificateStatus.PENDING: return "secondary";
      case VpnCertificateStatus.REVOKED: case VpnCertificateStatus.EXPIRED: return "destructive";
      default: return "outline";
    }
  };


  // Total halaman dihitung dari state baru
  const totalValidPages = Math.ceil(totalValid / PROFILES_PER_PAGE) || 1;
  const totalRevokedPages = Math.ceil(totalRevoked / PROFILES_PER_PAGE) || 1;

  // Render method di-refactor sedikit
  const renderProfileTable = (
    profiles: ExtendedVpnUser[],
    title: string,
    noDataMessage: string,
    filterState: FilterState,
    setFilterState: React.Dispatch<React.SetStateAction<FilterState>>,
    currentPage: number,
    totalPage: number,
    setPage: (page: number) => void,
    isRevokedTable: boolean = false,
    tableIsLoading: boolean,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    onSort: (column: string) => void
  ) => (
    <Card>
      {/* ... (Isi dari Card, Table, Pagination tidak berubah, hanya saja sekarang menerima data yang sudah siap) ... */}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {session?.user?.role === "ADMIN" && (
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <Input
              placeholder="Search username..."
              value={filterState.searchTerm}
              onChange={(e) => {
                setFilterState({ ...filterState, searchTerm: e.target.value });
                setPage(1);
              }}
              className="flex-grow"
            />
            <Select
              value={filterState.nodeId}
              onValueChange={(value) => {
                setFilterState({ ...filterState, nodeId: value });
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by Node" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Nodes</SelectItem>
                {nodes.map((node) => (<SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>))}
              </SelectContent>
            </Select>
            {isRevokedTable && (
              <Select
                value={filterState.status || "all"}
                onValueChange={(value) => {
                  setFilterState({ ...filterState, status: value as VpnCertificateStatus | "all" });
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={VpnCertificateStatus.REVOKED}>REVOKED</SelectItem>
                  <SelectItem value={VpnCertificateStatus.EXPIRED}>EXPIRED</SelectItem>
                  <SelectItem value={VpnCertificateStatus.UNKNOWN}>UNKNOWN</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Button variant="ghost" onClick={() => {
              setFilterState({
                searchTerm: "",
                nodeId: "all",
                status: "all",
                sortBy: filterState.sortBy,
                sortOrder: filterState.sortOrder,
              });
              setPage(1);
            }}>
              <XCircle className="h-4 w-4 mr-2" /> Clear
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader column="username" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>Username</SortableHeader>
              <SortableHeader column="node.name" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>Node</SortableHeader>

              {/* --- PERBAIKAN DI SINI --- */}
              <SortableHeader column="status" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>Certificate Status</SortableHeader>
              <SortableHeader column="isActive" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>Connection</SortableHeader>

              <SortableHeader column="expirationDate" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>Expires</SortableHeader>
              <SortableHeader column="createdAt" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>Created</SortableHeader>
              <SortableHeader column="lastConnected" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>Last Connected</SortableHeader>

              {isRevokedTable && (
                <SortableHeader column="revocationDate" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>Revocation Date</SortableHeader>
              )}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(() => {
              let tableRows;
              if (tableIsLoading) {
                tableRows = (
                  <TableRow>
                    <TableCell colSpan={isRevokedTable ? 9 : 8} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                );
              } else if (profiles.length === 0) {
                tableRows = (
                  <TableRow>
                    <TableCell colSpan={isRevokedTable ? 9 : 8} className="text-center py-8">
                      {noDataMessage}
                    </TableCell>
                  </TableRow>
                );
              } else {
                tableRows = profiles.map((user) => {
                  const isNodeOnline = user.node.status === NodeStatus.ONLINE;
                  const canDownload = user.ovpnFileContent && user.status === VpnCertificateStatus.VALID;
                  let disabledReason = "";
                  if (!canDownload) disabledReason = "OVPN file not available or certificate is not valid.";
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={`h-2 w-2 rounded-full mr-2 ${isNodeOnline ? "bg-green-500" : "bg-red-500"}`} title={`Node is ${user.node.status}`}></span>
                          {user.node?.name || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant={getCertificateStatusBadgeVariant(user.status)}>{user.status}</Badge></TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Badge variant="default" className="bg-green-500 hover:bg-green-500"><Wifi className="h-3 w-3 mr-1" /> Online</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500"><PowerOff className="h-3 w-3 mr-1" /> Offline</Badge>
                        )}
                      </TableCell>
                      <TableCell>{user.expirationDate ? new Date(user.expirationDate).toLocaleDateString('id-ID') : "N/A"}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{user.lastConnected ? new Date(user.lastConnected).toLocaleString('id-ID') : "Never"}</TableCell>
                      {isRevokedTable && (<TableCell>{user.revocationDate ? new Date(user.revocationDate).toLocaleString('id-ID') : "N/A"}</TableCell>)}
                      <TableCell>
                        <div className="flex space-x-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => handleDownloadOvpn(user.ovpnFileContent, user.username)} disabled={!canDownload || isSubmitting} title={disabledReason}>
                            <Download className="h-4 w-4 mr-1" /> Download
                          </Button>
                          {session?.user?.role === "ADMIN" && (user.status === VpnCertificateStatus.VALID || user.status === VpnCertificateStatus.PENDING) && (
                            <Button variant="destructive" size="sm" onClick={() => handleRevokeClick(user)} disabled={isSubmitting}>
                              {isSubmitting && userToRevoke?.id === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-1" />} Revoke
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                });
              }
              return tableRows;
            })()}
          </TableBody>
        </Table>
      </CardContent>
      {totalPage > 1 && (
        <CardFooter>
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) setPage(currentPage - 1); }} /></PaginationItem>
              <PaginationItem><PaginationLink href="#">{currentPage} / {totalPage}</PaginationLink></PaginationItem>
              <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPage) setPage(currentPage + 1); }} /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">VPN Profiles</h1>
          <p className="text-gray-600">Manage VPN configuration profiles</p>
        </div>
        {session?.user?.role === "ADMIN" && (
          <Button className="hover:shadow-xl hover:scale-105 duration-200 transition-transform" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Profile
          </Button>
        )}
      </div>

      {renderProfileTable(
        validProfiles,
        "Active User Profiles List",
        "No active profiles found.",
        validUsersFilter,
        setValidUsersFilter,
        validUsersPage,
        totalValidPages,
        setValidUsersPage,
        false,
        isLoading.valid,
        validSortBy,
        validSortOrder,
        handleValidSort
      )}
      <div className="pt-8"></div>
      {renderProfileTable(
        revokedProfiles,
        "Revoked/Expired User Profiles List",
        "No revoked or expired profiles found.",
        revokedUsersFilter,
        setRevokedUsersFilter,
        revokedUsersPage,
        totalRevokedPages,
        setRevokedUsersPage,
        true,
        isLoading.revoked,
        revokedSortBy,
        revokedSortOrder,
        handleRevokedSort
      )}

      {/* ... (Semua Dialogs tidak berubah) ... */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Create New VPN Profile</DialogTitle><DialogDescription>Enter a username and select a node.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="username" className="text-right">Username</Label><Input id="username" value={newProfile.username} onChange={(e) => setNewProfile({ ...newProfile, username: e.target.value })} className="col-span-3" disabled={isSubmitting} /></div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="node" className="text-right">Node</Label>
              <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={isComboboxOpen} className="col-span-3 justify-between font-normal">
                    {newProfile.nodeId ? nodes.find(n => n.id === newProfile.nodeId)?.name : "Select Node..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command><CommandInput placeholder="Search node..." /><CommandList><CommandEmpty>No node found.</CommandEmpty><CommandGroup>
                    {nodes.map((node) => (<CommandItem key={node.id} value={`${node.name} ${node.ip}`} onSelect={() => { setNewProfile({ ...newProfile, nodeId: node.id }); setIsComboboxOpen(false); }}>
                      <Check className={cn("mr-2 h-4 w-4", newProfile.nodeId === node.id ? "opacity-100" : "opacity-0")} />
                      <div className="flex justify-between w-full items-center">
                        <span className="truncate max-w-[150px]">{node.name}</span><span className="text-xs text-muted-foreground">{node.ip}</span>
                      </div>
                    </CommandItem>))}
                  </CommandGroup></CommandList></Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>Cancel</Button><Button onClick={handleAddProfile} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Create Profile</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRevokeModalOpen} onOpenChange={setIsRevokeModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Revocation</DialogTitle><DialogDescription>{userToRevoke ? `Are you sure you want to revoke the VPN profile for ${userToRevoke.username}? This action cannot be undone.` : ""}</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsRevokeModalOpen(false); setUserToRevoke(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmRevoke} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Revoke"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}