const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");

router.post("/generate", imageController.generateOutputImage);

module.exports = router;
