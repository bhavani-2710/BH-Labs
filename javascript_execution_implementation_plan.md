# Implement Web Worker API for JavaScript Code Execution

This plan details the implementation of a client-side code runner using the Web Worker API to run JavaScript code directly in the user's browser, while forwarding all other editor languages (C, C++, Java, Python, SQL) to the existing server endpoint (`/api/run`) as before.

## Proposed Changes

### Client

#### [MODIFY] [LabWorkspace.jsx]

- Introduce a helper function `runJsInWebWorker(code)` that executes Javascript code using a Web Worker.
- Construct the worker using a dynamic Blob URL:
  - Override `self.console` inside the worker to intercept `log`, `info`, `debug`, `warn`, and `error` messages, sending them back to the main thread via `postMessage()`.
  - Override `self.setTimeout` and `self.clearTimeout` inside the worker to track active asynchronous execution timers so that the worker does not terminate before standard asynchronous tasks have completed.
  - Implement unhandled error listeners (`error`, `unhandledrejection`) to catch and report runtime exceptions and rejected promises during asynchronous executions.
  - Execute user code in the global worker scope using `(0, eval)(userCode)` to emulate standard script execution.
- In `handleRunCode`, check if `editorLanguage === "javascript"`.
  - If so, bypass the `fetch("/api/run")` call and invoke `runJsInWebWorker(code)`.
  - Format the resolved promise output to match the Wandbox response schema (`{ program_output, program_error, compiler_message, compiler_error, status }`).
  - Feed this simulated response directly into the existing output parsing and save state logic, ensuring zero differences in how the output is presented.
  - If not JavaScript, proceed with the original `fetch("/api/run")` call.

## Verification Plan

### Manual Verification
- **Run Standard JS Code**: Create simple arithmetic or console statements to verify successful logs and process status return.
- **Run Async JS Code**: Write code containing `setTimeout` or Promise structures to confirm that the runner captures async console logs and waits for execution to complete before terminating.
- **Run JS Errors**: Introduce syntax errors or runtime exceptions (e.g. referencing an undefined variable) to verify they are caught, outputted in red as compiler/runtime errors, and report a non-zero exit status.
- **Run JS Infinite Loop**: Write an infinite `while(true) {}` loop to confirm that the 2000ms time limit limit terminates execution gracefully without freezing the browser.
- **Verify other languages**: Run Python, C, or Java code to confirm they continue to use the `/api/run` Wandbox runner.