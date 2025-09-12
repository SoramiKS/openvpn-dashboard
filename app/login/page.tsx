"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { FcGoogle } from "react-icons/fc";
import { Toaster } from "@/components/ui/toaster";
import { useSearchParams } from "next/navigation";

// --- Credentials Login Form ---
const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const { toast } = useToast();
    const searchParams = useSearchParams();

    useEffect(() => {
        const error = searchParams.get("error");
        if (error) {
            toast({
                title: "Login Failed",
                description: decodeURIComponent(error),
                variant: "destructive",
            });
        }
    }, [searchParams, toast]);

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recaptchaToken) {
            toast({ title: "Login Failed", description: "Please verify reCAPTCHA", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
            recaptchaToken,
        });
        setIsLoading(false);

        if (result?.error) {
            toast({ title: "Login Failed", description: result.error, variant: "destructive" });
            recaptchaRef.current?.reset();
            setRecaptchaToken(null);
        } else if (result?.ok) {
            router.push("/dashboard");
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        const result = await signIn("google", { redirect: false, callbackUrl: "/dashboard" });
        setIsLoading(false);

        if (result?.error) {
            toast({
                title: "Login Failed",
                description: result.error || "Only clouddonut.com emails are allowed",
                variant: "destructive",
            });
        } else if (result?.ok) {
            router.push("/dashboard");
        }
    };

    return (
        <form onSubmit={handleCredentialsLogin} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[2.2rem] text-gray-400 hover:text-gray-600"
                >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>

            <div className="flex justify-center">
                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    onChange={setRecaptchaToken}
                    onExpired={() => setRecaptchaToken(null)}
                />
            </div>

            <Button type="submit" className="w-full py-2.5 text-lg font-semibold" disabled={isLoading || !recaptchaToken}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing In...
                    </>
                ) : (
                    "Sign In"
                )}
            </Button>

            <Button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 text-lg font-semibold flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50"
            >
                <FcGoogle className="h-5 w-5" /> Sign in with Google
            </Button>
        </form>
    );
};

// --- First Admin Setup Form ---
const SetupForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const { toast } = useToast();

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recaptchaToken) {
            toast({ title: "Setup Failed", description: "Please verify reCAPTCHA", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, recaptchaToken }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create admin");

            toast({ title: "Admin Created", description: "Please log in now." });
            setTimeout(() => window.location.reload(), 2000);
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast({ title: "Setup Failed", description: err.message, variant: "destructive" });
            }
            recaptchaRef.current?.reset();
            setRecaptchaToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleCreateAdmin} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                    id="admin-email"
                    type="email"
                    placeholder="Enter admin email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2 relative">
                <Label htmlFor="admin-password">Admin Password</Label>
                <Input
                    id="admin-password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <div className="flex justify-center">
                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    onChange={setRecaptchaToken}
                    onExpired={() => setRecaptchaToken(null)}
                />
            </div>

            <Button type="submit" className="w-full py-2.5 text-lg font-semibold" disabled={isLoading || !recaptchaToken}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating Admin...
                    </>
                ) : (
                    "Create First Admin"
                )}
            </Button>
        </form>
    );
};

// --- Main Page ---
export default function LoginPage() {
    const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);

    useEffect(() => {
        fetch("/api/setup")
            .then((res) => res.json())
            .then((data) => setNeedsSetup(data.needsSetup))
            .catch(() => setNeedsSetup(false));
    }, []);

    const title = needsSetup ? "First Admin Setup" : "OpenVPN Manager";
    const description = needsSetup
        ? "Database is empty. Please create the first admin account."
        : "Log in to your account to manage your VPN.";

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="space-y-1 text-center p-6 border-b">
                    <div className="flex justify-center mb-4 rounded-full">
                        <Image src="/logo.svg" alt="Logo" width={80} height={80} unoptimized className="rounded-full" />
                    </div>
                    <CardTitle className="text-3xl font-extrabold">{title}</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">{description}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
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
            <Toaster />
            <div className="absolute top-4 right-4">
                <ThemeToggleButton />
            </div>
        </div>
    );
}
