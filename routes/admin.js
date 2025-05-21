// routes/admin.js
const express = require("express");
const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASS = process.env.ADMIN_PASS;

router.post("/login", (req, res) => {
  const { email, pass } = req.body;


  if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
 
    return res.status(200).json({ success: true, message: "Login successful" });
  }

  return res.status(401).json({ success: false, message: "Invalid credentials" });
});

// ✅ Example protected route
router.get("/dashboard", (req, res) => {
  return res.status(200).json({ success: true, message: "Welcome to admin dashboard" });
});

module.exports = router;
