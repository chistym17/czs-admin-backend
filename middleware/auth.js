// middleware/auth.js
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "admin123";

function authMiddleware(req, res, next) {
  const token = req.cookies["admin-auth"];

  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  next();
}

module.exports = authMiddleware;
