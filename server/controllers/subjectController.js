const Subject = require("../models/Subject");

/**
 * getSubjects
 * Returns all subject documents from the database.
 *
 * @route  GET /api/subjects
 * @param  {import("express").Request}  req
 * @param  {import("express").Response} res
 */
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * getSubjectById
 * Returns a single subject document by its MongoDB _id.
 *
 * @route  GET /api/subjects/:id
 * @param  {import("express").Request}  req - Expects `req.params.id`.
 * @param  {import("express").Response} res
 */
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

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
 *
 * @route  POST /api/subjects
 * @param  {import("express").Request}  req - Body: { name, code, semester, description? }.
 * @param  {import("express").Response} res
 */
const createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * updateSubject
 * Updates an existing subject document by its MongoDB _id and returns the
 * updated document.
 *
 * @route  PUT /api/subjects/:id
 * @param  {import("express").Request}  req - Expects `req.params.id` and update fields in body.
 * @param  {import("express").Response} res
 */
const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
 * Permanently removes a subject document by its MongoDB _id.
 *
 * @route  DELETE /api/subjects/:id
 * @param  {import("express").Request}  req - Expects `req.params.id`.
 * @param  {import("express").Response} res
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