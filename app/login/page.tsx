"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha"; // Import ReCAPTCHA
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // --- BARU: State untuk menyimpan token dari checkbox ---
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!recaptchaToken) {
      setError("Silakan verifikasi bahwa Anda bukan robot.");
      return;
    }

    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      recaptchaToken, // Kirim token dari state
    });

    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
    } else if (result?.ok) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="space-y-1 text-center p-6 bg-white border-b border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full shadow-inner">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={100}
                height={100}
                className="rounded-full"
                unoptimized
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold text-gray-800">OpenVPN Manager</CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Masuk ke akun Anda untuk mengelola VPN Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm" role="alert">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {/* --- MODIFIKASI: Komponen ReCAPTCHA dibuat terlihat --- */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                onChange={(token) => setRecaptchaToken(token)}
                onExpired={() => setRecaptchaToken(null)}
              />
            </div>

            {/* Tombol akan nonaktif jika reCAPTCHA belum dicentang */}
            <Button type="submit" className="w-full py-2.5 rounded-md text-lg font-semibold" disabled={isLoading || !recaptchaToken}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing In...</>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}