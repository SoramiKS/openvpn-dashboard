// components/ManageNodeModal.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Edit, Save, Trash2, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Node } from "@prisma/client" // PERBAIKAN: Impor tipe Node dari Prisma

type Props = {
  readonly open: boolean
  readonly onClose: () => void
  readonly node: Node | null // PERBAIKAN: Gunakan tipe Node
  readonly onNodeUpdated: () => void
  readonly onNodeDeleted: () => void
}

export function ManageNodeModal({ open, onClose, node, onNodeUpdated, onNodeDeleted }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  // PERBAIKAN: Gunakan 'ip' agar konsisten
  const [editedIp, setEditedIp] = useState("")
  const [editedLocation, setEditedLocation] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (node) {
      setEditedName(node.name)
      setEditedIp(node.ip) // PERBAIKAN: Gunakan 'ip'
      setEditedLocation(node.location || "")
      setIsEditing(false)
    }
  }, [node, open])

  if (!node) return null

  // PENINGKATAN: Gunakan navigator.clipboard API yang modern
  const copyApiKey = async () => {
    if (node?.token) { // PERBAIKAN: Gunakan 'token' sesuai skema Prisma
      try {
        await navigator.clipboard.writeText(node.token);
        toast.success("API Key copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy API Key:", err);
        toast.error("Failed to copy API Key. Please copy manually.");
      }
    }
  }

  const handleSave = async () => {
    if (!editedName.trim() || !editedIp.trim()) {
      toast.error("Name and IP Address cannot be empty.")
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch(`/api/nodes/${node.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editedName.trim(),
          ip: editedIp.trim(), // PERBAIKAN: Kirim 'ip'
          location: editedLocation.trim(),
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to update node")
      }

      toast.success("Node updated successfully!")
      setIsEditing(false)
      onNodeUpdated()
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || "Failed to update node.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/nodes/${node.id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to delete node")
      }
      toast.success("Node deleted successfully!")
      onClose()
      onNodeDeleted()
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || "Failed to delete node.");
      }
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Node: {node.name}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Edit node details." : "View node details and API Key."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Node Name</p>
              {isEditing ? (
                <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} />
              ) : (
                <p className="font-semibold">{node.name}</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">IP Address</p>
              {isEditing ? (
                <Input value={editedIp} onChange={(e) => setEditedIp(e.target.value)} />
              ) : (
                <p className="font-mono text-sm">{node.ip}</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
              {isEditing ? (
                <Input value={editedLocation} onChange={(e) => setEditedLocation(e.target.value)} />
              ) : (
                <p>{node.location || "Not set"}</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Agent Token</p>
              <div className="flex items-center space-x-2 bg-muted p-2 rounded font-mono text-xs break-all">
                <span className="flex-grow select-all">{node.token}</span>
                <Button variant="ghost" size="sm" onClick={copyApiKey}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="sm:justify-between pt-4">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving || !editedName.trim() || !editedIp.trim()}>
                  {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                </Button>
              </>
            ) : (
              <>
                <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}><Trash2 className="mr-2 h-4 w-4" /> Delete Node</Button>
                <Button onClick={() => setIsEditing(true)}><Edit className="mr-2 h-4 w-4" /> Edit Node</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the <span className="font-bold">{node.name}</span> node and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}