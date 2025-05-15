// Delete fixture by public_id
app.delete("/delete-fixture/:id", async (req, res) => {
  const token = req.headers.authorization;
  if (token !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const publicId = req.params.id;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok") {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Delete failed" });
    }
  } catch (err) {
    res.status(500).json({ error: "Cloudinary error" });
  }
});
