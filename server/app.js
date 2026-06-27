import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import experimentRoutes from "./routes/experimentRoutes.js";
import Subject from "./models/Subject.js";
import { seedDB } from "./seed.js";

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

// Connect Database & Start Server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
