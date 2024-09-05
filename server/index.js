const express = require("express");
const http = require("http");
const path = require("path");
const webSocketServer = require("./webSocketServer");

const PORT = 8080;
const app = express();
app.use(express.static(path.join(__dirname, "../public")));

const server = http.createServer(app);

const webSocketServerInstance = new webSocketServer(server);

server.listen(PORT, () => {
  console.log(`HTTP server is running on http://localhost:${PORT}`);
});
