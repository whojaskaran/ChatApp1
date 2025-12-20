const express = require("express");

// require the whole module so we can inspect properties reliably
const authController = require("../controllers/auth.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

const router = express.Router();

// use the properties explicitly so errors are clearer
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.put(
  "/update-profile",
  authMiddleware.protectRoute,
  authController.updateProfile
);
router.get("/check", authMiddleware.protectRoute, authController.checkAuth);

module.exports = router;
