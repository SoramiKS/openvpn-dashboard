// server.js
const { createServer } = require('http');
const next = require('next');
const { parse } = require('url');
const { initializeWebSocketServer } = require('./dist/lib/wss.js'); // Impor dari direktori output 'dist'

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Inisialisasi WebSocket Server setelah server HTTP dibuat
  initializeWebSocketServer(server);

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});