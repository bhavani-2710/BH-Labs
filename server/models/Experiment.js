import mongoose from "mongoose";

const sampleSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const subExperimentSchema = new mongoose.Schema(
  {
    part: {
      type: String,
      required: true,
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
  }
);

const vivaQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
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
      required: true,
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

    samples: {
      type: [sampleSchema],
      default: [],
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    concepts: {
      type: [String],
      default: [],
    },

    hints: {
      type: [String],
      default: [],
    },

    starterCode: {
      type: String,
      default: "",
    },

    sampleInput: {
      type: String,
      default: "",
    },

    sampleOutput: {
      type: String,
      default: "",
    },

    vivaQuestions: {
      type: [vivaQuestionSchema],
      default: [],
    },

    subExperiments: {
      type: [subExperimentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate experiment number for same subject
experimentSchema.index(
  { subjectId: 1, experimentNumber: 1 },
  { unique: true }
);

const Experiment = mongoose.model("Experiment", experimentSchema);
export default Experiment;