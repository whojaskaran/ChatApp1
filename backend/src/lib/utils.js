// backend/src/lib/utils.js
const jwt = require("jsonwebtoken");

// ✅ return token instead of setting cookie
function generateToken(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
}

module.exports = { generateToken };
