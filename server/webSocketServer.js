const webSocket = require("ws");
const roomManager = require("./roomManager");

class webSocketServer {
  constructor(server) {
    this.wss = new webSocket.Server({ server });
    this.roomManager = new roomManager();
    this.listener();
  }

  listener() {
    this.wss.on("connection", (ws) => {
      console.log("A new WebSocket connection has been established.");
      let currentRoom = null;
      let userName = null;

      ws.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        switch (parsedMessage.type) {
          case "join":
            userName = parsedMessage.userName;
            currentRoom = parsedMessage.room;
            this.roomManager.addUserToRoom(userName, currentRoom, ws);
            this.roomManager.broadcast(currentRoom, {
              type: "notification",
              message: `${userName} joined ${currentRoom}`,
            });
            break;

          case "message":
            if (currentRoom) {
              this.roomManager.broadcast(currentRoom, {
                type: "message",
                userName: userName,
                message: parsedMessage.message,
              });
            }
            break;

          case "leave":
            if (currentRoom) {
              this.roomManager.removeUserFromRoom(userName, currentRoom, ws);
              this.roomManager.broadcast(currentRoom, {
                type: "notification",
                message: `${userName} left ${currentRoom}`,
              });
            }
            break;

          default:
            console.log("Unknown message type:", parsedMessage.type);
        }
      });

      ws.on("close", () => {
        if (currentRoom) {
          this.roomManager.removeUserFromRoom(userName, currentRoom, ws);
          this.roomManager.broadcast(currentRoom, {
            type: "notification",
            message: `${userName} disconnected from ${currentRoom}`,
          });
        }
      });
    });
  }
}

module.exports = webSocketServer;
