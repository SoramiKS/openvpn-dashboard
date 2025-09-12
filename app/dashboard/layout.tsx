// app/dashboard/layout.tsx
"use client";

import { Sidebar, MobileSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react"; // SessionProvider tidak perlu diimpor lagi
import { Toaster } from "@/components/ui/toaster";
import { IdleSessionProvider } from "@/components/IdleSessionProvider";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { WebSocketProvider } from "@/components/WebSocketProvider";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <IdleSessionProvider>
      <div className="flex h-screen">
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow shadow-sm">
            <Sidebar className="flex-grow" />
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className=" shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center">
                <MobileSidebar />
                <h2 className="text-lg font-semibold ml-2">
                  Dashboard
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </header>

          {/* Cukup render children tanpa provider di sini */}
          <main className="flex-1 overflow-y-auto p-6">
            <WebSocketProvider>
              {children}
            </WebSocketProvider>
            <Toaster />
          </main>
        </div>
      </div>
      <div className="absolute bottom-4 right-4">
        <ThemeToggleButton />
      </div>
    </IdleSessionProvider>
  );
}