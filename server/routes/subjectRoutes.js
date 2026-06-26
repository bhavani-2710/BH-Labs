import express from "express";
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

// GET all subjects
router.get("/", getSubjects);

// GET subject by ID
router.get("/:id", getSubjectById);

// CREATE subject
router.post("/", createSubject);

// UPDATE subject
router.put("/:id", updateSubject);

// DELETE subject
router.delete("/:id", deleteSubject);

export default router;