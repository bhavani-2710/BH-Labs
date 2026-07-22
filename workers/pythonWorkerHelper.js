/**
 * Executes Python code inside a Web Worker using Pyodide.
 * Bypasses the server/Wandbox executor and runs in the browser.
 *
 * @param {string} code - The user's Python code.
 * @param {string} stdin - Standard input provided by the user.
 * @returns {Promise<object>} - Resolves with Wandbox-compatible schema output.
 */
export const runPythonInWebWorker = (code, stdin) => {
  return new Promise((resolve) => {
    let programOutput = "";
    let programError = "";
    let isFinished = false;

    // Use standard Vite 5/6 syntax for loading worker assets
    const worker = new Worker(new URL("./pythonWorker.js", import.meta.url));

    // Force terminate after 15 seconds to give Pyodide time to load and run (loading can take a bit first time)
    const timeoutId = setTimeout(() => {
      if (!isFinished) {
        isFinished = true;
        worker.terminate();
        resolve({
          program_output: programOutput,
          program_error: programError + "\n✖ Error: Time Limit Exceeded (15000ms)",
          compiler_message: "",
          compiler_error: "",
          status: "1",
        });
      }
    }, 15000);

    worker.onmessage = (e) => {
      if (isFinished) return;

      const { type, content, status } = e.data;
      if (type === "stdout") {
        programOutput += content;
      } else if (type === "stderr") {
        programError += content;
      } else if (type === "finished") {
        isFinished = true;
        clearTimeout(timeoutId);
        worker.terminate();
        resolve({
          program_output: programOutput,
          program_error: programError,
          compiler_message: "",
          compiler_error: "",
          status: status,
        });
      }
    };

    worker.onerror = (err) => {
      if (isFinished) return;
      isFinished = true;
      clearTimeout(timeoutId);
      worker.terminate();
      resolve({
        program_output: programOutput,
        program_error: programError + (err.message ? err.message : String(err)) + "\n",
        compiler_message: "",
        compiler_error: "",
        status: "1",
      });
    };

    worker.postMessage({ type: "run", code, stdin });
  });
};
