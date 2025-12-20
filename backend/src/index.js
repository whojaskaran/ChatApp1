// backend/src/index.js (CommonJS)
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { connectDB } = require("./lib/db.js");
const authRoutes = require("./routes/auth.route.js");
const messageRoutes = require("./routes/message.route.js");
const { app, server } = require("./lib/socket.js");

const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "https://chat-app-alpha-five-69.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// health check
app.get("/", (req, res) => {
  res.json({ status: "Backend API running" });
});

// start server
server.listen(PORT, () => {
  console.log("Server running on port:", PORT);
  connectDB();
});
