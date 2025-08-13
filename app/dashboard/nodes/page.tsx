// app/nodes/page.tsx
// Ini adalah Server Component secara default.
// File ini akan menjadi entry point untuk rute /nodes.

import NodesClientPage from "./client"; // Ganti nama file klien menjadi client.tsx

export default function NodesPage() {
  // Baca variabel lingkungan dari sisi server.
  const agentApiKey = process.env.AGENT_API_KEY;
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3000";

  // Validasi penting: Pastikan variabel lingkungan sudah diatur.
  if (!agentApiKey) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg border border-red-500 bg-red-50 p-6 text-center text-red-700">
          <h2 className="text-xl font-bold">Error Konfigurasi Server</h2>
          <p className="mt-2">
            Variabel `AGENT_API_KEY` tidak ditemukan di environment server.
            <br />
            Harap atur di file `.env.local` Anda dan restart server.
          </p>
        </div>
      </div>
    );
  }

  // Teruskan data yang aman untuk dibaca klien sebagai props ke Client Component.
  return <NodesClientPage apiKey={agentApiKey} dashboardUrl={dashboardUrl} />;
}
