import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from 'bcrypt';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Konfigurasi Rate Limiter: Maksimal 5 percobaan per menit dari satu IP
const rateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 60, // dalam detik
});

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    // --- PEMBARUAN DI SINI ---
    // Atur masa berlaku maksimum sesi menjadi 1 jam (dalam detik)
    maxAge: 60 * 60, // 1 jam
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        recaptchaToken: { label: "reCAPTCHA Token", type: "text" },
      },
      async authorize(credentials, req) { 
        if (!credentials?.email || !credentials?.password || !credentials.recaptchaToken) {
          throw new Error("Email, password, dan token reCAPTCHA wajib diisi.");
        }

        const ip = req.headers?.['x-forwarded-for'] || 'unknown';

        try {
            await rateLimiter.consume(ip as string);
        } catch {
            throw new Error("Terlalu banyak percobaan login. Silakan coba lagi nanti.");
        }

        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${credentials.recaptchaToken}`;
        const recaptchaResponse = await fetch(verifyUrl, { method: "POST" });
        const recaptchaData = await recaptchaResponse.json();

        if (!recaptchaData.success) {
          throw new Error("Verifikasi reCAPTCHA gagal. Anda mungkin bot.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) { throw new Error("Email atau password salah."); }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) { throw new Error("Email atau password salah."); }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
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