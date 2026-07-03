const mongoose = require("mongoose");
const TestQuestion = require("../models/TestQuestion");
const Subject = require("../models/Subject");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/tests/:subjectId
// Body: { questions: [{ text, options, correctIndex }] }
// Replaces any previously stored questions for this subject with the new batch.
const saveQuestions = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { questions } = req.body;

    if (!isValidObjectId(subjectId)) {
      return res.status(400).json({ error: "Invalid subjectId" });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ error: "questions must be a non-empty array" });
    }

    for (const q of questions) {
      if (
        typeof q.text !== "string" ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        typeof q.correctIndex !== "number"
      ) {
        return res.status(400).json({
          error:
            "Each question requires text, an options array of 4 items, and a numeric correctIndex",
        });
      }
    }

    const docs = questions.map((q) => ({
      subjectId,
      text: q.text,
      options: q.options,
      correctIndex: q.correctIndex,
    }));

    // Append to the subject's question bank (do not wipe previously stored questions)
    const saved = await TestQuestion.insertMany(docs);

    return res.status(201).json(saved);
  } catch (err) {
    console.error("Save questions error:", err);
    return res.status(500).json({ error: "Failed to save questions" });
  }
};

// GET /api/tests/:subjectId
// Returns 9 random questions from the subject's stored question bank
const RANDOM_SAMPLE_SIZE = 9;

const getSavedQuestions = async (req, res) => {
  try {
    const { subjectId } = req.params;

    if (!isValidObjectId(subjectId)) {
      return res.status(400).json({ error: "Invalid subjectId" });
    }

    const questions = await TestQuestion.aggregate([
      { $match: { subjectId: new mongoose.Types.ObjectId(subjectId) } },
      { $sample: { size: RANDOM_SAMPLE_SIZE } },
    ]);

    return res.json(questions);
  } catch (err) {
    console.error("Get saved questions error:", err);
    return res.status(500).json({ error: "Failed to fetch questions" });
  }
};

// DELETE /api/tests/:subjectId
// Deletes all stored questions for a subject
const deleteQuestionsForSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    if (!isValidObjectId(subjectId)) {
      return res.status(400).json({ error: "Invalid subjectId" });
    }

    const result = await TestQuestion.deleteMany({ subjectId });
    return res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    console.error("Delete questions error:", err);
    return res.status(500).json({ error: "Failed to delete questions" });
  }
};

// DELETE /api/tests/:subjectId/:questionId
// Deletes a single question by id (id must belong to the given subject)
const deleteQuestionById = async (req, res) => {
  try {
    const { subjectId, questionId } = req.params;

    if (!isValidObjectId(subjectId) || !isValidObjectId(questionId)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const deleted = await TestQuestion.findOneAndDelete({
      _id: questionId,
      subjectId,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Question not found" });
    }

    return res.json({ deleted: true, id: questionId });
  } catch (err) {
    console.error("Delete question error:", err);
    return res.status(500).json({ error: "Failed to delete question" });
  }
};

module.exports = {
  saveQuestions,
  getSavedQuestions,
  deleteQuestionsForSubject,
  deleteQuestionById,
};