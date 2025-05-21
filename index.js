const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const connectDB = require("./db");

// Routes
const fixtureRoutes = require("./routes/fixtureRoutes");
const resultRoutes = require("./routes/resultRoutes");
const adminRoutes = require("./routes/admin");
const teamRoutes = require("./routes/teamRoutes");

const app = express();

// ✅ Only use CORS with proper options
const corsOptions = {
  origin: "http://localhost:3000", // exact frontend origin
  credentials: true, // allow credentials (cookies, etc)
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Connect DB
connectDB();

// Use routes
app.use("/", fixtureRoutes);
app.use("/", resultRoutes);
app.use("/admin", adminRoutes);
app.use("/api", teamRoutes);

app.listen(5000, () => {
  console.log("Admin backend running on http://localhost:5000");
});
