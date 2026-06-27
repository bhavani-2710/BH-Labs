import mongoose from "mongoose";

const sampleSchema = new mongoose.Schema(
  {
    input: { type: String, default: "" },
    output: { type: String, default: "" },
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
    starterCode: {
      supportedLanguages: {
        type: [String],
        default: [],
      },
      templates: {
        type: Map,
        of: String,
        default: {},
      },
    },
    samples: {
      type: [sampleSchema],
      default: [],
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
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

    title: {
      type: String,
      trim: true,
    },

    problemStatement: String,

    theory: String,

    algorithm: String,

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
    },

    subExperiments: {
      type: [subExperimentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate experiment number for same subject
experimentSchema.index({ subjectId: 1, experimentNumber: 1 }, { unique: true });

const Experiment = mongoose.model("Experiment", experimentSchema);
export default Experiment;