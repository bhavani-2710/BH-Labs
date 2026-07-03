const express = require("express");
const router = express.Router();
const { getQuestions } = require("../controllers/practicalTestController");

router.get("/questions/:subjectId", getQuestions);

module.exports = router;
