"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton"; // BARU
import {
  LayoutDashboard,
  Server,
  FileKey,
  ScrollText,
  Menu,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react"; // BARU
import Image from "next/image";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

// --- MODIFIKASI: Tambahkan properti 'adminOnly' ---
const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    adminOnly: false, // Bisa dilihat semua peran
  },
  {
    name: "Nodes",
    href: "/dashboard/nodes",
    icon: Server,
    adminOnly: true, // Hanya untuk admin
  },
  {
    name: "VPN Profiles",
    href: "/dashboard/profiles",
    icon: FileKey,
    adminOnly: false, // Bisa dilihat semua peran
  },
  {
    name: "Logs",
    href: "/dashboard/logs",
    icon: ScrollText,
    adminOnly: false, // Bisa dilihat semua peran
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users, // Menggunakan ikon Users
    adminOnly: true, // Hanya untuk admin
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  // --- BARU: Ambil data sesi dan status loading ---
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;

  // Tampilkan loading skeleton saat sesi sedang diperiksa
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

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center mb-8 px-2">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={80}
              height={80}
              className="h-8 w-8 mr-3 rounded-full text-primary"
              unoptimized
            />
            <div>
              <h1 className="text-xl font-bold">OpenVPN</h1>
              <p className="text-xs text-muted-foreground">Manager</p>
            </div>
          </div>
          <div className="space-y-1">
            {/* --- MODIFIKASI: Filter menu sebelum di-render --- */}
            {navigation
              .filter(item => {
                // Tampilkan item jika tidak adminOnly ATAU jika adminOnly dan peran user adalah ADMIN
                return !item.adminOnly || (item.adminOnly && userRole === 'ADMIN');
              })
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