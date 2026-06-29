const express = require("express");
const { explainCode, chatWithAssistant } = require("../controllers/aiController");

const router = express.Router();

router.post("/explain", explainCode);
router.post("/chat", chatWithAssistant);

module.exports = router;
