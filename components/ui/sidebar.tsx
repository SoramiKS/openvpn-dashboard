"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton"; // 1. Import Skeleton
import {
  LayoutDashboard,
  Server,
  FileKey,
  ScrollText,
  Menu,
  Users,
  Shield
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react"; // 2. Import useSession
import Image from "next/image"; // 3. Import Image for logo

// Tipe props tidak berubah
type SidebarProps = React.HTMLAttributes<HTMLDivElement> ;

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, adminOnly: false },
  { name: "Nodes", href: "/dashboard/nodes", icon: Server, adminOnly: true },
  { name: "VPN Profiles", href: "/dashboard/profiles", icon: FileKey, adminOnly: false },
  { name: "Logs", href: "/dashboard/logs", icon: ScrollText, adminOnly: false },
  { name: "Users", href: "/dashboard/users", icon: Users, adminOnly: true },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  // --- PERBAIKAN DI SINI ---
  // 3. Ambil data sesi DAN status loading-nya
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;

  // 4. Tampilkan placeholder loading jika sesi sedang diperiksa
  if (status === "loading") {
    return (
      <div className={cn("pb-12 space-y-4 py-4 px-3", className)}>
        <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }
  // --- AKHIR PERBAIKAN ---

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center mb-8 px-2">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="mr-2"/>
            <div>
              <h1 className="text-xl font-bold">OpenVPN</h1>
              <p className="text-xs text-muted-foreground">Manager</p>
            </div>
          </div>
          <div className="space-y-1">
            {navigation
              .filter(item => !item.adminOnly || (item.adminOnly && userRole === 'ADMIN'))
              .map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}