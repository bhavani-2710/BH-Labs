import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { compiler, code, stdin, language } = await req.json();
    if (!compiler || !code) {
      return NextResponse.json({ error: "compiler and code are required" }, { status: 400 });
    }
    let finalCode = code;
    if (compiler.includes("openjdk") || language === "java") {
      finalCode = code.replace(/\bpublic\s+class\s+(\w+)/g, "class $1");
    }
    if (compiler.includes("sqlite") && stdin) {
      finalCode = code + "\n" + stdin;
    }
    const wandboxBody = { compiler, code: finalCode };
    if (stdin && !compiler.includes("sqlite")) wandboxBody.stdin = stdin;

    const response = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wandboxBody),
    });
    if (!response.ok) {
      return NextResponse.json({ error: "Wandbox failed", status: response.status }, { status: 502 });
    }
    return NextResponse.json(await response.json());
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
