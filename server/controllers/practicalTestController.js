const { generateQuestionsForSubject } = require("../services/practicalTestService");

/**
 * inFlightGenerations
 * In-process Map that prevents two simultaneous requests for the same subject
 * from each independently generating a full batch of questions (e.g. double-
 * click, React StrictMode double-invoking an effect, a network retry).
 * Any request that arrives while a generation is already running will await
 * the same in-flight Promise and receive the same result.
 *
 * @type {Map<string, Promise>}
 */
const inFlightGenerations = new Map();

/**
 * getQuestions
 * HTTP handler for GET /api/practical-test/questions/:subjectId
 *
 * Returns a shuffled array of 10 MCQs for the given subject. Deduplicates
 * simultaneous requests via the inFlightGenerations map and delegates all
 * question-generation logic to the practicalTestService.
 *
 * @param {import("express").Request}  req - Expects `req.params.subjectId`.
 * @param {import("express").Response} res - Returns an array of question objects.
 */
const getQuestions = async (req, res) => {
  const { subjectId } = req.params;

  // If another request for this subject is already in progress, reuse its result
  if (inFlightGenerations.has(subjectId)) {
    try {
      const responseQs = await inFlightGenerations.get(subjectId);
      return res.json(responseQs);
    } catch (err) {
      console.error("Get questions error (in-flight reuse):", err);
      return res.status(500).json({ error: "Failed to generate practical test questions" });
    }
  }

  const generationPromise = generateQuestionsForSubject(subjectId);
  inFlightGenerations.set(subjectId, generationPromise);

  try {
    const responseQs = await generationPromise;
    return res.json(responseQs);
  } catch (err) {
    console.error("Get questions error:", err);
    if (err.statusCode === 404) {
      return res.status(404).json({ error: "Subject not found" });
    }
    return res.status(500).json({ error: "Failed to generate practical test questions" });
  } finally {
    inFlightGenerations.delete(subjectId);
  }
};

module.exports = {
  getQuestions,
};