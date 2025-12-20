// backend/src/models/message.model.js (CommonJS)
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
