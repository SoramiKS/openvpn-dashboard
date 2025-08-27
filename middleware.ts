// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    // Di dalam file middleware.ts

    callbacks: {
      authorized: ({ req, token }) => {
        // Jika tidak ada token (belum login), tolak akses
        if (!token) return false;

        // Contoh: Jika pengguna mencoba mengakses halaman '/dashboard/users'
        // dan perannya BUKAN ADMIN, tolak akses.
        if (req.nextUrl.pathname.startsWith('/dashboard/users')) {
          // @ts-ignore
          return token.role === 'ADMIN';
        }

        // Untuk semua halaman lain di dalam matcher, izinkan akses jika sudah login
        return true;
      }
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/((?!api/agent|api/auth|api/setup|login|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp)).*)",
  ],
};

