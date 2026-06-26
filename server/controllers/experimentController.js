const Experiment = require("../models/Experiment");

// GET all experiments
const getExperiments = async (req, res) => {
  try {
    const experiments = await Experiment.find()
      .populate("subjectId")
      .sort({ experimentNumber: 1 });

    res.status(200).json(experiments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET experiment by id
const getExperimentById = async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id).populate(
      "subjectId",
    );

    if (!experiment) {
      return res.status(404).json({
        message: "Experiment not found",
      });
    }

    res.status(200).json(experiment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET experiments by subject
const getExperimentsBySubject = async (req, res) => {
  try {
    const experiments = await Experiment.find({
      subjectId: req.params.subjectId,
    })
      .populate("subjectId")
      .sort({ experimentNumber: 1 });

    res.status(200).json(experiments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE many or single experiments
const createExperiment = async (req, res) => {
  try {
    let created;

    if (Array.isArray(req.body)) {
      created = await Experiment.insertMany(req.body);
    } else {
      created = await Experiment.create(req.body);
    }

    const ids = Array.isArray(created)
      ? created.map((e) => e._id)
      : [created._id];

    const experiments = await Experiment.find({
      _id: { $in: ids },
    }).populate("subjectId");

    res.status(201).json(Array.isArray(created) ? experiments : experiments[0]);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// UPDATE experiment
const updateExperiment = async (req, res) => {
  try {
    const experiment = await Experiment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    ).populate("subjectId");

    if (!experiment) {
      return res.status(404).json({
        message: "Experiment not found",
      });
    }

    res.status(200).json(experiment);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// DELETE experiment
const deleteExperiment = async (req, res) => {
  try {
    const experiment = await Experiment.findByIdAndDelete(req.params.id);

    if (!experiment) {
      return res.status(404).json({
        message: "Experiment not found",
      });
    }

    res.status(200).json({
      message: "Experiment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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
