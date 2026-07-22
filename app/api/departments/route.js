import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Department } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const departments = await Department.find().sort({ name: 1 });
    return NextResponse.json(departments);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const department = await Department.create(await req.json());
    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
