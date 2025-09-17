// components/dashboard/ProfileTable.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Loader2, Wifi, PowerOff, XCircle, Download, Trash2 } from "lucide-react";
import { VpnUser, VpnCertificateStatus, NodeStatus } from "@prisma/client";
import { SortableHeader } from "@/components/SortableHeader";
import { useSession } from "next-auth/react";

// Tipe data yang dibutuhkan oleh komponen ini
type ExtendedVpnUser = VpnUser & { node: { name: string; status: NodeStatus } };
interface NodeForSelect { id: string; name: string; }

interface ProfileTableProps {
    title: string;
    profiles: ExtendedVpnUser[];
    isLoading: boolean;
    noDataMessage: string;
    isRevokedTable?: boolean; // Parameter default sekarang di akhir

    // Props untuk filter
    filterState: any;
    onFilterChange: (newFilter: any) => void;
    nodes: NodeForSelect[];
    
    // Props untuk pagination
    pagination: {
        currentPage: number;
        totalPages: number;
        setPage: (page: number) => void;
    };

    // Props untuk sorting
    sorting: {
        sortBy: string;
        sortOrder: 'asc' | 'desc';
        onSort: (column: string) => void;
    };

    // Props untuk aksi
    actions: {
        onDownload: (content: string | null | undefined, username: string) => void;
        onRevoke: (user: { id: string; username: string }) => void;
        isSubmitting: boolean;
    };
}

// Fungsi helper di dalam file yang sama
const getCertificateStatusBadgeVariant = (status: VpnCertificateStatus) => {
    switch (status) {
        case VpnCertificateStatus.VALID: return "default";
        case VpnCertificateStatus.PENDING: return "secondary";
        case VpnCertificateStatus.REVOKED: case VpnCertificateStatus.EXPIRED: return "destructive";
        default: return "outline";
    }
};

export const ProfileTable = ({
    title,
    profiles,
    isLoading,
    noDataMessage,
    filterState,
    onFilterChange,
    nodes,
    pagination,
    sorting,
    actions,
    isRevokedTable = false,
}: ProfileTableProps) => {
    const { data: session } = useSession();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <div className="flex flex-col md:flex-row gap-4 pt-4">
                    <Input
                        placeholder="Search username..."
                        value={filterState.searchTerm}
                        onChange={(e) => {
                            onFilterChange({ ...filterState, searchTerm: e.target.value });
                            pagination.setPage(1);
                        }}
                        className="flex-grow"
                    />
                    <Select value={filterState.nodeId} onValueChange={(value) => { onFilterChange({ ...filterState, nodeId: value }); pagination.setPage(1); }}>
                        <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by Node" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Nodes</SelectItem>
                            {nodes.map((node) => (<SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>))}
                        </SelectContent>
                    </Select>
                    {isRevokedTable && (
                        <Select value={filterState.status || "all"} onValueChange={(value) => { onFilterChange({ ...filterState, status: value }); pagination.setPage(1); }}>
                            <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value={VpnCertificateStatus.REVOKED}>REVOKED</SelectItem>
                                <SelectItem value={VpnCertificateStatus.EXPIRED}>EXPIRED</SelectItem>
                                <SelectItem value={VpnCertificateStatus.UNKNOWN}>UNKNOWN</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                    <Button variant="ghost" onClick={() => { onFilterChange({ searchTerm: "", nodeId: "all", status: "all" }); pagination.setPage(1); }}>
                        <XCircle className="h-4 w-4 mr-2" /> Clear
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <SortableHeader column="username" {...sorting}>Username</SortableHeader>
                            <SortableHeader column="node.name" {...sorting}>Node</SortableHeader>
                            <SortableHeader column="status" {...sorting}>Certificate Status</SortableHeader>
                            <SortableHeader column="isActive" {...sorting}>Connection</SortableHeader>
                            <SortableHeader column="expirationDate" {...sorting}>Expires</SortableHeader>
                            <SortableHeader column="createdAt" {...sorting}>Created</SortableHeader>
                            <SortableHeader column="lastConnected" {...sorting}>Last Connected</SortableHeader>
                            {isRevokedTable && <SortableHeader column="revocationDate" {...sorting}>Revocation Date</SortableHeader>}
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                            <TableRow><TableCell colSpan={isRevokedTable ? 9 : 8} className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></TableCell></TableRow>
                        )}
                        {!isLoading && profiles.length === 0 && (
                            <TableRow><TableCell colSpan={isRevokedTable ? 9 : 8} className="text-center py-8">{noDataMessage}</TableCell></TableRow>
                        )}
                        {!isLoading && profiles.length > 0 && (
                            profiles.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.username}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <span className={`h-2 w-2 rounded-full mr-2 ${user.node.status === 'ONLINE' ? "bg-green-500" : "bg-red-500"}`} title={`Node is ${user.node.status}`}></span>
                                            {user.node?.name || "N/A"}
                                        </div>
                                    </TableCell>
                                    <TableCell><Badge variant={getCertificateStatusBadgeVariant(user.status)}>{user.status}</Badge></TableCell>
                                    <TableCell>{user.isActive ? <Badge className="bg-green-500"><Wifi className="h-3 w-3 mr-1" /> Online</Badge> : <Badge variant="outline"><PowerOff className="h-3 w-3 mr-1" /> Offline</Badge>}</TableCell>
                                    <TableCell>{user.expirationDate ? new Date(user.expirationDate).toLocaleDateString('id-ID') : "N/A"}</TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell>{user.lastConnected ? new Date(user.lastConnected).toLocaleString('id-ID') : "Never"}</TableCell>
                                    {isRevokedTable && <TableCell>{user.revocationDate ? new Date(user.revocationDate).toLocaleString('id-ID') : "N/A"}</TableCell>}
                                    <TableCell>
                                        <div className="flex space-x-2 justify-end">
                                            <Button variant="outline" size="sm" onClick={() => actions.onDownload(user.ovpnFileContent, user.username)} disabled={!user.ovpnFileContent || actions.isSubmitting}>
                                                <Download className="h-4 w-4 mr-1" /> Download
                                            </Button>
                                            {session?.user?.role === "ADMIN" && (user.status === VpnCertificateStatus.VALID || user.status === VpnCertificateStatus.PENDING) && (
                                                <Button variant="destructive" size="sm" onClick={() => actions.onRevoke(user)} disabled={actions.isSubmitting}>
                                                    <Trash2 className="h-4 w-4 mr-1" /> Revoke
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            {pagination.totalPages > 1 && (
                <CardFooter>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (pagination.currentPage > 1) pagination.setPage(pagination.currentPage - 1); }} /></PaginationItem>
                            <PaginationItem><PaginationLink href="#">{pagination.currentPage} / {pagination.totalPages}</PaginationLink></PaginationItem>
                            <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (pagination.currentPage < pagination.totalPages) pagination.setPage(pagination.currentPage + 1); }} /></PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </CardFooter>
            )}
        </Card>
    );
};