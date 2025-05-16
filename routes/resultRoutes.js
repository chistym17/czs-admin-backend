const express = require("express");
const router = express.Router();
const multer = require("multer");

const Result = require("../models/Result");
const cloudinary = require("../config/cloudinary");
const storage = require("../config/storage");

const upload = multer({ storage });
const ADMIN_TOKEN = process.env.ADMIN_SECRET || "admin123";

// Upload result
router.post("/upload-result", upload.single("result"), async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (token !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { matchTitle, matchDate } = req.body;
    const { path: url, filename: public_id } = req.file;

    const result = await Result.create({
      url,
      public_id,
      matchTitle,
      matchDate,
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Upload result error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// List results
router.get("/list-results", async (req, res) => {
  const token = req.headers.authorization;
  if (token !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "List failed" });
  }
});

// Delete result
router.delete("/delete-result/:id", async (req, res) => {
  const token = req.headers.authorization;
  if (token !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ error: "Not found" });

    await cloudinary.uploader.destroy(result.public_id);
    await result.deleteOne();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
