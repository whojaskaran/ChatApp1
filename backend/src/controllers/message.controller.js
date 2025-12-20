// backend/src/controllers/message.controller.js (CommonJS)

const User = require("../models/user.model.js");
const Message = require("../models/message.model.js");

const cloudinary = require("../lib/cloudinary.js");
// use plural API from the socket module
const { getReceiverSocketIds, io } = require("../lib/socket.js");

async function getUsersForSidebar(req, res) {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getMessages(req, res) {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function sendMessage(req, res) {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Get all socket IDs for the receiver (may be multiple tabs/devices)
    const receiverSocketIds = getReceiverSocketIds(receiverId) || [];

    console.log(
      `[SEND] sender=${senderId} receiver=${receiverId} resolvedSocketIds=`,
      receiverSocketIds
    );

    if (receiverSocketIds.length) {
      receiverSocketIds.forEach((sid) => {
        io.to(sid).emit("newMessage", newMessage);
      });
    } else {
      // recipient offline — you already persisted message; optionally mark undelivered
      console.log(`[SEND] recipient ${receiverId} offline — message persisted`);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getUsersForSidebar,
  getMessages,
  sendMessage,
};
