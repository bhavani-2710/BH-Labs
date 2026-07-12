const mongoose = require("mongoose");

const sampleSchema = new mongoose.Schema(
  {
    input: { type: String, default: "" },
    output: { type: String, default: "" },
  },
  {
    _id: false,
  },
);

const fileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    content: { type: String, required: true },
    language: { type: String, default: "" },
  },
  {
    _id: false,
  },
);

const stepSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true },
    instruction: { type: String, required: true },
    command: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    imageCaption: { type: String, default: "" },
  },
  {
    _id: false,
  },
);

const subExperimentSchema = new mongoose.Schema(
  {
    part: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    problemStatement: {
      type: String,
      required: true,
    },
    theory: {
      type: String,
      default: "",
    },
    algorithm: {
      type: String,
      default: "",
    },
    flowchart: {
      nodes: [
        {
          id: { type: String, required: true },
          type: { type: String },
          label: { type: String, required: true },
        },
      ],
      edges: [
        {
          source: { type: String, required: true },
          target: { type: String, required: true },
        },
      ],
    },

    files: {
      type: [fileSchema],
      default: undefined,
    },
    referenceSolution: {
      type: Map,
      of: String,
      default: undefined,
    },
    samples: {
      type: [sampleSchema],
      default: [],
    },
    steps: {
      type: [stepSchema],
      default: [],
    },
    hints: {
      type: [String],
      default: [],
    },
    concepts: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    mode: {
      type: String,
      enum: ["executable", "nonExecutableCode", "guidedSteps"],
      default: "executable",
    },
  },
  {
    _id: false,
  },
);

const experimentSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    experimentNumber: {
      type: Number,
      required: true,
    },

    problemStatement: {
      type: String,
      required: true,
    },

    subExperiments: {
      type: [subExperimentSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate experiment number for same subject
experimentSchema.index({ subjectId: 1, experimentNumber: 1 }, { unique: true });

module.exports = mongoose.model("Experiment", experimentSchema);