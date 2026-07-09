/**
 * cWorker.js
 * Web Worker that compiles and runs C/C++ code in the browser using
 * @wasmer/sdk + the clang/clang Wasmer registry package.
 *
 * Message protocol (in):
 *   { type: "run", code: string, language: "c"|"cpp", stdin: string }
 *
 * Message protocol (out):
 *   { type: "status",   content: string }           — progress text
 *   { type: "stdout",   content: string }           — program stdout
 *   { type: "stderr",   content: string }           — compiler / runtime stderr
 *   { type: "finished", status: string, elapsed_ms: number }
 */

import { init, Wasmer, Directory } from "@wasmer/sdk";

// ── Module-level singletons (survive between "run" messages) ─────────────────
let sdkReady = false;
let clang = null;

const initPromise = (async () => {
  try {
    // Explicitly point to the WASM binary and worker script that were copied
    // to public/ — Vite serves these at the root, so we use location.origin.
    // Without this, init() resolves "wasmer_js_bg.wasm" relative to the
    // bundled worker chunk URL, which doesn't exist and returns an HTML 404
    // page — causing the "expected magic word 00 61 73 6d, found 3c 21 64 6f" error.
    const base = self.location.origin;
    await init({
      module: new URL("/wasmer_js_bg.wasm", base),
      workerUrl: new URL("/wasmer_worker.mjs", base).toString(),
      sdkUrl: new URL("/wasmer_sdk.mjs", base).toString(),
    });
    clang = await Wasmer.fromRegistry("clang/clang");
    sdkReady = true;
    self.postMessage({ type: "ready" });
  } catch (err) {
    self.postMessage({
      type: "stderr",
      content: `Failed to initialize Clang: ${err.message}\n`,
    });
    self.postMessage({ type: "finished", status: "1", elapsed_ms: 0 });
  }
})();

// ── Error guards ─────────────────────────────────────────────────────────────
self.addEventListener("error", (event) => {
  self.postMessage({
    type: "stderr",
    content: (event.message || "Unknown worker error") + "\n",
  });
  self.postMessage({ type: "finished", status: "1", elapsed_ms: 0 });
});

self.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  const msg = reason?.stack || reason?.message || String(reason);
  self.postMessage({
    type: "stderr",
    content: `Unhandled rejection: ${msg}\n`,
  });
  self.postMessage({ type: "finished", status: "1", elapsed_ms: 0 });
});

// ── Message handler ──────────────────────────────────────────────────────────
self.onmessage = async function (e) {
  if (e.data.type !== "run") return;

  const { code, language, stdin } = e.data;
  console.log({ code, language, stdin });

  // Wait for the SDK + clang to be ready (may already be resolved)
  await initPromise;

  if (!sdkReady) return; // init failed — error already posted

  const isCpp = language === "cpp";
  const srcFile = isCpp ? "main.cpp" : "main.c";

  try {
    // ── 1. Compile ───────────────────────────────────────────────────────────
    self.postMessage({ type: "status", content: "$ Compiling...\n" });

    const dir = new Directory();
    await dir.writeFile(srcFile, code);

    // ── Compiler flags ────────────────────────────────────────────────────────
    // The clang/clang Wasmer package ships a bundled WASI sysroot at /sys:
    //   /sys/include/               — C standard headers (stdio.h …)
    //   /sys/include/c++/v1/        — libc++ headers (iostream, vector …)
    //   /sys/include/wasm32-wasi/c++/v1/ — target-specific ABI shims
    //   /sys/lib/wasm32-wasi/       — libc.a, libc++.a, libc++abi.a
    //
    // --sysroot=/sys      tells clang where to find C/C++ headers & libraries.
    // Without it, <stdio.h> (C) and <iostream> (C++) are not found.
    // For C++ we also need -stdlib=libc++ and explicit -lc++ -lc++abi.
    let compileArgs;

    if (isCpp) {
      compileArgs = [
        `/src/${srcFile}`,
        `-I/sysroot/include/c++/v1`,
        `-lc++`,
        `-lc++abi`,
        `-o`,
        `/src/out.wasm`,
      ];
    } else {
      // C works out-of-the-box with default system headers
      compileArgs = [`/src/${srcFile}`, `-o`, `/src/out.wasm`];
    }

    const compileInstance = await clang.entrypoint.run({
      args: compileArgs,
      mount: { "/src": dir },
    });

    console.log("compiling start...")
    const compileResult = await compileInstance.wait();
    console.log("compile result -> ", compileResult);

    if (!compileResult.ok) {
      // Compilation failed — surface the compiler error
      const compilerErr =
        compileResult.stderr ||
        `Compilation failed with exit code ${compileResult.code}`;
      self.postMessage({ type: "stderr", content: compilerErr + "\n" });
      self.postMessage({
        type: "finished",
        status: String(compileResult.code ?? 1),
        elapsed_ms: 0,
        compiler_error: compilerErr,
      });
      return;
    }

    // Surface any compiler warnings even on success
    if (compileResult.stderr?.trim()) {
      self.postMessage({
        type: "stderr",
        content: compileResult.stderr + "\n",
      });
    }

    // ── 2. Execute ───────────────────────────────────────────────────────────
    self.postMessage({ type: "status", content: "$ Running...\n\n" });

    const wasmBytes = await dir.readFile("out.wasm");
    const program = await Wasmer.fromFile(wasmBytes);

    const encoder = new TextEncoder();
    const stdinBytes = stdin ? encoder.encode(stdin) : undefined;

    const startTime = performance.now();

    const runInstance = await program.entrypoint.run({
      stdin: stdinBytes,
    });

    const runResult = await runInstance.wait();
    const elapsed_ms = Math.round(performance.now() - startTime);

    if (runResult.stdout) {
      self.postMessage({ type: "stdout", content: runResult.stdout });
    }
    if (runResult.stderr) {
      self.postMessage({ type: "stderr", content: runResult.stderr });
    }

    self.postMessage({
      type: "finished",
      status: String(runResult.code ?? 0),
      elapsed_ms,
    });
  } catch (err) {
    const msg = err?.stack || err?.message || String(err);
    self.postMessage({ type: "stderr", content: msg + "\n" });
    self.postMessage({ type: "finished", status: "1", elapsed_ms: 0 });
  }
};
