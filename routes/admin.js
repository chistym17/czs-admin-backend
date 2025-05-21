// routes/admin.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASS = process.env.ADMIN_PASS;

router.post("/login", (req, res) => {
  const { email, pass } = req.body;


  if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
 
    return res.status(200).json({ message: "Login successful" });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("admin-auth", { path: "/" });
  return res.status(200).json({ message: "Logged out successfully" });
});

// ✅ Example protected route
router.get("/dashboard", authMiddleware, (req, res) => {
  return res.status(200).json({ message: "Welcome to admin dashboard" });
});

module.exports = router;
