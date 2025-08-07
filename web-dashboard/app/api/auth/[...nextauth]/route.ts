import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

// INI DOANG YANG BOLEH DIEKSPORT BRO
export { handler as GET, handler as POST };
