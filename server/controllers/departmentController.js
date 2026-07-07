const Department = require("../models/Departments");

/**
 * getDepartments
 * Returns all department documents, sorted alphabetically by name.
 *
 * @route  GET /api/departments
 */
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * getDepartmentById
 * Returns a single department by its MongoDB _id.
 *
 * @route  GET /api/departments/:id
 */
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * createDepartment
 * Creates a new department document.
 * Body: { name, code }
 *
 * @route  POST /api/departments
 */
const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * updateDepartment
 * Updates an existing department by its MongoDB _id.
 *
 * @route  PUT /api/departments/:id
 */
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * deleteDepartment
 * Removes a department by its MongoDB _id.
 *
 * @route  DELETE /api/departments/:id
 */
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
