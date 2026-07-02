const mongoose = require("mongoose");

const vivaQASchema = new mongoose.Schema(
  {
    experimentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experiment",
      required: true,
    },
    part: {
      type: String,
      required: true, // matches subExperiment.part (e.g. "a", "b")
    },
    qaPairs: [
      {
        question: { type: String, required: true },
        answer:   { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Unique index: one set of Q&A per (experiment, part) pair
vivaQASchema.index({ experimentId: 1, part: 1 }, { unique: true });

module.exports = mongoose.model("VivaQA", vivaQASchema);