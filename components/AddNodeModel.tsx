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
import { useState, useEffect } from "react"

type Props = {
  onNodeAdded: () => void
}

export function AddNodeModal({ onNodeAdded }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [ipAddress, setIpAddress] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, ipAddress, location }),
      })

      if (!res.ok) throw new Error("Failed to create node")

      setOpen(false)
      setName("")
      setIpAddress("")
      setLocation("")
      onNodeAdded()
    } catch (err) {
      console.error(err)
      alert("Failed to add node.")
    } finally {
      setLoading(false)
    }
  }

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
            placeholder="Nama Node"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="IP Address"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
          />
          <Input
            placeholder="Lokasi"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Menambahkan..." : "Tambah node"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}