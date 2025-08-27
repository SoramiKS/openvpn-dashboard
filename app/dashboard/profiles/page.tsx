// app/dashboard/profiles/page.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
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
  Trash2,
  Download,
  Loader2,
  Wifi,
  PowerOff,
  XCircle,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { VpnUser, VpnCertificateStatus, NodeStatus } from "@prisma/client"; // Import NodeStatus

// Tipe yang diperluas
interface NodeForSelect {
  id: string;
  name: string;
}
// PERBAIKAN: Sertakan status node di dalam tipe
type ExtendedVpnUser = VpnUser & { node: { name: string; status: NodeStatus } };

type FilterState = {
  searchTerm: string;
  nodeId: string;
  status?: VpnCertificateStatus | "all";
};

const PROFILES_PER_PAGE = 10;

export default function VpnProfilesPage() {
  const { data: session } = useSession();
  const [vpnUsers, setVpnUsers] = useState<ExtendedVpnUser[]>([]);
  const [nodes, setNodes] = useState<NodeForSelect[]>([]);
  // ... (state lainnya tidak berubah)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({ username: "", nodeId: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [userToRevoke, setUserToRevoke] = useState<{
    id: string;
    username: string;
  } | null>(null);
  const [validUsersFilter, setValidUsersFilter] = useState<FilterState>({
    searchTerm: "",
    nodeId: "all",
  });
  const [revokedUsersFilter, setRevokedUsersFilter] = useState<FilterState>({
    searchTerm: "",
    nodeId: "all",
    status: "all",
  });
  const [validUsersPage, setValidUsersPage] = useState(1);
  const [revokedUsersPage, setRevokedUsersPage] = useState(1);

  // ... (semua fungsi handler seperti fetchVpnUsers, handleAddProfile, dll. tidak berubah)
  const fetchVpnUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profiles");
      if (!response.ok) throw new Error("Failed to fetch VPN profiles");
      const data: ExtendedVpnUser[] = await response.json();
      setVpnUsers(data.filter((user) => !user.username.startsWith("server_")));
    } catch {
      toast({
        title: "Error",
        description: "Failed to load VPN profiles.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  const fetchNodesForSelect = useCallback(async () => {
    try {
      const response = await fetch("/api/nodes");
      if (!response.ok) throw new Error("Failed to fetch nodes");
      const data: NodeForSelect[] = await response.json();
      setNodes(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load nodes.",
        variant: "destructive",
      });
    }
  }, [toast]);
  useEffect(() => {
    fetchVpnUsers();
    fetchNodesForSelect();
    const interval = setInterval(fetchVpnUsers, 15000);
    return () => clearInterval(interval);
  }, [fetchVpnUsers, fetchNodesForSelect]);
  const filteredValidUsers = useMemo(() => {
    return vpnUsers
      .filter(
        (user) =>
          user.status === VpnCertificateStatus.VALID ||
          user.status === VpnCertificateStatus.PENDING
      )
      .filter((user) => {
        const matchesSearch = user.username
          .toLowerCase()
          .includes(validUsersFilter.searchTerm.toLowerCase());
        const matchesNode =
          validUsersFilter.nodeId === "all" ||
          user.nodeId === validUsersFilter.nodeId;
        return matchesSearch && matchesNode;
      });
  }, [vpnUsers, validUsersFilter]);
  const filteredRevokedUsers = useMemo(() => {
    return vpnUsers
      .filter(
        (user) =>
          user.status === VpnCertificateStatus.REVOKED ||
          user.status === VpnCertificateStatus.EXPIRED ||
          user.status === VpnCertificateStatus.UNKNOWN
      )
      .filter((user) => {
        const matchesSearch = user.username
          .toLowerCase()
          .includes(revokedUsersFilter.searchTerm.toLowerCase());
        const matchesNode =
          revokedUsersFilter.nodeId === "all" ||
          user.nodeId === revokedUsersFilter.nodeId;
        const matchesStatus =
          revokedUsersFilter.status === "all" ||
          (revokedUsersFilter.status &&
            user.status === revokedUsersFilter.status);
        return matchesSearch && matchesNode && matchesStatus;
      });
  }, [vpnUsers, revokedUsersFilter]);
  const paginatedValidUsers = useMemo(() => {
    const startIndex = (validUsersPage - 1) * PROFILES_PER_PAGE;
    return filteredValidUsers.slice(startIndex, startIndex + PROFILES_PER_PAGE);
  }, [filteredValidUsers, validUsersPage]);
  const paginatedRevokedUsers = useMemo(() => {
    const startIndex = (revokedUsersPage - 1) * PROFILES_PER_PAGE;
    return filteredRevokedUsers.slice(
      startIndex,
      startIndex + PROFILES_PER_PAGE
    );
  }, [filteredRevokedUsers, revokedUsersPage]);
  const totalValidPages = Math.ceil(
    filteredValidUsers.length / PROFILES_PER_PAGE
  );
  const totalRevokedPages = Math.ceil(
    filteredRevokedUsers.length / PROFILES_PER_PAGE
  );
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
        body: JSON.stringify({
          username: newProfile.username,
          nodeId: newProfile.nodeId,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create VPN profile");
      }
      toast({
        title: "Success",
        description: "VPN profile creation has started successfully!",
      });
      setNewProfile({ username: "", nodeId: "" });
      setIsAddModalOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message || "Failed to create VPN profile.",
          variant: "destructive",
        });
      }
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
      fetchVpnUsers();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message || "Failed to revoke VPN profile.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDownloadOvpn = (
    ovpnFileContent: string | null | undefined,
    username: string
  ) => {
    if (ovpnFileContent) {
      const blob = new Blob([ovpnFileContent], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${username}.ovpn`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Download Started",
        description: `The OVPN file for ${username} is downloading.`,
      });
    } else {
      toast({
        title: "No OVPN File",
        description: "This profile does not have an OVPN file yet.",
        variant: "default",
      });
    }
  };
  const getCertificateStatusBadgeVariant = (status: VpnCertificateStatus) => {
    switch (status) {
      case VpnCertificateStatus.VALID:
        return "default";
      case VpnCertificateStatus.PENDING:
        return "secondary";
      case VpnCertificateStatus.REVOKED:
      case VpnCertificateStatus.EXPIRED:
        return "destructive";
      default:
        return "outline";
    }
  };

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
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by Node" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Nodes</SelectItem>
                {nodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isRevokedTable && (
              <Select
                value={filterState.status || "all"}
                onValueChange={(value) => {
                  setFilterState({
                    ...filterState,
                    status: value as VpnCertificateStatus | "all",
                  });
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={VpnCertificateStatus.REVOKED}>
                    REVOKED
                  </SelectItem>
                  <SelectItem value={VpnCertificateStatus.EXPIRED}>
                    EXPIRED
                  </SelectItem>
                  <SelectItem value={VpnCertificateStatus.UNKNOWN}>
                    UNKNOWN
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                setFilterState({
                  searchTerm: "",
                  nodeId: "all",
                  status: "all",
                });
                setPage(1);
              }}
            >
              <XCircle className="h-4 w-4 mr-2" /> Clear
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Node</TableHead>
              <TableHead>Certificate Status</TableHead>
              <TableHead>Connection</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Connected</TableHead>
              {isRevokedTable && <TableHead>Revocation Date</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={isRevokedTable ? 9 : 8}
                  className="text-center py-8"
                >
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : profiles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isRevokedTable ? 9 : 8}
                  className="text-center py-8"
                >
                  {noDataMessage}
                </TableCell>
              </TableRow>
            ) : (
              profiles.map((user) => {
                // --- PERBAIKAN: Logika baru untuk tombol download ---
                const isNodeOnline = user.node.status === NodeStatus.ONLINE;
                const isUserActive = user.isActive;
                const canDownload =
                  user.ovpnFileContent &&
                  user.status === VpnCertificateStatus.VALID &&
                  isNodeOnline &&
                  !isUserActive;

                let disabledReason = "";
                if (!isNodeOnline)
                  disabledReason = "Cannot download: Node is offline.";
                else if (isUserActive)
                  disabledReason =
                    "Cannot download: User is currently connected.";
                else if (
                  !user.ovpnFileContent ||
                  user.status !== VpnCertificateStatus.VALID
                )
                  disabledReason =
                    "OVPN file not available or certificate is not valid.";
                // --- AKHIR PERBAIKAN ---

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.username}
                    </TableCell>
                    {/* --- PERBAIKAN: Tambahkan indikator status node --- */}
                    <TableCell>
                      <div className="flex items-center">
                        <span
                          className={`h-2 w-2 rounded-full mr-2 ${
                            isNodeOnline ? "bg-green-500" : "bg-red-500"
                          }`}
                          title={`Node is ${user.node.status}`}
                        ></span>
                        {user.node?.name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getCertificateStatusBadgeVariant(user.status)}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Badge
                          variant="default"
                          className="bg-green-500 hover:bg-green-500"
                        >
                          <Wifi className="h-3 w-3 mr-1" /> Online
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          <PowerOff className="h-3 w-3 mr-1" /> Offline
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.expirationDate
                        ? new Date(user.expirationDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.lastConnected
                        ? new Date(user.lastConnected).toLocaleString()
                        : "Never Connected"}
                    </TableCell>
                    {isRevokedTable && (
                      <TableCell>
                        {user.revocationDate
                          ? new Date(user.revocationDate).toLocaleString()
                          : "N/A"}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex space-x-2 justify-end">
                        {/* --- PERBAIKAN: Terapkan logika baru ke tombol download --- */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDownloadOvpn(
                              user.ovpnFileContent,
                              user.username
                            )
                          }
                          disabled={!canDownload || isSubmitting}
                          title={disabledReason}
                        >
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                        {session?.user?.role === "ADMIN" &&
                          (user.status === VpnCertificateStatus.VALID ||
                            user.status === VpnCertificateStatus.PENDING) && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRevokeClick(user)}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-1" />
                              )}{" "}
                              Revoke
                            </Button>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
      {totalPage > 1 && (
        <CardFooter>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setPage(currentPage - 1);
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">
                  {currentPage} / {totalPage}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPage) setPage(currentPage + 1);
                  }}
                />
              </PaginationItem>
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
          <Button
            onClick={() => setIsAddModalOpen(true)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}{" "}
            Create Profile
          </Button>
        )}
      </div>

      {renderProfileTable(
        paginatedValidUsers,
        "Active User Profiles List",
        "No active profiles match the filter.",
        validUsersFilter,
        setValidUsersFilter,
        validUsersPage,
        totalValidPages,
        setValidUsersPage
      )}
      <div className="pt-8"></div>
      {renderProfileTable(
        paginatedRevokedUsers,
        "Revoked/Expired User Profiles List",
        "No revoked profiles match the filter.",
        revokedUsersFilter,
        setRevokedUsersFilter,
        revokedUsersPage,
        totalRevokedPages,
        setRevokedUsersPage,
        true
      )}

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New VPN Profile</DialogTitle>
            <DialogDescription>
              Enter a username and select a node.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={newProfile.username}
                onChange={(e) =>
                  setNewProfile({ ...newProfile, username: e.target.value })
                }
                className="col-span-3"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="node" className="text-right">
                Node
              </Label>
              <Select
                value={newProfile.nodeId}
                onValueChange={(value) =>
                  setNewProfile({ ...newProfile, nodeId: value })
                }
                disabled={isSubmitting || nodes.length === 0}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue
                    placeholder={
                      nodes.length > 0 ? "Select Node" : "No nodes available"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {nodes.map((node) => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleAddProfile} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}{" "}
              Create Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isRevokeModalOpen} onOpenChange={setIsRevokeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Revocation</DialogTitle>
            <DialogDescription>
              {userToRevoke
                ? `Are you sure you want to revoke the VPN profile for ${userToRevoke.username}?`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRevokeModalOpen(false);
                setUserToRevoke(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRevoke}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Revoke"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
