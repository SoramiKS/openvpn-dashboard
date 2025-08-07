        // lib/authOptions.ts
        import { AuthOptions } from "next-auth"
        import CredentialsProvider from "next-auth/providers/credentials"
        import type { JWT } from "next-auth/jwt"
        import type { Session } from "next-auth"

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
                    role: "ADMIN",
                  };
                } else {
                  console.warn(`Login attempt failed: Invalid username or password.`)
                  throw new Error("Invalid username or password.")
                }
              },
            }),
          ],
          callbacks: {
            async jwt({ token, user }: { token: JWT; user: any }) {
              if (user) {
                token.id = user.id
                token.role = user.role
              }
              return token
            },
            async session({ session, token }: { session: Session; token: JWT }) {
              if (token) {
                (session.user as any).id = token.id as string
                (session.user as any).role = token.role as string
              }
              return session
            },
          },
          pages: {
            signIn: "/login",
            error: "/auth/error",
          },
          secret: process.env.NEXTAUTH_SECRET,
        }
        