const Experiment = require("../models/Experiment");
const VivaQA = require("../models/VivaQA");
const { generateVivaQA } = require("../services/vivaServices");

/**
 * pendingGenerations
 * In-process Map that prevents duplicate simultaneous AI generation requests
 * for the same (experimentId, part) pair. If a second request arrives while
 * one is already generating, it awaits the same Promise and then reads the
 * newly-inserted document from the DB rather than triggering a second API call.
 *
 * @type {Map<string, Promise>}
 */
const pendingGenerations = new Map();

/**
 * getVivaQA
 * HTTP handler for POST /api/vivas/qa
 *
 * Returns viva Q&A pairs for a specific sub-experiment (identified by
 * experimentId + part). Uses a three-tier strategy:
 *  1. Fast path   – return cached Q&A from the DB if it already exists.
 *  2. Wait path   – if another request is already generating, await it and
 *                   then return the document that was saved.
 *  3. Generate    – call the AI service, persist the result, then return it.
 *
 * @route  POST /api/vivas/qa
 * @param  {import("express").Request}  req
 *   Body: { experimentId: string, part: string }
 *   - experimentId: MongoDB _id of the parent experiment.
 *   - part:         Sub-experiment part identifier (e.g. "a", "b"). Case-insensitive.
 * @param  {import("express").Response} res
 *   Returns { source: "db"|"ai", qaPairs: Array<{ question, answer }> }
 */
const getVivaQA = async (req, res) => {
  try {
    const { experimentId, part } = req.body;

    if (!experimentId || !part) {
      return res.status(400).json({
        error: "experimentId and part are required",
      });
    }

    const normalizedPart = part.toLowerCase();

    // 1. Fast path: return cached Q&A if it already exists
    const existing = await VivaQA.findOne({ experimentId, part: normalizedPart });

    if (existing) {
      return res.json({ source: "db", qaPairs: existing.qaPairs });
    }

    // Unique key for deduplication: experimentId + part
    const key = `${experimentId}:${normalizedPart}`;

    // 2. Wait path: another request is already generating for this key
    if (pendingGenerations.has(key)) {
      await pendingGenerations.get(key);

      const generated = await VivaQA.findOne({ experimentId, part: normalizedPart });

      if (generated) {
        return res.json({ source: "db", qaPairs: generated.qaPairs });
      }
    }

    // 3. Generate: start a new AI generation, store the promise, persist the result
    const generationPromise = (async () => {
      const experiment = await Experiment.findById(experimentId);

      if (!experiment) {
        throw new Error("Experiment not found");
      }

      // Locate the matching sub-experiment within the parent experiment
      const subExp = experiment.subExperiments.find(
        (s) => s.part?.toLowerCase() === normalizedPart,
      );

      if (!subExp) {
        throw new Error(`Sub-experiment with part "${normalizedPart}" not found`);
      }

      const qaPairs = await generateVivaQA(subExp);

      try {
        const doc = await VivaQA.create({ experimentId, part: normalizedPart, qaPairs });
        return doc;
      } catch (err) {
        // Handle race condition where another request inserted while generating
        if (err.code === 11000) {
          return await VivaQA.findOne({ experimentId, part: normalizedPart });
        }
        throw err;
      }
    })();

    pendingGenerations.set(key, generationPromise);

    try {
      const doc = await generationPromise;
      return res.status(201).json({ source: "ai", qaPairs: doc.qaPairs });
    } finally {
      pendingGenerations.delete(key);
    }
  } catch (err) {
    console.error("getVivaQA error:", err);

    if (err.message === "Experiment not found") {
      return res.status(404).json({ error: err.message });
    }

    if (err.message.includes("Sub-experiment")) {
      return res.status(404).json({ error: err.message });
    }

    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

module.exports = {
  getVivaQA,
};