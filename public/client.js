const ws = new WebSocket("ws://localhost:8080");

const chatbox = document.getElementById("chatbox");
const usernameInput = document.getElementById("username");
const roomInput = document.getElementById("room");
const messageInput = document.getElementById("message");

document.getElementById("join").onclick = () => {
  const userName = usernameInput.value;
  const room = roomInput.value;
  ws.send(JSON.stringify({ type: "join", userName: userName, room: room }));
};

document.getElementById("leave").onclick = () => {
  ws.send(JSON.stringify({ type: "leave" }));
  ws.close();
  chatbox.innerHTML = ``;
};

document.getElementById("send").onclick = () => {
  const message = messageInput.value;
  ws.send(JSON.stringify({ type: "message", message: message }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const chatbox = document.getElementById("chatbox");

  if (data.type === "message") {
    chatbox.innerHTML += `${data.userName} : ${data.message}\n`;
  } else if (data.type === "notification") {
    chatbox.innerHTML += `${data.message}\n`;
  }

  chatbox.scrollTop = chatbox.scrollHeight;
};