import express from "express";
import {
  getExperiments,
  getExperimentById,
  getExperimentsBySubject,
  createExperiment,
  updateExperiment,
  deleteExperiment,
} from "../controllers/experimentController.js";

const router = express.Router();

// GET all experiments
router.get("/", getExperiments);

// GET experiments of a subject
router.get("/subject/:subjectId", getExperimentsBySubject);

// GET experiment by id
router.get("/:id", getExperimentById);

// CREATE experiment
router.post("/", createExperiment);

// UPDATE experiment
router.put("/:id", updateExperiment);

// DELETE experiment
router.delete("/:id", deleteExperiment);

export default router;