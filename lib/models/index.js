// Import all models so every schema is registered with mongoose before any
// populate() runs (populate needs the referenced model registered).
import Department from "./Departments.js";
import Subject from "./Subject.js";
import Experiment from "./Experiment.js";
import TestQuestion from "./TestQuestion.js";
import VivaQA from "./VivaQA.js";

export { Department, Subject, Experiment, TestQuestion, VivaQA };
