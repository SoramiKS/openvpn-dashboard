import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { RateLimiterMemory } from "rate-limiter-flexible";

// Rate limiter: max 5 attempts per minute per IP
const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
});

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
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
          throw new Error("Email, password, and reCAPTCHA token are required.");
        }

        const ip = req.headers?.["x-forwarded-for"] || "unknown";
        try {
          await rateLimiter.consume(ip as string);
        } catch {
          throw new Error("Too many login attempts. Please try again later.");
        }

        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${credentials.recaptchaToken}`;
        const recaptchaResponse = await fetch(verifyUrl, { method: "POST" });
        const recaptchaData = await recaptchaResponse.json();
        if (!recaptchaData.success) throw new Error("reCAPTCHA verification failed.");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email! }, // assert non-null
        });
        if (!user) throw new Error("Invalid email or password.");

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) throw new Error("Invalid email or password.");

        return { id: user.id, email: user.email!, role: user.role }; // email! is safe
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false; // safety
        const emailDomain = user.email.split("@")[1];

        // Optional domain restriction
        if (emailDomain !== "clouddonut.com") {
          throw new Error("Your email have no access to this application.");
        }

        // Auto-create user in DB if not exists
        let dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email!, // non-null
              role: "USER",       // match your Prisma enum
              password: "",       // empty string for Google login
            },
          });
        }
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
