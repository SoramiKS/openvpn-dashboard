// server.js
const { createServer } = require("http");
const next = require("next");
const { WebSocketServer } = require("ws");
const { parse } = require("url");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

// Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Track frontend clients
const frontends = new Set();

app.prepare().then(() => {
  // Buat HTTP server
  const server = createServer((req, res) => handle(req, res));

  // Buat WebSocket server
  const wss = new WebSocketServer({ noServer: true });

  // Simpan WSS ke global biar bisa diakses route/logic lain
  global._webSocketServer = wss;

  // Upgrade HTTP ke WS
  server.on("upgrade", (req, socket, head) => {
    const pathname = parse(req.url).pathname;
    if (pathname === "/ws") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    }
  });

  // Handle WS connections
  wss.on("connection", (ws, req) => {
    const params = new URLSearchParams(parse(req.url, true).search);
    const type = params.get("type");

    if (type === "frontend") {
      console.log("[FRONTEND CONNECTED]");
      frontends.add(ws);

      ws.on("message", (msg) => {
        try {
          const data = JSON.parse(msg.toString());
          // Broadcast ke semua frontend (optional)
          broadcastToFrontends(data);
        } catch (err) {
          console.error("[WS ERROR] Invalid message:", err);
        }
      });

      ws.on("close", () => {
        console.log("[FRONTEND DISCONNECTED]");
        frontends.delete(ws);
      });
    } else {
      // Tolak selain frontend
      ws.close();
    }
  });

  server.listen(port, () => {
    console.log(`> Next.js + WS ready at http://${hostname}:${port}`);
  });
});

// Broadcast helper
function broadcastToFrontends(msg) {
  const str = JSON.stringify(msg);
  frontends.forEach((ws) => {
    if (ws.readyState === 1) ws.send(str);
  });
}
