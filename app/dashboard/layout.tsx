// app/dashboard/layout.tsx
"use client";

import { Sidebar, MobileSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex h-screen">
      <div className="hidden md:flex md:w-[200px] md:flex-col">
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
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <div className="absolute bottom-4 right-4">
        <ThemeToggleButton />
      </div>
    </div>
  );
}