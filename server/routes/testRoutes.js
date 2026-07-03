const express = require("express");
const router = express.Router();
const {
  saveQuestions,
  getSavedQuestions,
  deleteQuestionsForSubject,
  deleteQuestionById,
} = require("../controllers/TestController");

// Store (replace) the generated question batch for a subject
router.post("/:subjectId", saveQuestions);

// Fetch previously stored questions for a subject
router.get("/:subjectId", getSavedQuestions);

// Delete all stored questions for a subject
router.delete("/:subjectId", deleteQuestionsForSubject);

// Delete a single stored question
router.delete("/:subjectId/:questionId", deleteQuestionById);

module.exports = router;