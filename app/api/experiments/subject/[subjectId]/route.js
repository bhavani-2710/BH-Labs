import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Experiment } from "@/lib/models";

export const dynamic = "force-dynamic";
const POP = { path: "subjectId", populate: { path: "departments.department", select: "name code" } };

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const { subjectId } = await params;
    const experiments = await Experiment.find({ subjectId }).sort({ experimentNumber: 1 }).populate(POP);
    return NextResponse.json(experiments);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
