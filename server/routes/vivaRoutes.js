const express = require("express");
const multer = require("multer");
const path = require("path");
const { 
  getVivas, 
  saveVivaScore, 
  generateVivaQuestions, 
  evaluateVivaAnswer,
  transcribeAudio,
  getVivaQA,
} = require("../controllers/vivaController");

const router = express.Router();

// Multer: store uploaded audio in /tmp with original extension
const upload = multer({
  dest: path.join(__dirname, "../tmp/"),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["audio/webm", "audio/wav", "audio/ogg", "audio/mpeg", "audio/mp4", "audio/x-m4a", "video/webm"];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(webm|wav|ogg|mp3|mp4|m4a)$/i)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported audio format"));
    }
  },
});

router.get("/", getVivas);
router.post("/", saveVivaScore);
router.post("/generate", generateVivaQuestions);
router.post("/evaluate", evaluateVivaAnswer);
router.post("/transcribe", upload.single("audio"), transcribeAudio);

// POST /api/vivas/qa
// Body: { experimentId, part }
// Returns cached Q&A from DB, or generates + stores via OpenAI
router.post("/qa", getVivaQA);

module.exports = router;
