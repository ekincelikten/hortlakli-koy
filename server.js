const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use('/avatars', express.static(path.join(__dirname, 'avatars')));

let lobbies = [];
let globalPlayerId = 0;

const MAX_PLAYERS_PER_LOBBY = 6;

function createLobby() {
  const id = lobbies.length + 1;
  const lobby = {
    id,
    players: [],
    phase: 'lobby',
    voteCounts: {},
    voteLog: [],
    finalVotes: [],
    dayTimer: null,
    dayStartTime: null,
    remainingDayTime: 90000,
    nightActions: {
      kill: null,
      protect: null,
      silence: null,
      jail: null,
      execute: null,
      investigate: null
    },
    jailerExecuted: false,
    jailerMarkedTarget: null
  };
  lobbies.push(lobby);
  return lobby;
}

function assignRoles(lobby) {
  const roles = [
    { name: 'Gulyabani', team: 'hortlak' },
    { name: 'İfrit', team: 'hortlak' },
    { name: 'Doktor', team: 'köylü' },
    { name: 'Dedektif', team: 'köylü' },
    { name: 'Gardiyan', team: 'köylü' },
    { name: 'Vatandaş', team: 'köylü' }
  ];
  const shuffled = [...lobby.players].sort(() => Math.random() - 0.5);
  shuffled.forEach((p, i) => {
    p.role = roles[i].name;
    p.team = roles[i].team;
    p.jailed = false;
  });
}

io.on('connection', (socket) => {
  socket.on('joinGame', (nickname) => {
    if (!nickname) return;
    let lobby = lobbies.find(l => l.players.length < MAX_PLAYERS_PER_LOBBY && l.phase === 'lobby');
    if (!lobby) lobby = createLobby();
    socket.join(`lobby-${lobby.id}`);

    const avatarIndex = Math.floor(Math.random() * 12) + 1;
    const player = {
      id: socket.id,
      nickname,
      avatar: `/avatars/Avatar${avatarIndex}.png`,
      isAlive: true
    };

    lobby.players.push(player);

    if (lobby.players.length === MAX_PLAYERS_PER_LOBBY) {
      assignRoles(lobby);
      lobby.players.forEach(p => {
        io.to(p.id).emit('assignRole', { role: p.role, avatar: p.avatar });
      });
    } else {
      io.to(socket.id).emit('assignRole', { role: player.role || 'Vatandaş', avatar: player.avatar });
    }

    io.to(`lobby-${lobby.id}`).emit('updatePlayers', lobby.players);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});