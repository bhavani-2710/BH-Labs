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
      if (u.mode === undefined && u.isExecutable !== undefined) {
        u.mode = u.isExecutable ? "executable" : "nonExecutableCode";
      }
      delete u.isExecutable;
      return u;
    });
  }
  return copy;
};

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    const query = subjectId ? { subjectId } : {};
    const experiments = await Experiment.find(query).sort({ experimentNumber: 1 }).populate(POP);
    return NextResponse.json(experiments);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const raw = await req.json();
    const payload = Array.isArray(raw) ? raw.map(normalizeExperimentPayload) : normalizeExperimentPayload(raw);
    let created;
    if (Array.isArray(payload)) created = await Experiment.insertMany(payload);
    else created = await Experiment.create(payload);
    const ids = Array.isArray(created) ? created.map((e) => e._id) : [created._id];
    const experiments = await Experiment.find({ _id: { $in: ids } }).populate(POP);
    return NextResponse.json(Array.isArray(created) ? experiments : experiments[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
