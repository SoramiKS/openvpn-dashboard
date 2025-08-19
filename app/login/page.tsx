"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// --- Komponen untuk Form Login Biasa ---
const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        setIsLoading(false);

        if (result?.error) {
            setError(result.error);
        } else if (result?.ok) {
            router.push("/dashboard");
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-5">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>}
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full py-2.5 text-lg font-semibold" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing In...</> : "Sign In"}
            </Button>
        </form>
    );
};

// --- Komponen untuk Form Setup Admin Pertama ---
const SetupForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Gagal membuat admin.");

            toast({ title: "Admin Berhasil Dibuat!", description: "Silakan login menggunakan akun yang baru saja Anda buat." });
            window.location.reload(); // Refresh halaman untuk menampilkan form login
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleCreateAdmin} className="space-y-5">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>}
            <div className="space-y-2">
                <Label htmlFor="admin-email">Email Admin</Label>
                <Input id="admin-email" type="email" placeholder="Masukkan email admin..." value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="admin-password">Password Admin</Label>
                <Input id="admin-password" type="password" placeholder="Minimal 8 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full py-2.5 text-lg font-semibold" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating...</> : "Create Admin"}
            </Button>
        </form>
    );
};

// --- Komponen Halaman Login Utama ---
export default function LoginPage() {
    const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);

    useEffect(() => {
        const checkSetup = async () => {
            try {
                const response = await fetch('/api/setup');
                const data = await response.json();
                setNeedsSetup(data.needsSetup);
            } catch (error) {
                console.error("Gagal memeriksa status setup:", error);
                setNeedsSetup(false); // Default ke form login jika API gagal
            }
        };
        checkSetup();
    }, []);

    const TitleIcon = needsSetup ? UserPlus : Shield;
    const titleText = needsSetup ? "Setup Admin Pertama" : "OpenVPN Manager";
    const descriptionText = needsSetup ? "Database kosong. Silakan buat akun admin pertama." : "Masuk ke akun Anda untuk mengelola VPN Anda.";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <Card className="w-full max-w-md shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="space-y-1 text-center p-6 bg-white border-b">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full shadow-inner">
                            <TitleIcon className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-extrabold">{titleText}</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">{descriptionText}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                    {needsSetup === null ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : needsSetup ? (
                        <SetupForm />
                    ) : (
                        <LoginForm />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}