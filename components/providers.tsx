// components/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { IdleSessionProvider } from "@/components/IdleSessionProvider";
import { WebSocketProvider } from "@/components/WebSocketProvider";
import { Toaster } from "@/components/ui/toaster";

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <IdleSessionProvider>
          <WebSocketProvider>
            <div style={{ display: "contents" }}>
              {children}
              <Toaster />
            </div>
          </WebSocketProvider>
        </IdleSessionProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
