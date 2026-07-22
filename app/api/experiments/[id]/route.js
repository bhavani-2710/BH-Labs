import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Experiment } from "@/lib/models";

export const dynamic = "force-dynamic";
const POP = { path: "subjectId", populate: { path: "departments.department", select: "name code" } };

const normalizeExperimentPayload = (data) => {
  if (!data || typeof data !== "object") return data;
  const copy = { ...data };
  if (Array.isArray(copy.subExperiments)) {
    copy.subExperiments = copy.subExperiments.map((sub) => {
      const u = { ...sub };
      if (u.mode === undefined && u.isExecutable !== undefined) u.mode = u.isExecutable ? "executable" : "nonExecutableCode";
      delete u.isExecutable;
      return u;
    });
  }
  return copy;
};

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const experiment = await Experiment.findById(id).populate(POP);
    if (!experiment) return NextResponse.json({ message: "Experiment not found" }, { status: 404 });
    return NextResponse.json(experiment);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const payload = normalizeExperimentPayload(await req.json());
    const experiment = await Experiment.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate(POP);
    if (!experiment) return NextResponse.json({ message: "Experiment not found" }, { status: 404 });
    return NextResponse.json(experiment);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const experiment = await Experiment.findByIdAndDelete(id);
    if (!experiment) return NextResponse.json({ message: "Experiment not found" }, { status: 404 });
    return NextResponse.json({ message: "Experiment deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
