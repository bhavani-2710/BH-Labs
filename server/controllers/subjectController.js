const Subject = require("../models/Subject");
const Department = require("../models/Departments");

/**
 * getSubjects
 * Returns all subjects, with departments populated.
 * Supports optional query param: ?department=<departmentId>
 *
 * @route  GET /api/subjects
 * @route  GET /api/subjects?department=<id>
 */
const getSubjects = async (req, res) => {
  try {
    const { department } = req.query;

    let query = {};
    if (department) {
      // Filter subjects that have an entry in the departments array matching this dept id
      query = { "departments.department": department };
    }

    const subjects = await Subject.find(query).populate(
      "departments.department",
      "name code"
    );
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * getSubjectById
 * Returns a single subject by its MongoDB _id, with departments populated.
 *
 * @route  GET /api/subjects/:id
 */
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate(
      "departments.department",
      "name code"
    );

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * createSubject
 * Creates a new subject document from the request body.
 * Body: { name, code, departments: [{ department: <id>, semester }], description?, syllabusPdf? }
 *
 * @route  POST /api/subjects
 */
const createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    const populated = await subject.populate("departments.department", "name code");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * updateSubject
 * Updates an existing subject by its MongoDB _id and returns the updated document.
 *
 * @route  PUT /api/subjects/:id
 */
const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("departments.department", "name code");

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * deleteSubject
 * Permanently removes a subject by its MongoDB _id.
 *
 * @route  DELETE /api/subjects/:id
 */
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};