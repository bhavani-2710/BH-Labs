const express = require("express");

const {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

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

module.exports = router;