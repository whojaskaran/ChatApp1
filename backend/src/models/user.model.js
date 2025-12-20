// backend/src/models/user.model.js (CommonJS)
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
  },
  { timestamps: true }
);

// Export the model directly
module.exports = mongoose.model("User", userSchema);
