// backend/src/controllers/auth.controller.js
const { generateToken } = require("../lib/utils.js");
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const cloudinary = require("../lib/cloudinary.js");

// ======================= SIGNUP =======================
async function signup(req, res) {
  try {
    const { fullName, email, password } = req.body;

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // ✅ SET COOKIE HERE
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ======================= LOGIN =======================
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ SET COOKIE HERE
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ======================= LOGOUT =======================
function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({ message: "Logged out successfully" });
}

// ======================= UPDATE PROFILE =======================
async function updateProfile(req, res) {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("updateProfile error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ======================= CHECK AUTH =======================
function checkAuth(req, res) {
  res.status(200).json(req.user);
}

module.exports = {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
};
