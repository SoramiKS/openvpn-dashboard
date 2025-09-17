// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (!token) return false;

        // --- PERBAIKAN DI SINI ---
        // Definisikan semua rute yang hanya boleh diakses oleh ADMIN
        const adminRoutes = ['/dashboard/users', '/dashboard/nodes'];

        // Cek apakah path yang sedang diakses dimulai dengan salah satu rute admin
        if (adminRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
          // Jika ya, maka user harus memiliki role 'ADMIN'
          // @ts-ignore
          return token.role === 'ADMIN';
        }
        // --- AKHIR PERBAIKAN ---

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