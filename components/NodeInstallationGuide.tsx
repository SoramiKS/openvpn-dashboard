// components/NodeInstallationGuide.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Impor DialogFooter

// Helper component untuk tombol salin
const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const { toast } = useToast();
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    toast({
        title: "Tersalin!",
        description: "Teks telah disalin ke clipboard.",
    });
  };
  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} className="shrink-0">
      <Copy className="h-4 w-4" />
    </Button>
  );
};

// Props yang dibutuhkan oleh komponen panduan
interface NodeInstallationGuideProps {
  nodeName: string;
  serverId: string;
  apiKey: string;
  dashboardUrl: string;
  onFinish: () => void; // Prop baru untuk menangani penutupan dialog
}

export function NodeInstallationGuide({ nodeName, serverId, apiKey, dashboardUrl, onFinish }: NodeInstallationGuideProps) {
  const [step, setStep] = useState(1);

  const scriptUrl = "https://raw.githubusercontent.com/SoramiKS/ovpn-agent-bash/refs/heads/main/deploymentovpn.sh";
  const wgetCommand = `wget ${scriptUrl} -O install.sh`;
  const chmodCommand = "chmod +x install.sh";
  const runCommand = "sudo ./install.sh";

  // Ekstrak informasi dari dashboardUrl untuk panduan
  let hostname = "localhost";
  let port = "3000";
  let isIpAddress = false;
  try {
      const url = new URL(dashboardUrl);
      hostname = url.hostname;
      port = url.port || (url.protocol === "https:" ? "443" : "80");
      isIpAddress = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
  } catch(e) {
      // FIX: Menggunakan variabel 'e' untuk menghilangkan peringatan unused-vars
      console.error("Invalid dashboardUrl provided:", dashboardUrl, e);
  }
  
  return (
    // Menggunakan DialogHeader dan DialogFooter untuk konsistensi
    <>
      <DialogHeader>
        {/* FIX: Mengganti " dengan &quot; untuk menghilangkan error no-unescaped-entities */}
        <DialogTitle className="text-2xl">Panduan Instalasi untuk Node &quot;{nodeName}&quot;</DialogTitle>
        <DialogDescription>Langkah {step} dari 2: {step === 1 ? "Persiapan Skrip di Server" : "Mengisi Konfigurasi"}</DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6 py-4">
        {step === 1 && (
          <div className="space-y-4">
            <p>Jalankan perintah berikut secara berurutan di terminal server baru Anda.</p>
            <div>
              <h4 className="font-semibold text-sm mb-1">1. Unduh Skrip Instalasi</h4>
              <div className="flex items-center gap-2 p-2 bg-slate-800 text-white rounded-md font-mono text-sm">
                <span className="flex-grow overflow-x-auto">{wgetCommand}</span>
                <CopyButton textToCopy={wgetCommand} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">2. Beri Izin Eksekusi</h4>
              <div className="flex items-center gap-2 p-2 bg-slate-800 text-white rounded-md font-mono text-sm">
                <span className="flex-grow">{chmodCommand}</span>
                <CopyButton textToCopy={chmodCommand} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">3. Jalankan Skrip</h4>
              <div className="flex items-center gap-2 p-2 bg-slate-800 text-white rounded-md font-mono text-sm">
                <span className="flex-grow">{runCommand}</span>
                <CopyButton textToCopy={runCommand} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground pt-2">Setelah menjalankan perintah terakhir, terminal akan meminta input. Lanjutkan ke langkah berikutnya untuk melihat data yang perlu Anda masukkan.</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <p>Gunakan informasi di bawah ini untuk menjawab pertanyaan yang muncul di terminal Anda.</p>
            <div className="space-y-4 rounded-lg border bg-slate-50 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Nama Aplikasi untuk PM2:</p>
                  <code className="text-sm text-blue-600">vpn-agent</code>
                </div>
                <CopyButton textToCopy="vpn-agent" />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">AGENT_API_KEY:</p>
                  <code className="text-sm text-blue-600 font-mono">{apiKey}</code>
                </div>
                <CopyButton textToCopy={apiKey} />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Alamat Dashboard API:</p>
                <div className="pl-4 border-l-2">
                  <p className="text-xs text-muted-foreground mb-1">Skrip akan bertanya jenis alamat. {isIpAddress ? "Pilih opsi '1' (Alamat IP)." : "Pilih opsi '2' (Nama Domain)."} </p>
                  <div className="flex justify-between items-center">
                    <code className="text-sm text-blue-600 font-mono">{hostname}</code>
                    <CopyButton textToCopy={hostname} />
                  </div>
                </div>
              </div>
                <div>
                <p className="text-sm font-medium mb-2">Port Kustom:</p>
                  <div className="pl-4 border-l-2">
                  <p className="text-xs text-muted-foreground mb-1">
                    {port === "443" || port === "80" ? "Pilih 'N' (Tidak), karena Anda menggunakan port standar." : `Pilih 'y' (Ya), lalu masukkan port berikut:`}
                  </p>
                  {(port !== "443" && port !== "80") && (
                    <div className="flex justify-between items-center">
                      <code className="text-sm text-blue-600 font-mono">{port}</code>
                      <CopyButton textToCopy={port} />
                    </div>
                  )}
                  </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">ID Server:</p>
                  <code className="text-sm text-blue-600 font-mono">{serverId}</code>
                </div>
                <CopyButton textToCopy={serverId} />
              </div>
            </div>
             <p className="text-sm text-muted-foreground pt-2">Setelah semua input diisi, skrip akan menyelesaikan instalasi. Node Anda akan segera terhubung ke dashboard.</p>
          </div>
        )}
      </div>

      <DialogFooter>
        <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => setStep(1)} disabled={step === 1}>
                Kembali
            </Button>
            {step === 1 ? (
                <Button onClick={() => setStep(2)}>
                    Langkah Selanjutnya
                </Button>
            ) : (
                <Button onClick={onFinish}>
                    Selesai
                </Button>
            )}
        </div>
      </DialogFooter>
    </>
  );
}
