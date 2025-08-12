// lib/authOptions.ts
import { AuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// 1. Extend the default User type to include your custom 'role' property
interface User extends NextAuthUser {
  role?: string;
}

// 2. Extend the default JWT type to include your custom properties
interface ExtendedJWT extends JWT {
  id?: string;
  role?: string;
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "admin-user",
            name: process.env.ADMIN_USERNAME,
            email: "admin@dashboard.com",
            role: "ADMIN", // Your custom property
          };
        } else {
          console.warn(`Login attempt failed: Invalid username or password.`);
          throw new Error("Invalid username or password.");
        }
      },
    }),
  ],
  callbacks: {
    // 3. Use the extended types in the callbacks
    async jwt({ token, user }: { token: ExtendedJWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: ExtendedJWT }) {
      if (token && session.user) {
        // 4. Safely add the properties to the session user
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};