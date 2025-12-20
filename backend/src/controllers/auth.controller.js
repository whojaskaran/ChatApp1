// backend/src/controllers/auth.controller.js (final JWT-based version)
const { generateToken } = require("../lib/utils.js");
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const cloudinary = require("../lib/cloudinary.js");

async function signup(req, res) {
  const { fullName, email, password } = req.body;
  try {
    console.log("DEBUG signup request body:", req.body);

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // ✅ Generate token and send in response
    const token = generateToken(newUser._id);

    res.status(201).json({
      token,
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error("DEBUG signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Generate token and send in response
    const token = generateToken(user._id);

    res.status(200).json({
      token,
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

function logout(req, res) {
  try {
    // No cookie anymore, just respond OK
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function updateProfile(req, res) {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

function checkAuth(req, res) {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
};
