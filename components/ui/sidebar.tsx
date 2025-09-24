// components/ui/sidebar.tsx (atau di mana pun file ini berada)
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LayoutDashboard,
  Server,
  FileKey,
  ScrollText,
  Menu,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

// PENINGKATAN: Tambahkan prop onLinkClick opsional
type SidebarProps = React.ComponentProps<"div"> & {
  onLinkClick?: () => void;
};

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    adminOnly: false,
  },
  { name: "Nodes", href: "/dashboard/nodes", icon: Server, adminOnly: true },
  {
    name: "VPN Profiles",
    href: "/dashboard/profiles",
    icon: FileKey,
    adminOnly: false,
  },
  { name: "Logs", href: "/dashboard/logs", icon: ScrollText, adminOnly: false },
  { name: "Users", href: "/dashboard/users", icon: Users, adminOnly: true },
];

// PENINGKATAN: Terima prop onLinkClick
export function Sidebar({ className, onLinkClick }: SidebarProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const userRole = session?.user?.role ?? "USER";

  if (status === "loading") {
    return (
      <div className={cn("space-y-4 py-4 px-3", className)}>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}

        </div>
      </div>
    );
  }

  return (
    <div className={cn("border-r flex flex-col h-full", className)}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-3 py-2">
          <div className="flex items-center mb-8 px-2">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="mr-2 rounded-full"
            />
            <div>
              <h1 className="text-xl font-bold">OpenVPN</h1>
              <p className="text-xs text-muted-foreground">Manager</p>
            </div>
          </div>
          <div className="space-y-1">
            {navigation
              .filter((item) => !item.adminOnly || userRole === "ADMIN")
              .map((item) => (
                <Link key={item.name} href={item.href} passHref>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start flex items-center gap-2"
                    onClick={onLinkClick}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              ))}
          </div>
        </div>
      </div>

      {session?.user?.email && (
        <div className="px-3 py-2 mt-auto border-t text-xs text-muted-foreground">
          <Link
            href={"/dashboard/userprofile"}
            className="hover:bg-accent hover:text-accent-foreground p-2 rounded-md flex items-center"
            onClick={onLinkClick}
          >
            <div className="flex flex-col">
              <span>Logged in as:</span>
              <span className="font-semibold break-all">{session.user.email}</span>
            </div>

          </Link>
        </div>
      )}
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
      <SheetContent side="left" className="p-0 w-64">
        <Sidebar onLinkClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
