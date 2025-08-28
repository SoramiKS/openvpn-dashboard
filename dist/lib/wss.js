"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWebSocketServer = void 0;
// lib/wss.ts
var ws_1 = require("ws");
var initializeWebSocketServer = function (server) {
    // Cek apakah server sudah ada (untuk menghindari duplikasi saat hot-reload di development)
    if (!global._webSocketServer) {
        var wss = new ws_1.WebSocketServer({ server: server });
        global._webSocketServer = wss;
        wss.on('connection', function (ws) {
            console.log('🔌 Client WebSocket baru terhubung!');
            var pingInterval = setInterval(function () {
                if (ws.readyState === ws.OPEN) {
                    ws.ping(); // Kirim sinyal ping
                }
            }, 25000); // 25 detik
            // Kirim pesan sambutan
            ws.send(JSON.stringify({ type: 'WELCOME', message: 'Anda berhasil terhubung ke WebSocket server.' }));
            ws.on('close', function () {
                console.log('🔌 Client WebSocket terputus.');
                clearInterval(pingInterval); // Hentikan pengiriman ping
            });
        });
        console.log('✅ Server WebSocket berhasil diinisialisasi.');
    }
    return global._webSocketServer;
};
exports.initializeWebSocketServer = initializeWebSocketServer;
