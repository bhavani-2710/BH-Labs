/**
 * cWorkerHelper.js
 * Manages the lifecycle of cWorker.js and exposes a single async function
 * that matches the Wandbox-compatible response schema used by all other
 * language runners (jsWorkerHelper, pythonWorkerHelper, /api/run).
 *
 * @param {string} code     — C or C++ source code
 * @param {string} language — "c" | "cpp"
 * @param {string} stdin    — contents of the Input panel (may be "")
 * @returns {Promise<{
 *   program_output:  string,
 *   program_error:   string,
 *   compiler_message: string,
 *   compiler_error:  string,
 *   status:          string,
 *   elapsed_ms:      number,
 * }>}
 */
export const runCInWebWorker = (code, language, stdin) => {
  return new Promise((resolve) => {
    let programOutput = "";
    let programError = "";
    let compilerError = "";
    let isFinished = false;

    // Vite bundles this as a separate asset automatically.
    const worker = new Worker(new URL("./cWorker.js", import.meta.url), {
      type: "module",
    });

    // 30-second hard timeout — covers both clang download + compilation +
    // execution. Prevents infinite loops from hanging the tab.
    const timeoutId = setTimeout(() => {
      if (!isFinished) {
        isFinished = true;
        worker.terminate();
        resolve({
          program_output: programOutput,
          program_error:
            programError +
            "\n✖ Error: Time Limit Exceeded (100000ms)\n",
          compiler_message: "",
          compiler_error: compilerError,
          status: "1",
          elapsed_ms: 100000,
        });
      }
    }, 100000);

    worker.onmessage = (e) => {
      if (isFinished) return;

      const { type, content, status, elapsed_ms, compiler_error } = e.data;

      switch (type) {
        case "ready":
          // clang loaded — now send the run message
          worker.postMessage({ type: "run", code, language, stdin });
          break;

        case "status":
          // Progress text — prepend to programOutput so it appears in the
          // terminal header area (mirrors how the Python worker posts progress)
          programOutput += content;
          break;

        case "stdout":
          programOutput += content;
          break;

        case "stderr":
          programError += content;
          break;

        case "finished":
          isFinished = true;
          clearTimeout(timeoutId);
          worker.terminate();

          // Separate compiler errors from runtime errors when the worker
          // signals a compiler_error field explicitly.
          if (compiler_error) {
            compilerError = compiler_error;
            programError = ""; // already in compilerError
          }

          resolve({
            program_output: programOutput,
            program_error: programError,
            compiler_message: compilerError ? "" : "",
            compiler_error: compilerError,
            status: status ?? "0",
            elapsed_ms: elapsed_ms ?? 0,
          });
          break;

        default:
          break;
      }
    };

    worker.onerror = (err) => {
      if (isFinished) return;
      isFinished = true;
      clearTimeout(timeoutId);
      worker.terminate();

      let errMsg = "";
      if (err && err.message) {
        errMsg = `${err.message} (${err.filename}:${err.lineno}:${err.colno})`;
      } else if (err && err.type) {
        errMsg = `Worker error event triggered: type=${err.type}`;
      } else {
        errMsg = String(err);
      }

      resolve({
        program_output: programOutput,
        program_error: programError + errMsg + "\n",
        compiler_message: "",
        compiler_error: compilerError,
        status: "1",
        elapsed_ms: 0,
      });
    };

    // The worker posts "ready" as soon as init() + Wasmer.fromRegistry()
    // complete. On subsequent runs the worker is reused (same instance),
    // so "ready" fires immediately from the cached singleton.
    // If the SDK is already initialised, the worker posts "ready" during
    // its own startup, so we don't need to call postMessage here — it
    // drives itself.
  });
};
