// dev-server.js

const { createServer } = require("http");
const next = require("next");
const { WebSocketServer } = require("ws");
const { parse } = require("url");

const dev = true; // Mode development diaktifkan
const hostname = "localhost";
const port = process.env.PORT || 3000;

// Inisialisasi aplikasi Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Buat server HTTP
  const server = createServer((req, res) => {
    handle(req, res);
  });

  // Buat server WebSocket
  const wss = new WebSocketServer({ noServer: true });

  // PERHATIKAN: Simpan instance WSS ke variabel global
  // Ini adalah kunci agar API route bisa mengaksesnya
  global._webSocketServer = wss;

  // Tangani permintaan 'upgrade' HTTP ke WebSocket
  server.on("upgrade", (req, socket, head) => {
    const pathname = parse(req.url).pathname;
    if (pathname === "/ws") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    }
  });

  // Logika koneksi WebSocket (hanya untuk frontend)
  wss.on("connection", (ws, req) => {
    const params = new URLSearchParams(parse(req.url, true).search);
    const type = params.get("type");

    if (type === "frontend") {
      console.log("[DEV-WS] Frontend terhubung.");
      ws.on("close", () => {
        console.log("[DEV-WS] Frontend terputus.");
      });
    } else {
      // Tolak koneksi selain dari frontend
      ws.close();
    }
  });

  server.listen(port, () => {
    console.log(`> Server Development siap di http://${hostname}:${port}`);
  });
});