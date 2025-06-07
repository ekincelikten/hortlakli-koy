const socket = io();
let nickname = '';

document.getElementById('join-btn').onclick = () => {
  nickname = document.getElementById('nickname').value;
  if (nickname) socket.emit('joinGame', nickname);
};

socket.on('assignRole', ({ role, avatar }) => {
  document.getElementById('phase-display').textContent = `Rol: ${role}`;
});

socket.on('updatePlayers', players => {
  const playersDiv = document.getElementById('players');
  playersDiv.innerHTML = '';
  players.forEach(p => {
    const div = document.createElement('div');
    div.className = 'player';
    div.innerHTML = `<img src="${p.avatar}" width="100"><br>${p.nickname}`;
    playersDiv.appendChild(div);
  });
});

document.getElementById('send-btn').onclick = () => {
  const msg = document.getElementById('chat-input').value;
  if (msg) socket.emit('chat', msg);
};

socket.on('chatMessage', msg => {
  const m = document.createElement('div');
  m.textContent = msg;
  document.getElementById('messages').appendChild(m);
});