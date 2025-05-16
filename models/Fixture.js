const mongoose = require("mongoose");

const fixtureSchema = new mongoose.Schema(
  {
    url: String,
    public_id: String,
    matchTitle: String,
    matchDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fixture", fixtureSchema);
