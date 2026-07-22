// Intercept uncaught errors
self.addEventListener("error", (event) => {
  self.postMessage({
    type: "stderr",
    content: (event.message || "Unknown runtime error") + "\n",
  });
  self.postMessage({ type: "finished", status: "1" });
});

self.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason;
  const errMsg =
    reason && reason.stack
      ? reason.stack
      : reason && reason.message
        ? reason.message
        : String(reason);
  self.postMessage({
    type: "stderr",
    content: "Unhandled Rejection: " + errMsg + "\n",
  });
  self.postMessage({ type: "finished", status: "1" });
});

importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js");

let pyodide = null;
async function initPyodide() {
  pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/",
    stdout: (text) => {
      self.postMessage({ type: "stdout", content: text + "\n" });
    },
    stderr: (text) => {
      self.postMessage({ type: "stderr", content: text + "\n" });
    },
  });
}

const pyodidePromise = initPyodide();

self.onmessage = async function (e) {
  if (e.data.type === "run") {
    const userCode = e.data.code;
    const stdin = e.data.stdin || "";

    try {
      await pyodidePromise;

      // Register a JavaScript helper module for reading stdin lines
      const stdinLines = stdin
        .split(/\r?\n/)
        .map((line) => line.trimEnd());

      let stdinIndex = 0;

      pyodide.registerJsModule("stdin_helper", {
        readline: () => {
          if (stdinIndex < stdinLines.length) {
            return stdinLines[stdinIndex++];
          }
          return "";
        },
        at_end: () => stdinIndex >= stdinLines.length,
      });

      // Override builtins.input in Python to read from our stdin helper
      // It prints the prompt and the entered value to simulate console output.
      // Also back sys.stdin with the same stdin_helper data so scripts using
      // sys.stdin.read()/.readline()/iteration work too.
      await pyodide.runPythonAsync(`
import builtins
import sys
import io
import warnings
import stdin_helper

# Suppress deprecation warnings (e.g. Pandas Pyarrow dependency warning)
warnings.filterwarnings("ignore", category=DeprecationWarning)


def custom_input(prompt=""):
    if prompt:
        print(prompt, end="")
    val = stdin_helper.readline()
    print(val)
    return val

builtins.input = custom_input

# --- sys.stdin backed by the same stdin_helper data ---
class _FakeStdin(io.TextIOBase):
    def readline(self, size=-1):
        line = stdin_helper.readline()
        if line == "" and stdin_helper.at_end():
            return ""
        return line + "\\n"

    def read(self, size=-1):
        lines = []
        while True:
            if stdin_helper.at_end():
                break
            lines.append(stdin_helper.readline())
        return "\\n".join(lines) + ("\\n" if lines else "")

    def __iter__(self):
        return self

    def __next__(self):
        line = self.readline()
        if line == "":
            raise StopIteration
        return line

sys.stdin = _FakeStdin()
      `);

      // Load packages imported in the user code (e.g. numpy, pandas, matplotlib)
      try {
        await pyodide.loadPackagesFromImports(userCode);
      } catch (pkgErr) {
        self.postMessage({
          type: "stderr",
          content: "Warning loading imports: " + pkgErr.message + "\n",
        });
      }

      // Execute user code
      await pyodide.runPythonAsync(userCode);
      self.postMessage({ type: "finished", status: "0" });
    } catch (err) {
      const errMsg =
        err && err.stack
          ? err.stack
          : err && err.message
            ? err.message
            : String(err);
      self.postMessage({ type: "stderr", content: errMsg + "\n" });
      self.postMessage({ type: "finished", status: "1" });
    }
  }
};