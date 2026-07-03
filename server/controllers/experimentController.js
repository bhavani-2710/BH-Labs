const Experiment = require("../models/Experiment");

/**
 * getExperiments
 * Returns all experiments sorted by experiment number in ascending order.
 *
 * @route  GET /api/experiments
 * @param  {import("express").Request}  req
 * @param  {import("express").Response} res
 */
const getExperiments = async (req, res) => {
  try {
    const experiments = await Experiment.find().sort({ experimentNumber: 1 });
    res.status(200).json(experiments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * getExperimentById
 * Returns a single experiment document by its MongoDB _id.
 *
 * @route  GET /api/experiments/:id
 * @param  {import("express").Request}  req - Expects `req.params.id`.
 * @param  {import("express").Response} res
 */
const getExperimentById = async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id);
    if (!experiment) return res.status(404).json({ message: "Experiment not found" });
    res.status(200).json(experiment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * getExperimentsBySubject
 * Returns all experiments for a given subject, sorted by experiment number.
 *
 * @route  GET /api/experiments/subject/:subjectId
 * @param  {import("express").Request}  req - Expects `req.params.subjectId`.
 * @param  {import("express").Response} res
 */
const getExperimentsBySubject = async (req, res) => {
  try {
    const experiments = await Experiment.find({ subjectId: req.params.subjectId }).sort({
      experimentNumber: 1,
    });
    res.status(200).json(experiments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * createExperiment
 * Creates one or many experiments. Accepts either a single object or an array
 * in the request body. Returns the created document(s) with the subjectId
 * field populated.
 *
 * @route  POST /api/experiments
 * @param  {import("express").Request}  req - Body: single experiment object or array.
 * @param  {import("express").Response} res
 */
const createExperiment = async (req, res) => {
  try {
    let created;

    if (Array.isArray(req.body)) {
      created = await Experiment.insertMany(req.body);
    } else {
      created = await Experiment.create(req.body);
    }

    const ids = Array.isArray(created) ? created.map((e) => e._id) : [created._id];

    const experiments = await Experiment.find({ _id: { $in: ids } }).populate("subjectId");

    res.status(201).json(Array.isArray(created) ? experiments : experiments[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * updateExperiment
 * Updates an existing experiment by its MongoDB _id and returns the updated
 * document with the subjectId field populated.
 *
 * @route  PUT /api/experiments/:id
 * @param  {import("express").Request}  req - Expects `req.params.id` and update fields in body.
 * @param  {import("express").Response} res
 */
const updateExperiment = async (req, res) => {
  try {
    const experiment = await Experiment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("subjectId");

    if (!experiment) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    res.status(200).json(experiment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * deleteExperiment
 * Permanently removes an experiment document by its MongoDB _id.
 *
 * @route  DELETE /api/experiments/:id
 * @param  {import("express").Request}  req - Expects `req.params.id`.
 * @param  {import("express").Response} res
 */
const deleteExperiment = async (req, res) => {
  try {
    const experiment = await Experiment.findByIdAndDelete(req.params.id);

    if (!experiment) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    res.status(200).json({ message: "Experiment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExperiments,
  getExperimentById,
  getExperimentsBySubject,
  createExperiment,
  updateExperiment,
  deleteExperiment,
};
