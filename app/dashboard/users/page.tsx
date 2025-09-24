// app/dashboard/users/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
// 1. Impor ikon Eye dan EyeOff
import { Loader2, Trash2, Eye, EyeOff, Plus, Edit } from "lucide-react";
import { AddUserDialog } from "@/components/admin/add-user-dialog";
import { useSession } from "next-auth/react";
import { Role, User, WhitelistType } from "@prisma/client";

type WhitelistEntry = {
  id: string;
  type: WhitelistType;
  value: string;
  createdAt: string;
};

type SafeUser = Omit<User, "password">;
const USERS_PER_PAGE = 10;

type EditDataState = {
  role: Role;
  currentPassword: string;
  newPassword: string;
};

export default function UserManagementPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ search: "", role: "all" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
  const [newValue, setNewValue] = useState("");
  const [newType, setNewType] = useState<WhitelistType>(WhitelistType.DOMAIN);
  const [isWhitelistLoading, setIsWhitelistLoading] = useState(true);

  const fetchWhitelist = useCallback(async () => {
    setIsWhitelistLoading(true);
    try {
      const res = await fetch("/api/admin/google-whitelist");
      if (!res.ok) throw new Error("Failed to fetch whitelist");
      setWhitelist(await res.json());
    } catch (error) {
      if (error instanceof Error)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
    } finally {
      setIsWhitelistLoading(false);
    }
  }, [toast]);

  const handleAddWhitelist = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/google-whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: newValue, type: newType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast({
        title: "Success",
        description: `${newType.charAt(0) + newType.slice(1).toLowerCase()} '${data.value
          }' has been added.`,
      });
      setNewValue("");
      fetchWhitelist();
    } catch (error) {
      if (error instanceof Error)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWhitelist = async (id: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/google-whitelist/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error((await res.json()).message);
      toast({ title: "Success", description: "Entry has been removed." });
      fetchWhitelist();
    } catch (error) {
      if (error instanceof Error)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchWhitelist();
  }, [fetchWhitelist]);

  const [userToEdit, setUserToEdit] = useState<SafeUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<SafeUser | null>(null);

  const [editData, setEditData] = useState<EditDataState>({
    role: Role.USER,
    currentPassword: "",
    newPassword: "",
  });

  // 2. Tambahkan state untuk mengelola visibilitas password
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
  });

  const fetchUsers = useCallback(
    async (pageToFetch: number) => {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: pageToFetch.toString(),
        pageSize: USERS_PER_PAGE.toString(),
        search: filters.search,
        role: filters.role,
      });
      try {
        const response = await fetch(`/api/users?${params.toString()}`);
        if (!response.ok)
          throw new Error(
            (await response.json()).message || "Failed to fetch user data."
          );
        const { data, total } = await response.json();
        setUsers(data);
        setTotalUsers(total);
      } catch (error: unknown) {
        if (error instanceof Error)
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
      } finally {
        setIsLoading(false);
      }
    },
    [filters, toast]
  );

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleEditClick = (user: SafeUser) => {
    setUserToEdit(user);

    setEditData({
      role: user.role,

      currentPassword: "",

      newPassword: "",
    });

    // Reset visibilitas password saat dialog dibuka

    setPasswordVisibility({ current: false, new: false });
  };

  const handleUpdateUser = async () => {
    if (!userToEdit) return;
    setIsSubmitting(true);
    try {
      const payload: {
        role?: Role;
        newPassword?: string;
        currentPassword?: string;
      } = {};

      if (editData.role !== userToEdit.role) {
        payload.role = editData.role;
      }

      if (editData.newPassword) {
        if (!editData.currentPassword) {
          toast({
            title: "Validation Error",
            description: "Current password is required to set a new password.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        payload.newPassword = editData.newPassword;
        payload.currentPassword = editData.currentPassword;
      }

      if (Object.keys(payload).length === 0) {
        toast({
          title: "Info",
          description: "No changes were saved.",
        });
        setUserToEdit(null);
        return;
      }

      const response = await fetch(`/api/users/${userToEdit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error(
          (await response.json()).message || "Failed to update user."
        );

      toast({
        title: "Success",
        description: `User ${userToEdit.email} was successfully updated.`,
      });

      setUserToEdit(null);
      fetchUsers(currentPage);
    } catch (error: unknown) {
      if (error instanceof Error)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (user: SafeUser) => {
    setUserToDelete(user);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error(
          (await response.json()).message || "Failed to delete user."
        );
      toast({
        title: "Success",
        description: `User ${userToDelete.email} was successfully deleted.`,
      });
      setUserToDelete(null);
      if (users.length === 1 && currentPage > 1) {
        const newPage = currentPage - 1;
        setCurrentPage(newPage);
        fetchUsers(newPage);
      } else {
        fetchUsers(currentPage);
      }
    } catch (error: unknown) {
      if (error instanceof Error)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Fungsi untuk mengubah visibilitas password
  const togglePasswordVisibility = (field: "current" | "new") => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600">Add, view, and manage system users.</p>
        </div>
        <AddUserDialog onUserAdded={() => fetchUsers(1)} />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <h2 className="text-2xl font-bold">Google Sign-In Whitelist</h2>
          <p className="text-muted-foreground">
            Manage specific domains or individual emails allowed to sign in.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <Input
              placeholder={
                newType === "DOMAIN"
                  ? "e.g., example.com"
                  : "e.g., user@email.com"
              }
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="flex-grow"
              maxLength={250}
            />
            <div className="flex gap-2">
              <Select
                value={newType}
                onValueChange={(v) => setNewType(v as WhitelistType)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={WhitelistType.DOMAIN}>Domain</SelectItem>
                  <SelectItem value={WhitelistType.EMAIL}>Email</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddWhitelist}
                disabled={isSubmitting || !newValue.trim()}
              >
                {isSubmitting && !isWhitelistLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Add
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Value (Domain or Email)</TableHead>
                <TableHead>Added On</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* PERBAIKAN: Ganti nested ternary dengan kondisional yang lebih jelas */}
              {isWhitelistLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </TableCell>
                </TableRow>
              )}
              {!isWhitelistLoading && whitelist.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    Whitelist is empty. All Google sign-ins are currently
                    blocked.
                  </TableCell>
                </TableRow>
              )}
              {!isWhitelistLoading &&
                whitelist.length > 0 &&
                whitelist.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant="outline">{item.type}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">{item.value}</TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteWhitelist(item.id)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search by email..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="flex-grow"
              maxLength={250}
            />
            <Select
              value={filters.role}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                <SelectItem value={Role.USER}>User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* PERBAIKAN: Ganti nested ternary dengan kondisional yang lebih jelas */}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                users.length > 0 &&
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === Role.ADMIN ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => handleDeleteClick(user)}
                        disabled={session?.user?.id === user.id}
                        title={
                          session?.user?.id === user.id
                            ? "Cannot delete yourself"
                            : "Delete User"
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
        {totalPages > 1 && (
          <CardFooter>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    {currentPage} / {totalPages}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>

      <Dialog
        open={!!userToEdit}
        onOpenChange={(isOpen) => !isOpen && setUserToEdit(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User: {userToEdit?.email}</DialogTitle>
            <DialogDescription>
              You can change the role or reset the user’s password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role-edit" className="text-right">
                Role
              </Label>
              <Select
                value={editData.role}
                onValueChange={(value: Role) =>
                  setEditData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Choose Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.USER}>User</SelectItem>
                  <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Terapkan struktur baru pada input password */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-password-edit" className="text-right">
                Current Password
              </Label>
              <div className="relative col-span-3">
                <Input
                  id="current-password-edit"
                  type={passwordVisibility.current ? "text" : "password"}
                  value={editData.currentPassword}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="pr-10" // Beri ruang untuk ikon
                  placeholder="Required to change password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                >
                  {passwordVisibility.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password-edit" className="text-right">
                New Password
              </Label>
              <div className="relative col-span-3">
                <Input
                  id="password-edit"
                  type={passwordVisibility.new ? "text" : "password"}
                  value={editData.newPassword}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="pr-10" // Beri ruang untuk ikon
                  placeholder="Leave empty if not changed"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                >
                  {passwordVisibility.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToEdit(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}{" "}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!userToDelete}
        onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user{" "}
              <span className="font-bold">{userToDelete?.email}</span>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}{" "}
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
