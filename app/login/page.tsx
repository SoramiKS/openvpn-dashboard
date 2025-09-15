"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import Image from "next/image";

// BARU: Impor komponen form yang sudah dipisah
import { LoginForm } from "@/components/auth/LoginForm";
import { SetupForm } from "@/components/auth/SetupForm";

export default function LoginPage() {
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/setup")
      .then((res) => res.json())
      .then((data) => setNeedsSetup(data.needsSetup))
      .catch(() => {
        console.error("Failed to check setup status.");
        setNeedsSetup(false);
      });
  }, []);

  const title = needsSetup ? "First Admin Setup" : "OpenVPN Manager";
  const description = needsSetup
    ? "Database is empty. Please create the first admin account."
    : "Log in to your account to manage your VPN.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* Card utama */}
      <Card className="w-full max-w-md shadow-xl rounded-2xl border">
        <CardHeader className="text-center p-6 border-b space-y-4">
          <div className="flex justify-center">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={80}
              height={80}
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {needsSetup === null ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : needsSetup ? (
            <SetupForm />
          ) : (
            <LoginForm />
          )}
        </CardContent>
      </Card>

      {/* Toaster */}
      <Toaster />

      {/* Tombol theme toggle */}
      <div className="fixed top-4 right-4">
        <ThemeToggleButton />
      </div>
    </div>
  );
}
