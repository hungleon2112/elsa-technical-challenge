import express from 'express';
import http from 'http';
import createSocketServer from './services/socketService';

const app = express();
const server = http.createServer(app);
const io = createSocketServer(server);

const PORT = process.env.PORT || 3004;
server.listen(PORT, () => {
    console.log(`Real-Time Service running on port ${PORT}`);
});
