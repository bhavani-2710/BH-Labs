require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Rputes
const subjectRoutes = require("./routes/subjectRoutes");
const experimentRoutes = require("./routes/experimentRoutes");

// Connect Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ message: "BH Labs running!" });
});

// Routes
app.use("/api/subjects", subjectRoutes);
app.use("/api/experiments", experimentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
