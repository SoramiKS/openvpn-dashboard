// app/api/wss/route.ts
import { NextRequest } from "next/server";
import { initializeWebSocketServer } from "@/lib/wss";
import { createServer } from "http";

export const GET = async (req: NextRequest) => {
  // Hack: bikin dummy server, attach WSS
  const server = createServer();
  initializeWebSocketServer(server);

  return new Response("WS Server OK", { status: 200 });
};
