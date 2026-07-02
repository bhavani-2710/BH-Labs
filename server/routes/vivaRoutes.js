const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();          // <-- this line was missing
const {
  getVivaQA,
} = require("../controllers/vivaController");

// POST /api/vivas/qa
// Body: { experimentId, part }
// Returns cached Q&A from DB, or generates + stores via OpenAI
router.post("/qa", getVivaQA);

module.exports = router;