const express = require("express");
const router = express.Router();
const aptitudeController = require("../controllers/aptitudeController");

router.get("/questions/:subjectId", aptitudeController.getQuestions);

module.exports = router;
