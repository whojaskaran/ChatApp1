// backend/src/lib/socket.js (final verified version)
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// Map userId -> Set of socketIds
const userSocketMap = {}; // { userId: Set([socketId, ...]) }

function addSocketForUser(userId, socketId) {
  if (!userSocketMap[userId]) userSocketMap[userId] = new Set();
  userSocketMap[userId].add(socketId);
}

function removeSocketForUser(userId, socketId) {
  const s = userSocketMap[userId];
  if (!s) return;
  s.delete(socketId);
  if (s.size === 0) delete userSocketMap[userId];
}

function getReceiverSocketIds(userId) {
  const s = userSocketMap[userId];
  return s ? Array.from(s) : [];
}

//  AUTHENTICATION MIDDLEWARE

io.use((socket, next) => {
  const authData = socket.handshake.auth;
  console.log("[SOCKET-MW] handshake.auth =", authData);

  const token = authData && authData.token;
  if (!token) {
    console.warn("[SOCKET-MW] No token provided in handshake!");
    return next(new Error("Authentication error: token required"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    console.log("[SOCKET-MW] verified userId =", socket.userId);
    next();
  } catch (err) {
    console.error("[SOCKET-MW] token invalid:", err.message);
    next(new Error("Authentication error: " + err.message));
  }
});

// SOCKET CONNECTION HANDLER

io.on("connection", (socket) => {
  console.log(
    "[SOCKET] CONNECT event ->",
    socket.id,
    "auth=",
    socket.handshake.auth
  );
  console.log("[SOCKET] decoded userId=", socket.userId);

  try {
    if (!socket.userId) {
      console.warn("[SOCKET] connection without valid userId");
      return socket.disconnect(true);
    }

    // Bind socket to user

    addSocketForUser(socket.userId, socket.id);
    console.log(`[SOCKET] Added ${socket.id} for user ${socket.userId}`);
    console.log("[SOCKET] Active userSocketMap:", Object.keys(userSocketMap));

    // Broadcast updated online users

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", (reason) => {
      console.log(
        `[SOCKET] disconnected socketId=${socket.id} userId=${socket.userId} reason=${reason}`
      );
      removeSocketForUser(socket.userId, socket.id);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  } catch (err) {
    console.error("[SOCKET] connection handler error:", err);
  }
});

module.exports = {
  io,
  app,
  server,
  getReceiverSocketIds,
  userSocketMap,
};
