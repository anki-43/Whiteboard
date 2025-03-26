const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// express server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let drawingData = []; // Store live strokes

io.on("connection", (socket) => {
  //   console.log("User connected:", socket.id);
  //   socket.emit("load-drawing", drawingData);
  socket.on("draw", (stroke) => {
    try {
      drawingData.push(stroke);
      io.emit("draw", stroke); // Broadcast to all userss
    } catch (err) {
      console.log("err is", err);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("WebSocket server running on port 5000");
});
