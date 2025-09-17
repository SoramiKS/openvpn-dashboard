// lib/authOptions.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { authenticator } from 'otplib';

const rateLimiter = new RateLimiterMemory({ points: 5, duration: 60 });

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 jam
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        recaptchaToken: { label: "reCAPTCHA Token", type: "text" },
        // BARU: Tambahkan field untuk token 2FA
        twoFactorToken: { label: "2FA Token", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email) {
          throw new Error("Email is required.");
        }

        const ip = req.headers?.["x-forwarded-for"] || "unknown";

        // --- LOGIKA BARU UNTUK 2FA ---
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("Invalid email or password.");

        // Skenario 1: Verifikasi Token 2FA (Langkah 2)
        if (credentials.twoFactorToken) {
          if (!user.twoFactorSecret || !user.twoFactorEnabled) {
            throw new Error("2FA is not enabled for this account.");
          }
          const isValid = authenticator.check(credentials.twoFactorToken, user.twoFactorSecret);
          if (isValid) {
            return { id: user.id, email: user.email, role: user.role };
          } else {
            throw new Error("Invalid 2FA token.");
          }
        }

        // Skenario 2: Verifikasi Password (Langkah 1)
        if (!credentials.password || !credentials.recaptchaToken) {
          throw new Error("Password and reCAPTCHA are required.");
        }

        // Lakukan rate limiting dan reCAPTCHA hanya untuk verifikasi password
        try {
          await rateLimiter.consume(ip as string);
        } catch {
          throw new Error("Too many login attempts. Please try again later.");
        }

        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${credentials.recaptchaToken}`;
        const recaptchaResponse = await fetch(verifyUrl, { method: "POST" });
        const recaptchaData = await recaptchaResponse.json();
        if (!recaptchaData.success) throw new Error("reCAPTCHA verification failed.");

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) throw new Error("Invalid email or password.");

        // Jika password valid, cek status 2FA
        if (user.twoFactorEnabled) {
          // JANGAN login, beri sinyal ke frontend untuk meminta token 2FA
          throw new Error("2FA_REQUIRED");
        }

        // Jika password valid dan 2FA tidak aktif, login seperti biasa
        return { id: user.id, email: user.email, role: user.role };
      },
    }),
    // GoogleProvider tidak berubah
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false; // safety
        const email = user.email;
        const domain = email.split("@")[1];

        const whitelistEntries = await prisma.googleWhitelist.findMany({
          select: { value: true, type: true },
        });

        // Cek apakah email atau domain pengguna ada di dalam whitelist
        const isAllowed = whitelistEntries.some(entry => {
          if (entry.type === 'EMAIL') {
            return entry.value === email; // Cek kecocokan email persis
          }
          if (entry.type === 'DOMAIN') {
            return entry.value === domain; // Cek kecocokan domain
          }
          return false;
        });

        if (!isAllowed) {
          throw new Error(`Your email or domain (@${domain}) is not allowed to access this application.`);
        }

        // Auto-create user in DB if not exists
        let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        dbUser ??= await prisma.user.create({
            data: {
              email: user.email, // non-null
              role: "USER",       // match your Prisma enum
              password: "",       // empty string for Google login
            },
          });
        user.id = dbUser.id;
        user.role = dbUser.role;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// --- App Router compatible ---
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return NextAuth(authOptions)(req);
}
export async function POST(req: NextRequest) {
  return NextAuth(authOptions)(req);
}
