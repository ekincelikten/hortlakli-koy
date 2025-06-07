
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hortlaklı Köy Sunucusu çalışıyor!');
});

io.on('connection', (socket) => {
  console.log('Yeni socket bağlantısı:', socket.id);
  socket.on('disconnect', () => {
    console.log('Socket ayrıldı:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Sunucu port ${PORT} üzerinde çalışıyor`);
});
