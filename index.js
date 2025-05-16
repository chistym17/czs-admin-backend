const express = require("express");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();

const storage = require("./config/storage");
const cloudinary = require("./config/cloudinary");
const connectDB = require("./db");
const Fixture = require("./models/Fixture");

const upload = multer({ storage });
const app = express();
const ADMIN_TOKEN = process.env.ADMIN_SECRET || "admin123";

app.use(cors());
app.use(express.json());

// connect DB
connectDB();

// ✅ Upload fixture + metadata
app.post("/upload-fixture", upload.single("fixture"), async (req, res) => {
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

// ✅ List fixtures from DB
app.get("/list-fixtures", async (req, res) => {
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

// ✅ Delete fixture from Cloudinary + DB
app.delete("/delete-fixture/:id", async (req, res) => {
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

app.listen(5001, () => {
  console.log("Admin backend running on http://localhost:5001");
});
