import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Subject } from "@/lib/models";

export const dynamic = "force-dynamic";

const normalizeSubjectBody = (body) => {
  if (!body) return body;
  const updated = { ...body };
  if (Array.isArray(updated.departments)) {
    updated.departments = updated.departments.map((d) => ({
      ...d,
      code: d.code || updated.code || "",
      syllabusPdf: d.syllabusPdf !== undefined ? d.syllabusPdf : updated.syllabusPdf || "",
    }));
  }
  delete updated.code;
  delete updated.syllabusPdf;
  return updated;
};

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const subject = await Subject.findById(id).populate("departments.department", "name code");
    if (!subject) return NextResponse.json({ message: "Subject not found" }, { status: 404 });
    return NextResponse.json(subject);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = normalizeSubjectBody(await req.json());
    const subject = await Subject.findByIdAndUpdate(id, body, {
      new: true, runValidators: true,
    }).populate("departments.department", "name code");
    if (!subject) return NextResponse.json({ message: "Subject not found" }, { status: 404 });
    return NextResponse.json(subject);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) return NextResponse.json({ message: "Subject not found" }, { status: 404 });
    return NextResponse.json({ message: "Subject deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
