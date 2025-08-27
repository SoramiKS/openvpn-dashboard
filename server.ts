import { createServer } from 'http';
import next from 'next';
import { initializeWebSocketServer } from './lib/wss';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = 3000;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  // Inisialisasi WebSocket di dev
  initializeWebSocketServer(server);

  server.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
  });
});
