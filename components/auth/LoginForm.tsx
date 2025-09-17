"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { useToast } from "@/hooks/use-toast";
import { FcGoogle } from "react-icons/fc";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 2FA state
  const [showTwoFactorInput, setShowTwoFactorInput] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState("");

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

      router.replace('/login', { scroll: false });
    }
  }, [searchParams, toast, router]);

  // --- HANDLE SUBMIT ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Step 2: Verify 2FA token
    if (showTwoFactorInput) {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        twoFactorToken,
      });

      if (result?.error) {
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
        });
      } else if (result?.ok) {
        router.push("/dashboard");
      }
      setIsLoading(false);
      return;
    }

    // Step 1: Verify email + password + recaptcha
    if (!recaptchaToken) {
      toast({
        title: "Login Failed",
        description: "Please verify the reCAPTCHA",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      recaptchaToken,
    });

    if (result?.error === "2FA_REQUIRED") {
      setShowTwoFactorInput(true);
    } else if (result?.error) {
      toast({
        title: "Login Failed",
        description: result.error,
        variant: "destructive",
      });
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } else if (result?.ok) {
      router.push("/dashboard");
    }

    setIsLoading(false);
  };

  // --- GOOGLE LOGIN ---
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const result = await signIn("google", {
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      setIsLoading(false);
      toast({
        title: "Login Failed",
        description: result.error,
        variant: "destructive",
      });
    } else if (result?.ok) {
      router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={handleLoginSubmit} className="space-y-6">
      {/* Step 2FA or Normal Login */}
      {showTwoFactorInput ? (
        <div className="space-y-2">
          <Label htmlFor="2fa-token">6-Digit Code</Label>
          <Input
            id="2fa-token"
            type="text"
            inputMode="numeric"
            placeholder="123456"
            value={twoFactorToken}
            onChange={(e) => setTwoFactorToken(e.target.value)}
            maxLength={6}
            required
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Enter the code from your authenticator app.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={setRecaptchaToken}
              onExpired={() => setRecaptchaToken(null)}
            />
          </div>
        </>
      )}

      <Button
        type="submit"
        className="w-full py-2.5 text-lg font-semibold"
        disabled={isLoading || (!recaptchaToken && !showTwoFactorInput)}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...
          </>
        ) : showTwoFactorInput ? (
          "Verify Code"
        ) : (
          "Sign In"
        )}
      </Button>

      {/* Hide Google button on 2FA step */}
      {!showTwoFactorInput && (
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 text-lg font-semibold flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <FcGoogle className="h-5 w-5" />
          )}
          Sign in with Google
        </Button>
      )}
    </form>
  );
};
