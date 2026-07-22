import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Experiment, VivaQA } from "@/lib/models";
import { generateVivaQA } from "@/lib/services/vivaServices.js";

export const dynamic = "force-dynamic";

const pending = new Map();

export async function POST(req) {
  try {
    await connectDB();
    const { experimentId, part } = await req.json();
    if (!experimentId || !part) {
      return NextResponse.json({ error: "experimentId and part are required" }, { status: 400 });
    }
    const normalizedPart = part.toLowerCase();

    const existing = await VivaQA.findOne({ experimentId, part: normalizedPart });
    if (existing) return NextResponse.json({ source: "db", qaPairs: existing.qaPairs });

    const key = `${experimentId}:${normalizedPart}`;
    if (pending.has(key)) {
      await pending.get(key);
      const generated = await VivaQA.findOne({ experimentId, part: normalizedPart });
      if (generated) return NextResponse.json({ source: "db", qaPairs: generated.qaPairs });
    }

    const generationPromise = (async () => {
      const experiment = await Experiment.findById(experimentId);
      if (!experiment) throw new Error("Experiment not found");
      const subExp = experiment.subExperiments.find((s) => s.part?.toLowerCase() === normalizedPart);
      if (!subExp) throw new Error(`Sub-experiment with part "${normalizedPart}" not found`);
      const qaPairs = await generateVivaQA(subExp);
      try {
        return await VivaQA.create({ experimentId, part: normalizedPart, qaPairs });
      } catch (err) {
        if (err.code === 11000) return await VivaQA.findOne({ experimentId, part: normalizedPart });
        throw err;
      }
    })();

    pending.set(key, generationPromise);
    try {
      const doc = await generationPromise;
      return NextResponse.json({ source: "ai", qaPairs: doc.qaPairs }, { status: 201 });
    } finally {
      pending.delete(key);
    }
  } catch (err) {
    if (err.message === "Experiment not found" || err.message.includes("Sub-experiment")) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
