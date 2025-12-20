const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chat-app-alpha-five-69.vercel.app",
    ],
    credentials: true,
  },
});

// Map userId -> Set of socketIds
const userSocketMap = {}; // { userId: Set(socketId) }

function addSocketForUser(userId, socketId) {
  if (!userSocketMap[userId]) {
    userSocketMap[userId] = new Set();
  }
  userSocketMap[userId].add(socketId);
}

function removeSocketForUser(userId, socketId) {
  const set = userSocketMap[userId];
  if (!set) return;
  set.delete(socketId);
  if (set.size === 0) delete userSocketMap[userId];
}

function getReceiverSocketIds(userId) {
  const set = userSocketMap[userId];
  return set ? Array.from(set) : [];
}

/**
 * SOCKET AUTH MIDDLEWARE (OPTION A)
 * --------------------------------
 * No token check.
 * Socket connections are allowed freely.
 * HTTP routes are already cookie-authenticated.
 */
io.use((socket, next) => {
  next();
});

/**
 * SOCKET CONNECTION HANDLER
 */
io.on("connection", (socket) => {
  console.log("[SOCKET] Connected:", socket.id);

  /**
   * OPTIONAL:
   * If later you want user-specific sockets again,
   * emit userId from frontend after login and bind here.
   */

  socket.on("registerUser", (userId) => {
    if (!userId) return;
    addSocketForUser(userId, socket.id);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on("disconnect", (reason) => {
    console.log("[SOCKET] Disconnected:", socket.id, "reason:", reason);

    for (const userId of Object.keys(userSocketMap)) {
      removeSocketForUser(userId, socket.id);
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = {
  io,
  app,
  server,
  getReceiverSocketIds,
  userSocketMap,
};
