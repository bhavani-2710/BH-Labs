import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Department } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const department = await Department.findById(id);
    if (!department) return NextResponse.json({ message: "Department not found" }, { status: 404 });
    return NextResponse.json(department);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const department = await Department.findByIdAndUpdate(id, await req.json(), { new: true, runValidators: true });
    if (!department) return NextResponse.json({ message: "Department not found" }, { status: 404 });
    return NextResponse.json(department);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const department = await Department.findByIdAndDelete(id);
    if (!department) return NextResponse.json({ message: "Department not found" }, { status: 404 });
    return NextResponse.json({ message: "Department deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
