import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Department || mongoose.model("Department", departmentSchema);