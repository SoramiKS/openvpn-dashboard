"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { Plus, Trash2, Download, Loader2, Wifi, PowerOff, XCircle } from "lucide-react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react"; // BARU
import { VpnUser, VpnCertificateStatus } from "@prisma/client";

// Tipe yang diperluas
interface NodeForSelect {
  id: string;
  name: string;
}
type ExtendedVpnUser = VpnUser & { node: { name: string } };

type FilterState = {
  searchTerm: string;
  nodeId: string;
  status?: VpnCertificateStatus | 'all';
};

const PROFILES_PER_PAGE = 10;

export default function VpnProfilesPage() {
  const { data: session } = useSession(); // BARU: Ambil data sesi
  const [vpnUsers, setVpnUsers] = useState<ExtendedVpnUser[]>([]);
  const [nodes, setNodes] = useState<NodeForSelect[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({ username: "", nodeId: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [userToRevoke, setUserToRevoke] = useState<{ id: string, username: string } | null>(null);

  const [validUsersFilter, setValidUsersFilter] = useState<FilterState>({ searchTerm: "", nodeId: "all" });
  const [revokedUsersFilter, setRevokedUsersFilter] = useState<FilterState>({ searchTerm: "", nodeId: "all", status: "all" });

  const [validUsersPage, setValidUsersPage] = useState(1);
  const [revokedUsersPage, setRevokedUsersPage] = useState(1);

  const fetchVpnUsers = useCallback(async () => { /* ... (tidak berubah) ... */ setIsLoading(true); try { const response = await fetch("/api/profiles"); if (!response.ok) throw new Error("Gagal mengambil profil VPN"); const data: ExtendedVpnUser[] = await response.json(); setVpnUsers(data.filter((user) => !user.username.startsWith("server_"))); } catch { toast({ title: "Error", description: "Gagal memuat profil VPN.", variant: "destructive" }); } finally { setIsLoading(false); } }, [toast]);
  const fetchNodesForSelect = useCallback(async () => { /* ... (tidak berubah) ... */ try { const response = await fetch("/api/nodes"); if (!response.ok) throw new Error("Gagal mengambil node"); const data: NodeForSelect[] = await response.json(); setNodes(data); } catch { toast({ title: "Error", description: "Gagal memuat node.", variant: "destructive" }); } }, [toast]);

  useEffect(() => {
    fetchVpnUsers();
    fetchNodesForSelect();
    const interval = setInterval(fetchVpnUsers, 15000);
    return () => clearInterval(interval);
  }, [fetchVpnUsers, fetchNodesForSelect]);

  const filteredValidUsers = useMemo(() => { /* ... (tidak berubah) ... */ return vpnUsers.filter(user => user.status === VpnCertificateStatus.VALID || user.status === VpnCertificateStatus.PENDING).filter(user => { const matchesSearch = user.username.toLowerCase().includes(validUsersFilter.searchTerm.toLowerCase()); const matchesNode = validUsersFilter.nodeId === 'all' || user.nodeId === validUsersFilter.nodeId; return matchesSearch && matchesNode; }); }, [vpnUsers, validUsersFilter]);
  const filteredRevokedUsers = useMemo(() => { /* ... (tidak berubah) ... */ return vpnUsers.filter(user => user.status === VpnCertificateStatus.REVOKED || user.status === VpnCertificateStatus.EXPIRED || user.status === VpnCertificateStatus.UNKNOWN).filter(user => { const matchesSearch = user.username.toLowerCase().includes(revokedUsersFilter.searchTerm.toLowerCase()); const matchesNode = revokedUsersFilter.nodeId === 'all' || user.nodeId === revokedUsersFilter.nodeId; const matchesStatus = revokedUsersFilter.status === 'all' || (revokedUsersFilter.status && user.status === revokedUsersFilter.status); return matchesSearch && matchesNode && matchesStatus; }); }, [vpnUsers, revokedUsersFilter]);

  const paginatedValidUsers = useMemo(() => { const startIndex = (validUsersPage - 1) * PROFILES_PER_PAGE; return filteredValidUsers.slice(startIndex, startIndex + PROFILES_PER_PAGE); }, [filteredValidUsers, validUsersPage]);
  const paginatedRevokedUsers = useMemo(() => { const startIndex = (revokedUsersPage - 1) * PROFILES_PER_PAGE; return filteredRevokedUsers.slice(startIndex, startIndex + PROFILES_PER_PAGE); }, [filteredRevokedUsers, revokedUsersPage]);

  const totalValidPages = Math.ceil(filteredValidUsers.length / PROFILES_PER_PAGE);
  const totalRevokedPages = Math.ceil(filteredRevokedUsers.length / PROFILES_PER_PAGE);

  const handleAddProfile = async () => { /* ... (tidak berubah) ... */ if (!newProfile.username.trim() || !newProfile.nodeId) { toast({ title: "Kesalahan Input", description: "Nama Pengguna dan Node wajib diisi.", variant: "destructive" }); return; } setIsSubmitting(true); try { const response = await fetch("/api/profiles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: newProfile.username, nodeId: newProfile.nodeId }), }); if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || "Gagal membuat profil VPN"); } toast({ title: "Berhasil", description: "Pembuatan profil VPN berhasil dimulai!" }); setNewProfile({ username: "", nodeId: "" }); setIsAddModalOpen(false); } catch (error: unknown) { if (error instanceof Error) { toast({ title: "Error", description: error.message || "Gagal membuat profil VPN.", variant: "destructive" }); } } finally { setIsSubmitting(false); } };
  const handleRevokeClick = (user: { id: string, username: string }) => { /* ... (tidak berubah) ... */ setUserToRevoke(user); setIsRevokeModalOpen(true); };
  const handleConfirmRevoke = async () => { /* ... (tidak berubah) ... */ if (!userToRevoke) return; setIsSubmitting(true); try { const response = await fetch(`/api/profiles/${userToRevoke.id}/revoke`, { method: "POST" }); if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || "Gagal mencabut profil VPN."); } toast({ title: "Berhasil", description: `Pencabutan profil untuk ${userToRevoke.username} dimulai!` }); setIsRevokeModalOpen(false); setUserToRevoke(null); fetchVpnUsers(); } catch (error: unknown) { if (error instanceof Error) { toast({ title: "Error", description: error.message || "Gagal mencabut profil VPN.", variant: "destructive" }); } } finally { setIsSubmitting(false); } };
  const handleDownloadOvpn = (ovpnFileContent: string | null | undefined, username: string) => { /* ... (tidak berubah) ... */ if (ovpnFileContent) { const blob = new Blob([ovpnFileContent], { type: "application/octet-stream" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${username}.ovpn`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); toast({ title: "Unduhan Dimulai", description: `File OVPN untuk ${username} sedang diunduh.` }); } else { toast({ title: "Tidak Ada File OVPN", description: "Profil ini belum memiliki file OVPN.", variant: "default" }); } };
  const getCertificateStatusBadgeVariant = (status: VpnCertificateStatus) => { /* ... (tidak berubah) ... */ switch (status) { case VpnCertificateStatus.VALID: return "default"; case VpnCertificateStatus.PENDING: return "secondary"; case VpnCertificateStatus.REVOKED: case VpnCertificateStatus.EXPIRED: return "destructive"; default: return "outline"; } };

  const renderProfileTable = (
    profiles: ExtendedVpnUser[],
    title: string,
    noDataMessage: string,
    filterState: FilterState,
    setFilterState: React.Dispatch<React.SetStateAction<FilterState>>,
    currentPage: number,
    totalPage: number,
    setPage: (page: number) => void,
    isRevokedTable: boolean = false
  ) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {/* --- MODIFIKASI: Filter hanya untuk Admin --- */}
        {session?.user?.role === 'ADMIN' && (
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <Input placeholder="Cari nama pengguna..." value={filterState.searchTerm} onChange={(e) => { setFilterState({ ...filterState, searchTerm: e.target.value }); setPage(1); }} className="flex-grow" />
            <Select value={filterState.nodeId} onValueChange={(value) => { setFilterState({ ...filterState, nodeId: value }); setPage(1); }}>
              <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter Node" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Semua Node</SelectItem>{nodes.map(node => <SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>)}</SelectContent>
            </Select>
            {isRevokedTable && (
              <Select value={filterState.status || 'all'} onValueChange={(value) => { setFilterState({ ...filterState, status: value as VpnCertificateStatus | 'all' }); setPage(1); }}>
                <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value={VpnCertificateStatus.REVOKED}>REVOKED</SelectItem>
                  <SelectItem value={VpnCertificateStatus.EXPIRED}>EXPIRED</SelectItem>
                  <SelectItem value={VpnCertificateStatus.UNKNOWN}>UNKNOWN</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Button variant="ghost" onClick={() => { setFilterState({ searchTerm: '', nodeId: 'all', status: 'all' }); setPage(1); }}>
              <XCircle className="h-4 w-4 mr-2" /> Bersihkan
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Nama Pengguna</TableHead><TableHead>Node</TableHead><TableHead>Status Sertifikat</TableHead><TableHead>Koneksi</TableHead><TableHead>Kadaluarsa</TableHead><TableHead>Dibuat</TableHead><TableHead>Terakhir Terhubung</TableHead>{isRevokedTable && <TableHead>Tanggal Dicabut</TableHead>}<TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={isRevokedTable ? 9 : 8} className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></TableCell></TableRow>
            ) : profiles.length === 0 ? (
              <TableRow><TableCell colSpan={isRevokedTable ? 9 : 8} className="text-center py-8">{noDataMessage}</TableCell></TableRow>
            ) : (
              profiles.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.node?.name || "N/A"}</TableCell>
                  <TableCell><Badge variant={getCertificateStatusBadgeVariant(user.status)}>{user.status}</Badge></TableCell>
                  <TableCell>{user.isActive ? <Badge variant="default" className="bg-green-500 hover:bg-green-500"><Wifi className="h-3 w-3 mr-1" /> Online</Badge> : <Badge variant="outline" className="text-gray-500"><PowerOff className="h-3 w-3 mr-1" /> Offline</Badge>}</TableCell>
                  <TableCell>{user.expirationDate ? new Date(user.expirationDate).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{user.lastConnected ? new Date(user.lastConnected).toLocaleString() : "Belum Terhubung"}</TableCell>
                  {isRevokedTable && (<TableCell>{user.revocationDate ? new Date(user.revocationDate).toLocaleString() : 'N/A'}</TableCell>)}
                  <TableCell>
                    <div className="flex space-x-2 justify-end">
                      {user.ovpnFileContent && user.status === VpnCertificateStatus.VALID ? (<Button variant="outline" size="sm" onClick={() => handleDownloadOvpn(user.ovpnFileContent, user.username)} disabled={isSubmitting}><Download className="h-4 w-4 mr-1" /> Unduh</Button>) : (<Button variant="outline" size="sm" disabled title="File OVPN belum tersedia"><Download className="h-4 w-4 mr-1" /> Unduh</Button>)}
                      {/* --- MODIFIKASI: Tombol Cabut hanya untuk Admin --- */}
                      {session?.user?.role === 'ADMIN' && (user.status === VpnCertificateStatus.VALID || user.status === VpnCertificateStatus.PENDING) && (<Button variant="destructive" size="sm" onClick={() => handleRevokeClick(user)} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-1" />} Cabut</Button>)}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      {totalPage > 1 && (<CardFooter> <Pagination> <PaginationContent> <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) setPage(currentPage - 1); }} /></PaginationItem> <PaginationItem><PaginationLink href="#">{currentPage} / {totalPage}</PaginationLink></PaginationItem> <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPage) setPage(currentPage + 1); }} /></PaginationItem> </PaginationContent> </Pagination> </CardFooter>)}
    </Card>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profil VPN</h1>
          <p className="text-gray-600">Kelola profil konfigurasi VPN</p>
        </div>
        {/* --- MODIFIKASI: Tombol Buat Profil hanya untuk Admin --- */}
        {session?.user?.role === 'ADMIN' && (
          <Button onClick={() => setIsAddModalOpen(true)} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />} Buat Profil
          </Button>
        )}
      </div>

      {renderProfileTable(paginatedValidUsers, "Daftar Profil Pengguna Aktif", "Tidak ada profil aktif yang cocok dengan filter.", validUsersFilter, setValidUsersFilter, validUsersPage, totalValidPages, setValidUsersPage)}
      <div className="pt-8"></div>
      {renderProfileTable(paginatedRevokedUsers, "Daftar Profil Pengguna Dicabut/Kadaluarsa", "Tidak ada profil dicabut yang cocok dengan filter.", revokedUsersFilter, setRevokedUsersFilter, revokedUsersPage, totalRevokedPages, setRevokedUsersPage, true)}

      {/* Dialog hanya akan bisa dibuka oleh Admin, jadi tidak perlu proteksi tambahan */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Buat Profil VPN Baru</DialogTitle><DialogDescription>Masukkan nama pengguna dan pilih node.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4"><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="username" className="text-right">Nama Pengguna</Label><Input id="username" value={newProfile.username} onChange={(e) => setNewProfile({ ...newProfile, username: e.target.value })} className="col-span-3" disabled={isSubmitting} /></div><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="node" className="text-right">Node</Label><Select value={newProfile.nodeId} onValueChange={(value) => setNewProfile({ ...newProfile, nodeId: value })} disabled={isSubmitting || nodes.length === 0}><SelectTrigger className="col-span-3"><SelectValue placeholder={nodes.length > 0 ? "Pilih Node" : "Tidak ada node"} /></SelectTrigger><SelectContent>{nodes.map((node) => (<SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>))}</SelectContent></Select></div></div>
          <DialogFooter><Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>Batal</Button><Button onClick={handleAddProfile} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Buat Profil</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isRevokeModalOpen} onOpenChange={setIsRevokeModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Konfirmasi Pencabutan</DialogTitle><DialogDescription>{userToRevoke ? `Apakah Anda yakin ingin mencabut profil VPN untuk ${userToRevoke.username}?` : ''}</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => { setIsRevokeModalOpen(false); setUserToRevoke(null); }}>Batal</Button><Button variant="destructive" onClick={handleConfirmRevoke} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Cabut"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}