"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
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
import { Plus, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react"; // Sesuaikan dengan library otentikasi Anda
import { Role } from "@prisma/client";

// Komponen ini menerima prop 'onUserAdded' untuk merefresh data di halaman utama
export function AddUserDialog({ onUserAdded }: { onUserAdded: () => void }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(Role.USER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCreateUser = async () => {
    // Validasi input sederhana
    if (!email || !password) {
        toast({ title: "Error", description: "Email dan password wajib diisi.", variant: "destructive" });
        return;
    }
     if (password.length < 8) {
        toast({ title: "Error", description: "Password minimal harus 8 karakter.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal membuat pengguna.");
      }

      toast({
        title: "Berhasil!",
        description: `Pengguna ${data.email} dengan peran ${data.role} berhasil dibuat.`,
      });
      
      // Panggil callback untuk merefresh tabel di halaman utama
      onUserAdded();
      
      // Reset form dan tutup dialog
      setIsOpen(false);
      setEmail("");
      setPassword("");
      setRole(Role.USER);

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tombol hanya akan ditampilkan jika pengguna adalah ADMIN
  if (session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Pengguna
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Pengguna Baru</DialogTitle>
          <DialogDescription>
            Buat akun baru dan tentukan perannya di sistem.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" disabled={isSubmitting} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" disabled={isSubmitting} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Peran</Label>
            <Select value={role} onValueChange={(value: Role) => setRole(value)} disabled={isSubmitting}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Pilih Peran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Role.USER}>User</SelectItem>
                <SelectItem value={Role.ADMIN}>Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>Batal</Button>
          <Button onClick={handleCreateUser} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Buat Pengguna
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}