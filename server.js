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

// Track clients
const clients = {
  agents: new Map(), // serverId -> ws
  frontends: new Set(), // semua frontend
};

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    const pathname = parse(req.url).pathname;

    if (pathname === "/ws") {
      wss.handleUpgrade(req, socket, head, (ws) =>
        wss.emit("connection", ws, req)
      );
    }
  });

  wss.on("connection", (ws, req) => {
    const params = new URLSearchParams(parse(req.url, true).search);
    const type = params.get("type");
    const serverId = params.get("serverId");

    if (type === "agent" && serverId) {
      console.log(`[AGENT CONNECTED] Server ID: ${serverId}`);
      clients.agents.set(serverId, ws);

      broadcastToFrontends({
        event: "agent-status-change",
        payload: { serverId, status: "ONLINE" },
      });

      ws.on("message", (msg) => {
        const data = JSON.parse(msg.toString());
        broadcastToFrontends(data);
      });

      ws.on("close", () => {
        console.log(`[AGENT DISCONNECTED] Server ID: ${serverId}`);
        clients.agents.delete(serverId);
        broadcastToFrontends({
          event: "agent-status-change",
          payload: { serverId, status: "OFFLINE" },
        });
      });
    } else if (type === "frontend") {
      console.log("[FRONTEND CONNECTED]");
      clients.frontends.add(ws);

      ws.on("message", (msg) => {
        const command = JSON.parse(msg.toString());
        if (command.event === "command-to-agent") {
          const agentSocket = clients.agents.get(command.payload.serverId);
          if (agentSocket && agentSocket.readyState === 1) {
            agentSocket.send(JSON.stringify(command.payload));
          }
        }
      });

      ws.on("close", () => clients.frontends.delete(ws));
    } else {
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
  clients.frontends.forEach((ws) => {
    if (ws.readyState === 1) ws.send(str);
  });
}
