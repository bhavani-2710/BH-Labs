# Implement Web Worker API for JavaScript and Python Code Execution

This plan details the implementation of client-side code runners using the Web Worker API to execute JavaScript and Python code directly in the user's browser, while continuing to forward all other editor languages to the existing server endpoint (`/api/run`).

## Proposed Changes

### Client

#### [NEW] [pythonWorker.js]
- Load Pyodide from a CDN inside the worker.
- Capture stdout and stderr, sending them back to the main thread via `postMessage()`.
- Dynamically scan and load imported packages (like `numpy` and `pandas`) using `pyodide.loadPackagesFromImports`.
- Override `builtins.input` to read sequentially from the provided stdin string, print the prompt/value (to emulate a terminal), and prevent execution hangs.
- Run Python code using `pyodide.runPythonAsync`.

#### [NEW] [pythonWorkerHelper.js]
- Implement `runPythonInWebWorker(code, stdin)` which instantiates the Python worker, forwards user code/stdin inputs, handles execution timeouts (15s limit for download/startup), and resolves with standard Wandbox output schema.

#### [MODIFY] [LabWorkspace.jsx]
- Import `runPythonInWebWorker` from `../workers/pythonWorkerHelper`.
- Update `handleRunCode` execution logic:
  - If `editorLanguage` is a Python dialect (`python`, `python3`, `py`), run using `runPythonInWebWorker(code, normalizedStdin)`.
  - Otherwise, run using the server-side compiler proxy `/api/run` as before.
- Update the list of unsupported Python packages to allow `numpy`, `pandas`, `matplotlib`, `scipy`, `sklearn`, `sympy`, `pillow`/`PIL`, `beautifulsoup4`/`bs4`, `sqlalchemy`, and `pydantic`, since they are natively supported by Pyodide.

## Verification Plan

### Manual Verification
- **Run Standard Python Code**: Run simple print statements and mathematical calculations to verify stdout.
- **Run Python Inputs**: Run code with `input()` prompts and verify that inputs are correctly injected and printed sequentially.
- **Run Scientific Packages**: Import and run operations using `numpy` and `pandas` to confirm Pyodide loads and runs them locally.
- **Run Python Errors**: Introduce syntax/runtime errors and verify the output displays in the error console tab.
- **Run Infinite Loop**: Run a python infinite loop (e.g. `while True: pass`) to verify it terminates via timeout after 15 seconds.
- **Check C/C++/Java/SQL**: Verify other languages continue to compile and execute via the `/api/run` Wandbox runner.
