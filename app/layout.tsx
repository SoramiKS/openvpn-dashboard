import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenVPN Dashboard",
  description: "Centralized OpenVPN Server",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        {/* ThemeProvider di paling luar */}
        <ThemeProvider>
          {/* SessionProvider di dalamnya */}
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
