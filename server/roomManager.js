const webSocket = require("ws");

class roomManager {
  constructor() {
    this.rooms = {};
  }

  addUserToRoom(userName, roomName, ws) {
    if (!this.rooms[roomName]) {
      this.rooms[roomName] = { users: new Set(), userNames: new Set() };
    }
    this.rooms[roomName].users.add(ws);
    this.rooms[roomName].userNames.add(userName);
  }

  removeUserFromRoom(userName, roomName, ws) {
    if (this.rooms[roomName]) {
      this.rooms[roomName].users.delete(ws);
      this.rooms[roomName].userNames.delete(userName);
      if (this.rooms[roomName].users.size === 0) {
        delete this.rooms[roomName];
      }
    }
  }

  broadcast(roomName, message) {
    if (this.rooms[roomName]) {
      this.rooms[roomName].users.forEach((ws) => {
        if (ws.readyState === webSocket.OPEN) {
          ws.send(JSON.stringify(message));
        }
      });
    }
  }
}

module.exports = roomManager;
