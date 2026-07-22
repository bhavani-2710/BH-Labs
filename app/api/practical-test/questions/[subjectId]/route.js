import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import "@/lib/models";
import { generateQuestionsForSubject } from "@/lib/services/practicalTestService.js";

export const dynamic = "force-dynamic";

// Dedupe simultaneous generations for the same subject within one instance.
const inFlight = new Map();

export async function GET(_req, { params }) {
  const { subjectId } = await params;
  try {
    await connectDB();
    if (inFlight.has(subjectId)) {
      return NextResponse.json(await inFlight.get(subjectId));
    }
    const promise = generateQuestionsForSubject(subjectId);
    inFlight.set(subjectId, promise);
    try {
      const questions = await promise;
      return NextResponse.json(questions);
    } finally {
      inFlight.delete(subjectId);
    }
  } catch (err) {
    inFlight.delete(subjectId);
    if (err.statusCode === 404) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to generate practical test questions" }, { status: 500 });
  }
}
