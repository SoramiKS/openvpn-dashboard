// components/AddNodeModal.tsx
"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast" 
import { Loader2 } from "lucide-react" 

type Props = {
  readonly onNodeAdded: () => void
}

export function AddNodeModal({ onNodeAdded }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  // PERBAIKAN: Ubah nama state dari ipAddress menjadi ip
  const [ip, setIp] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast() // PENINGKATAN: Inisialisasi hook toast

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/nodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // PERBAIKAN: Kirim 'ip' bukan 'ipAddress'
        body: JSON.stringify({ name, ip, location }),
      })

      // PENINGKATAN: Berikan pesan error yang lebih spesifik
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create node");
      }

      toast({
        title: "Success",
        description: `Node "${name}" has been created successfully.`,
      })

      setOpen(false)
      setName("")
      setIp("")
      setLocation("")
      onNodeAdded()
    } catch (err) {
      // PENINGKATAN: Ganti alert() dengan toast()
      if (err instanceof Error) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // PENINGKATAN: Tambahkan validasi sederhana
  const isFormInvalid = !name.trim() || !ip.trim();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          + Tambahkan Node
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Node baru</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Nama Node (wajib)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="IP Address (wajib)"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
          />
          <Input
            placeholder="Lokasi (contoh: Jakarta, Indonesia)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit} disabled={loading || isFormInvalid}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Menambahkan..." : "Tambah node"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}