// backend/src/lib/utils.js
const jwt = require("jsonwebtoken");

function generateToken(res, userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // required on Render (HTTPS)
    sameSite: "none", // required for Vercel ↔ Render
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

module.exports = { generateToken };
