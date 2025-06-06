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

const corsOptions = {
  origin: '*',  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

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
