const Subject = require("../models/Subject");
const Department = require("../models/Departments");

/**
 * normalizeSubjectBody
 * Helper to ensure backward compatibility if top-level code or syllabusPdf is passed.
 */
const normalizeSubjectBody = (body) => {
  if (!body) return body;
  const updated = { ...body };

  if (updated.departments && Array.isArray(updated.departments)) {
    updated.departments = updated.departments.map((d) => ({
      ...d,
      code: d.code || updated.code || "",
      syllabusPdf:
        d.syllabusPdf !== undefined ? d.syllabusPdf : updated.syllabusPdf || "",
    }));
  }
  delete updated.code;
  delete updated.syllabusPdf;
  return updated;
};

/**
 * getSubjects
 * Returns all subjects, with departments populated.
 * Supports optional query params: ?department=<id>&semester=<num>&code=<code>
 *
 * @route  GET /api/subjects
 */
const getSubjects = async (req, res) => {
  try {
    const { department, semester, code } = req.query;

    let query = {};
    if (department) {
      query["departments.department"] = department;
    }
    if (semester) {
      query["departments.semester"] = Number(semester);
    }
    if (code) {
      query["departments.code"] = code.toUpperCase();
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
 * Body: { name, departments: [{ department: <id>, semester, code, syllabusPdf? }], description? }
 *
 * @route  POST /api/subjects
 */
const createSubject = async (req, res) => {
  try {
    const normalizedBody = normalizeSubjectBody(req.body);
    const subject = await Subject.create(normalizedBody);
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
    const normalizedBody = normalizeSubjectBody(req.body);
    const subject = await Subject.findByIdAndUpdate(req.params.id, normalizedBody, {
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