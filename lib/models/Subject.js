import mongoose from "mongoose";

const departmentSemesterSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    syllabusPdf: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    departments: {
      type: [departmentSemesterSchema],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one department (with semester) is required.",
      },
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);


subjectSchema.index(
  { "departments.department": 1, "departments.semester": 1, "departments.code": 1 },
  { unique: true }
);

export default mongoose.models.Subject || mongoose.model("Subject", subjectSchema);