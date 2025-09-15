// components/NodeCopyButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react"; // Impor ikon Check
import { useToast } from "@/hooks/use-toast";

export default function NodeCopyButton({ nodeId }: { nodeId: string }) {
    const [isCopied, setIsCopied] = useState(false);
    const { toast } = useToast();

    const handleCopy = async () => {
        // Jika sudah dalam state "Copied!", jangan lakukan apa-apa
        if (isCopied) return;

        try {
            await navigator.clipboard.writeText(nodeId);
            setIsCopied(true);
            
            // Tampilkan toast sebagai konfirmasi tambahan (opsional tapi bagus)
            toast({
                title: "Copied to clipboard!",
                description: "Node ID is now in your clipboard.",
            });
            
            // Reset state tombol setelah 2 detik
            setTimeout(() => setIsCopied(false), 2000);

        } catch (error) {
            console.error("Failed to copy Node ID:", error);
            toast({
                title: "Clipboard Error",
                description: "Failed to copy. Please try again or copy manually.",
                variant: "destructive",
            });
        }
    };

    return (
        <Button
            size="sm"
            variant="secondary"
            onClick={handleCopy}
            // Nonaktifkan tombol saat dalam proses copy untuk mencegah klik ganda
            disabled={isCopied} 
            className="w-[110px]" // Beri lebar tetap agar layout tidak "melompat" saat teks berubah
        >
            {isCopied ? (
                <>
                    <Check className="h-4 w-4 mr-1 text-green-500" /> Copied!
                </>
            ) : (
                <>
                    <Copy className="h-4 w-4 mr-1" /> Copy ID
                </>
            )}
        </Button>
    );
}