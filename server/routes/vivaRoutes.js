const express = require("express");
const router = express.Router();
const { getVivaQA } = require("../controllers/vivaController");

// POST /api/vivas/qa
// Body: { experimentId, part }
// Returns cached Q&A from DB, or generates + stores via OpenAI
router.post("/qa", getVivaQA);

module.exports = router;