require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const subjectRoutes = require("./routes/subjectRoutes");
const experimentRoutes = require("./routes/experimentRoutes");
const codeRoutes = require("./routes/codeRoutes");
const vivaRoutes = require("./routes/vivaRoutes");
const compilerRoutes = require("./routes/compilerRoutes");
const aiRoutes = require("./routes/aiRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ message: "BH Labs running!" });
});

app.use("/api/codes", codeRoutes);
app.use("/api/vivas", vivaRoutes);
app.use("/api/run", compilerRoutes);
app.use("/api", aiRoutes);

app.use("/api/subjects", subjectRoutes);
app.use("/api/experiments", experimentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});