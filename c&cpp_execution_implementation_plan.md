# Implement C/C++ Browser Execution via @wasmer/sdk Web Worker

Run C and C++ programs entirely in the browser using the `@wasmer/sdk` Clang toolchain inside a dedicated Web Worker, with no server round-trip.

## Background

The existing runners follow a two-tier pattern:

| Language     | Engine |
|--------------|--------|
| JavaScript   | `jsWorker.js` (Web Worker, `eval`) |
| Python       | `pythonWorker.js` (Web Worker, Pyodide CDN) |
| Java / SQL   | Backend → `/api/run` → Wandbox |
| **C / C++**  | _(currently)_ Backend → `/api/run` → Wandbox |

The goal is to move **C and C++** to the same client-side pattern, using `@wasmer/sdk` + `clang/clang` from the Wasmer registry.

## User Review Required

> [!IMPORTANT]
> **Cross-Origin Isolation Headers Required**
> `@wasmer/sdk` relies on `SharedArrayBuffer`, which browsers restrict to [cross-origin isolated](https://developer.mozilla.org/en-US/docs/Web/API/crossOriginIsolated) contexts. Two HTTP headers **must** be added everywhere the app is served:
> ```
> Cross-Origin-Embedder-Policy: require-corp
> Cross-Origin-Opener-Policy: same-origin
> ```
> These headers are added to both the **Vite dev server config** and the **Express production server**. Any cross-origin iframes, fonts, or image URLs that don't carry CORS/CORP headers will be blocked in production — this should be verified after deploy.

> [!WARNING]
> **First-run latency for `clang/clang`**
> The Wasmer registry package for clang is ~100 MB. On the very first run in a session the worker downloads, compiles and caches it. Subsequent runs within the same session reuse the cached package. The UI will show a `$ Initializing Clang compiler...` message while this happens.

> [!NOTE]
> **C/C++ stdin approach**
> The Wasmer SDK supports passing `stdin` as a `Uint8Array` directly in the `.run()` call, so there is no need for a virtual `stdin.txt` file. The source file (`main.c` / `main.cpp`) is written to a `Directory` virtual filesystem, and the compiled `.wasm` is read back from it and executed.

## Proposed Changes

---

### Dependencies

#### [MODIFY] [package.json](file:///c:/Users/Bhavani/Desktop/BH%20Internship/BH%20labs%20project/bh-labs/client/package.json)
- Add `"@wasmer/sdk": "^0.8"` to `dependencies`.

---

### Vite Config

#### [MODIFY] [vite.config.js](file:///c:/Users/Bhavani/Desktop/BH%20Internship/BH%20labs%20project/bh-labs/client/vite.config.js)
- Add `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers to the **dev server** `headers` config block so `SharedArrayBuffer` is available locally.

---

### Express Server (Production Headers)

#### [MODIFY] [app.js](file:///c:/Users/Bhavani/Desktop/BH%20Internship/BH%20labs%20project/bh-labs/server/app.js)
- Add a global middleware that injects the same COEP/COOP headers for all responses served in production so the deployed client bundle is also cross-origin isolated.

---

### Workers

#### [NEW] [cWorker.js](file:///c:/Users/Bhavani/Desktop/BH%20Internship/BH%20labs%20project/bh-labs/client/src/workers/cWorker.js)

The core worker. Lifecycle:

1. **Init (once per worker lifetime)**
   - `import { init, Wasmer, Directory } from "@wasmer/sdk"` (ESM worker — Vite bundles it as a separate asset automatically via `new URL("./cWorker.js", import.meta.url)`)
   - Call `await init()` to boot the WASM runtime.
   - `await Wasmer.fromRegistry("clang/clang")` — downloads + caches the Clang toolchain.
   - Store both in module-level variables so they survive between `run` messages.
   - Post `{ type: "ready" }` when done.

2. **Compile (on each `run` message)**
   - Create a `Directory`, write the source to `main.c` or `main.cpp`.
   - Run `clang.entrypoint.run({ args: ["/src/main.c", "-o", "/src/out.wasm"], mount: { "/src": dir } })`.
   - `await instance.wait()` — check `output.ok`; if compilation failed, post `{ type: "stderr", content: output.stderr }` and `{ type: "finished", status: "1" }`.
   - Read `out.wasm` back from the directory.

3. **Execute**
   - `Wasmer.fromFile(wasmBytes)` to load the compiled executable.
   - Encode the user stdin as `Uint8Array`.
   - `await pkg.entrypoint.run({ stdin: stdinBytes })` then `await result.wait()`.
   - Post `{ type: "stdout", content }` and `{ type: "stderr", content }` from the result.
   - Post `{ type: "finished", status: String(result.code) }`.

4. **Timing**
   - `performance.now()` before and after execution; include elapsed ms in the `finished` message.

5. **Error handling**
   - Wrap in `try/catch`; any unhandled rejection posts an error `stderr` message + `finished` with status `"1"`.

#### [NEW] [cWorkerHelper.js](file:///c:/Users/Bhavani/Desktop/BH%20Internship/BH%20labs%20project/bh-labs/client/src/workers/cWorkerHelper.js)

- Exports `runCInWebWorker(code, language, stdin)`.
- Creates the worker via `new Worker(new URL("./cWorker.js", import.meta.url))` (Vite handles bundling).
- Waits for the `ready` message (worker signals Clang is loaded).
- Posts `{ type: "run", code, language, stdin }` to the worker.
- Collects `stdout` / `stderr` messages, resolves on `finished`.
- Applies a **30-second timeout** (longer than Python's 15 s to account for ~100 MB clang download on first run): terminates the worker and resolves with `status: "1"` and a `Time Limit Exceeded` error message.
- Returns the standard Wandbox-compatible schema:
  ```js
  {
    program_output: "",   // stdout
    program_error: "",    // stderr (compiler + runtime)
    compiler_message: "", // populated with clang stderr if compile fails
    compiler_error: "",
    status: "0" | "1",
    elapsed_ms: 123,
  }
  ```

---

### LabWorkspace Integration

#### [MODIFY] [LabWorkspace.jsx](file:///c:/Users/Bhavani/Desktop/BH%20Internship/BH%20labs%20project/bh-labs/client/src/pages/LabWorkspace.jsx)

- Import `runCInWebWorker` from `"../workers/cWorkerHelper"`.
- Inside `handleRunCode`, update the dispatch block:

  ```js
  if (editorLanguage === "javascript") {
    data = await runJsInWebWorker(code);
  } else if (["python", "python3", "py"].includes(editorLanguage)) {
    data = await runPythonInWebWorker(code, normalizedStdin);
  } else if (["c", "cpp"].includes(editorLanguage)) {          // ← NEW
    data = await runCInWebWorker(code, editorLanguage, normalizedStdin);
  } else {
    // Java, SQL → Wandbox via /api/run
    ...
  }
  ```
- The output paths (`program_output`, `program_error`, `compiler_message`, `status`) already handled by existing code — no changes needed to terminal rendering, AI assistant, or journal generation.
- Update the running message: show `$ Initializing Clang compiler...` on first run; show `$ Compiling & running...` on cached runs.

---

## Verification Plan

### Manual Verification
- **Standard C**: `printf("Hello World\n")` — verify stdout.
- **Standard C++**: `std::cout << "Hello" << std::endl;` — verify stdout.
- **C with stdin**: Multi-value `scanf` program fed from the Input panel — verify values interleaved in output.
- **Compiler error**: Introduce a syntax error — verify `compiler_message` shows in the Errors tab.
- **Runtime error**: Dereference a null pointer — verify non-zero exit code and error message.
- **Infinite loop**: `while(1){}` — verify termination after 30 s with TLE message.
- **Other languages unchanged**: Java, SQL via backend; Python via Pyodide; JS via Web Worker.
- **Elapsed time**: Verify `elapsed_ms` is reflected correctly in the terminal footer.
