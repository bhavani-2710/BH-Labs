const Experiment = require("../models/Experiment");
const VivaQA = require("../models/VivaQA");
const { generateVivaQA } = require("../services/vivaServices");


/**
 * GET /api/vivas/qa
 * Body: { experimentId, part }
 *
 * If a VivaQA document already exists for (experimentId, part), return it.
 * Otherwise fetch the sub-experiment from the Experiment document, call OpenAI
 * to generate 7-9 Q&A pairs, persist them, and return.
 */
// At the top of vivaController.js (outside the controller)
const pendingGenerations = new Map();

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
    const existing = await VivaQA.findOne({
      experimentId,
      part: normalizedPart,
    });

    if (existing) {
      return res.json({
        source: "db",
        qaPairs: existing.qaPairs,
      });
    }

    // Unique key for this experiment + part
    const key = `${experimentId}:${normalizedPart}`;

    // 2. If another request is already generating, wait for it
    if (pendingGenerations.has(key)) {
      await pendingGenerations.get(key);

      const generated = await VivaQA.findOne({
        experimentId,
        part: normalizedPart,
      });

      if (generated) {
        return res.json({
          source: "db",
          qaPairs: generated.qaPairs,
        });
      }
    }

    // 3. Start generation
    const generationPromise = (async () => {
      const experiment = await Experiment.findById(experimentId);

      if (!experiment) {
        throw new Error("Experiment not found");
      }

      const subExp = experiment.subExperiments.find(
        (s) => s.part?.toLowerCase() === normalizedPart,
      );

      if (!subExp) {
        throw new Error(
          `Sub-experiment with part "${normalizedPart}" not found`,
        );
      }

      const qaPairs = await generateVivaQA(subExp);

      try {
        const doc = await VivaQA.create({
          experimentId,
          part: normalizedPart,
          qaPairs,
        });

        return doc;
      } catch (err) {
        // Another request inserted while we were generating
        if (err.code === 11000) {
          return await VivaQA.findOne({
            experimentId,
            part: normalizedPart,
          });
        }

        throw err;
      }
    })();

    pendingGenerations.set(key, generationPromise);

    try {
      const doc = await generationPromise;

      return res.status(201).json({
        source: "ai",
        qaPairs: doc.qaPairs,
      });
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

    return res.status(500).json({
      error: err.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getVivaQA,
};