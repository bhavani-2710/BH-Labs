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

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const semester = searchParams.get("semester");
    const code = searchParams.get("code");
    const query = {};
    if (department) query["departments.department"] = department;
    if (semester) query["departments.semester"] = Number(semester);
    if (code) query["departments.code"] = code.toUpperCase();
    const subjects = await Subject.find(query).populate("departments.department", "name code");
    return NextResponse.json(subjects);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = normalizeSubjectBody(await req.json());
    const subject = await Subject.create(body);
    const populated = await subject.populate("departments.department", "name code");
    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
