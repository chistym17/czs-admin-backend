const express = require("express");
const router = express.Router();
const multer = require("multer");

const Fixture = require("../models/Fixture");
const cloudinary = require("../config/cloudinary");
const storage = require("../config/storage");

const upload = multer({ storage });
const ADMIN_TOKEN = process.env.ADMIN_SECRET || "admin123";

// Upload fixture
router.post("/upload-fixture", upload.single("fixture"), async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (token !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { matchTitle, matchDate } = req.body;
    const { path: url, filename: public_id } = req.file;

    const fixture = await Fixture.create({
      url,
      public_id,
      matchTitle,
      matchDate,
    });

    res.status(200).json(fixture);
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// List fixtures
router.get("/list-fixtures", async (req, res) => {
  const token = req.headers.authorization;
  if (token !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const fixtures = await Fixture.find().sort({ createdAt: -1 });
    res.json(fixtures);
  } catch (err) {
    res.status(500).json({ error: "List failed" });
  }
});

// Delete fixture
router.delete("/delete-fixture/:id", async (req, res) => {
  const token = req.headers.authorization;
  if (token !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const fixture = await Fixture.findById(req.params.id);
    if (!fixture) return res.status(404).json({ error: "Not found" });

    await cloudinary.uploader.destroy(fixture.public_id);
    await fixture.deleteOne();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
