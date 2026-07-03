require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Route modules
const subjectRoutes = require("./routes/subjectRoutes");
const experimentRoutes = require("./routes/experimentRoutes");
const compilerRoutes = require("./routes/compilerRoutes");
const chatRoutes = require("./routes/chatRoutes");
const practicalTestRoutes = require("./routes/practicalTestRoutes");
const vivaRoutes = require("./routes/vivaRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// ── Core middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Enable request logging in development only
if (process.env.NODE_ENV !== "production") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ message: "BH Labs running!" });
});

// ── Data routes ───────────────────────────────────────────────────────────────
app.use("/api/subjects", subjectRoutes);
app.use("/api/experiments", experimentRoutes);

// ── Feature routes ────────────────────────────────────────────────────────────
app.use("/api/run", compilerRoutes);        // Wandbox code execution proxy
app.use("/api", chatRoutes);               // AI explain + chat assistant (streaming)
app.use("/api/practical-test", practicalTestRoutes);  // Practical test question generation
app.use("/api/vivas", vivaRoutes);         // Viva Q&A generation + caching

// ── Server startup ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});