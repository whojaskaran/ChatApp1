// backend/src/index.js
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

// ===================== MIDDLEWARE =====================
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",

  // Vercel production & previews
  "https://chat-app-alpha-five-69.vercel.app",
  "https://chat-app-git-main-jaskaran-singhs-projects-475268c9.vercel.app",
  "https://chat-o9uxkzm1n-jaskaran-singhs-projects-475268c9.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200,
  })
);

// ===================== ROUTES =====================
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// health check
app.get("/", (req, res) => {
  res.json({ status: "Backend API running" });
});

// ===================== START SERVER =====================
server.listen(PORT, () => {
  console.log("Server running on port:", PORT);
  connectDB();
});
