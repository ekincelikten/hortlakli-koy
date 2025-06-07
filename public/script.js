
const socket = io("https://hortlakli-koy-demo-1.onrender.com");
let nickname = "";

function joinGame() {
  const input = document.getElementById("nickname");
  if (input.value.trim() === "") return;
  nickname = input.value.trim();
  socket.emit("joinGame", nickname);
  document.getElementById("nickname-entry").style.display = "none";
}

function sendMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();
  if (message) {
    socket.emit("chatMessage", message);
    input.value = "";
  }
}

socket.on("chatMessage", msg => {
  const log = document.getElementById("chat-log");
  const div = document.createElement("div");
  div.textContent = msg;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
});

socket.on("phaseChange", phase => {
  document.getElementById("phase").textContent = "Faz: " + phase;
});

socket.on("updatePlayers", players => {
  const container = document.getElementById("players");
  container.innerHTML = "";
  players.forEach(p => {
    const div = document.createElement("div");
    div.className = "player";
    const img = document.createElement("img");
    img.src = p.avatar;
    const name = document.createElement("div");
    name.textContent = p.nickname;
    div.appendChild(img);
    div.appendChild(name);
    container.appendChild(div);
  });
});
