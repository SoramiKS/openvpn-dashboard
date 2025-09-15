// ws-server.js

const { WebSocketServer } = require('ws');
const { parse } = require('url');

const port = 3001; // Kita gunakan port yang berbeda
const wss = new WebSocketServer({ port });

console.log(`> WebSocket server ready at ws://localhost:${port}`);

const clients = {
  agents: new Map(),
  frontends: new Set(),
};

wss.on('connection', (ws, req) => {
  const params = new URLSearchParams(parse(req.url, true).search);
  const type = params.get('type');
  const serverId = params.get('serverId');

  if (type === 'agent' && serverId) {
    console.log(`[AGENT CONNECTED] Server ID: ${serverId}`);
    clients.agents.set(serverId, ws);
    broadcastToFrontends({ event: 'agent-status-change', payload: { serverId, status: 'ONLINE' } });
    
    ws.on('message', (msg) => broadcastToFrontends(JSON.parse(msg.toString())));
    ws.on('close', () => {
      console.log(`[AGENT DISCONNECTED] Server ID: ${serverId}`);
      clients.agents.delete(serverId);
      broadcastToFrontends({ event: 'agent-status-change', payload: { serverId, status: 'OFFLINE' } });
    });

  } else if (type === 'frontend') {
    console.log('[FRONTEND CONNECTED]');
    clients.frontends.add(ws);
    
    ws.on('message', (msg) => {
      const command = JSON.parse(msg.toString());
      if (command.event === 'command-to-agent') {
        const agentSocket = clients.agents.get(command.payload.serverId);
        if (agentSocket && agentSocket.readyState === 1) {
          agentSocket.send(JSON.stringify(command.payload));
        }
      }
    });
    ws.on('close', () => clients.frontends.delete(ws));
  } else {
    ws.close();
  }
});

function broadcastToFrontends(msg) {
  const str = JSON.stringify(msg);
  clients.frontends.forEach(ws => {
    if (ws.readyState === 1) ws.send(str);
  });
}