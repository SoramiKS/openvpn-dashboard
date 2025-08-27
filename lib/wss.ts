// lib/wss.ts
import { WebSocketServer } from 'ws';
import type { Server } from 'http';

// Deklarasikan tipe global agar kita bisa mengaksesnya di mana saja
declare global {
  var _webSocketServer: WebSocketServer | undefined;
}

export const initializeWebSocketServer = (server: Server) => {
  // Cek apakah server sudah ada (untuk menghindari duplikasi saat hot-reload di development)
  if (!global._webSocketServer) {
    const wss = new WebSocketServer({ server });
    global._webSocketServer = wss;

    wss.on('connection', (ws) => {
      console.log('🔌 Client WebSocket baru terhubung!');

      // Kirim pesan sambutan
      ws.send(JSON.stringify({ type: 'WELCOME', message: 'Anda berhasil terhubung ke WebSocket server.' }));

      ws.on('close', () => {
        console.log('🔌 Client WebSocket terputus.');
      });
    });

    console.log('✅ Server WebSocket berhasil diinisialisasi.');
  }
  return global._webSocketServer;
};