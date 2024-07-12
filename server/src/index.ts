import ws from "ws";
import http from "http";
import Express from "express";

const App = Express();

const wss = new ws.Server({ noServer: true });

let clients = [];
let sessions = [];

wss.on("connection", (ws) => {
  clients.push(ws);
  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
    console.log("🚀 ~ connected clients:", clients.length);
    ws.send(`Echo: ${message}`);
  });
});

App.get("/", (req, res) => {
  res.send("Hello World");
});

const server = App.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (socket) => {
    wss.emit("connection", socket, request);
  });
});
