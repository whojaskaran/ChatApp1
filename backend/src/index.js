// backend/src/index.js (CommonJS)
const path = require("path");
const dotenv = require("dotenv");

// load .env from project root (adjust if your .env is somewhere else)
dotenv.config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { connectDB } = require("./lib/db.js"); // ensure db.js exports connectDB via module.exports
const authRoutes = require("./routes/auth.route.js");
const messageRoutes = require("./routes/message.route.js");
const { app, server } = require("./lib/socket.js"); // ensure socket.js uses module.exports

// debug logs
console.log("__dirname =", __dirname);
console.log("process.cwd() =", process.cwd());
console.log("NODE_ENV =", process.env.NODE_ENV);
console.log("PORT env var =", process.env.PORT);
console.log("MONGODB_URI present =", !!process.env.MONGODB_URI);

// safe default port
const PORT = process.env.PORT || 5000;

// sanity check
if (!process.env.MONGODB_URI) {
  console.error(
    "FATAL: MONGODB_URI is not defined. Check your .env and dotenv path."
  );
  // process.exit(1); // uncomment to fail fast if you prefer
}

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// serve frontend in production
const rootFrontDist = path.join(__dirname, "../frontend/dist");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(rootFrontDist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(rootFrontDist, "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:", PORT);
  connectDB();
});
