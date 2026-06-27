require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const subjectRoutes = require("./routes/subjectRoutes");
const experimentRoutes = require("./routes/experimentRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ message: "BH Labs running!" });
});

// Wandbox proxy — runs code via remote compiler
app.post("/api/run", async (req, res) => {
  try {
    const { compiler, code } = req.body;
    if (!compiler || !code) {
      return res.status(400).json({ error: "compiler and code are required" });
    }
    const response = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ compiler, code }),
    });
    if (!response.ok) {
      return res.status(502).json({ error: "Wandbox failed", status: response.status });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Wandbox proxy error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// In-memory stores (replace with MongoDB models later if needed)
const codeStore = {};
const vivaStore = {};

// Code storage routes
app.get("/api/codes", (req, res) => {
  const entries = Object.entries(codeStore).map(([key, code]) => ({ key, code }));
  res.json(entries);
});

app.post("/api/codes", (req, res) => {
  const { key, code } = req.body;
  if (!key) return res.status(400).json({ error: "key is required" });
  codeStore[key] = code;
  res.json({ key, code });
});

// Viva score routes
app.get("/api/vivas", (req, res) => {
  const entries = Object.entries(vivaStore).map(([key, score]) => ({ key, score }));
  res.json(entries);
});

app.post("/api/vivas", (req, res) => {
  const { key, score } = req.body;
  if (!key) return res.status(400).json({ error: "key is required" });
  vivaStore[key] = score;
  res.json({ key, score });
});

app.use("/api/subjects", subjectRoutes);
app.use("/api/experiments", experimentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});