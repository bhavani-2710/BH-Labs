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

self.onmessage = function (e) {
  if (e.data.type === "run") {
    const userCode = e.data.code;
    console.log(userCode)

    let mainExecutionDone = false;
    const timerMap = new Map();

    const checkCompletion = () => {
      if (mainExecutionDone && timerMap.size === 0) {
        self.postMessage({ type: "finished", status: "0" });
      }
    };

    const formatArg = (arg) => {
      if (arg === undefined) return "undefined";
      if (arg === null) return "null";
      if (typeof arg === "string") return arg;
      if (typeof arg === "function") return "[Function]";
      if (typeof arg === "symbol") return arg.toString();
      if (typeof arg === "bigint") return arg.toString() + "n";
      try {
        return JSON.stringify(arg, null, 2);
      } catch (err) {
        return String(arg);
      }
    };

    const formatMessage = (args) => args.map(formatArg).join(" ");

    // Override console
    self.console = {
      log: (...args) => {
        self.postMessage({
          type: "stdout",
          content: formatMessage(args) + "\n",
        });
      },
      info: (...args) => {
        self.postMessage({
          type: "stdout",
          content: formatMessage(args) + "\n",
        });
      },
      debug: (...args) => {
        self.postMessage({
          type: "stdout",
          content: formatMessage(args) + "\n",
        });
      },
      error: (...args) => {
        self.postMessage({
          type: "stderr",
          content: formatMessage(args) + "\n",
        });
      },
      warn: (...args) => {
        self.postMessage({
          type: "stderr",
          content: formatMessage(args) + "\n",
        });
      },
    };

    // Override setTimeout/clearTimeout to track asynchronous execution
    const originalSetTimeout = self.setTimeout;
    const originalClearTimeout = self.clearTimeout;

    self.setTimeout = (callback, delay, ...args) => {
      const id = originalSetTimeout(() => {
        try {
          callback(...args);
        } catch (err) {
          const errMsg =
            err && err.stack
              ? err.stack
              : err && err.message
                ? err.message
                : String(err);
          self.postMessage({ type: "stderr", content: errMsg + "\n" });
          self.postMessage({ type: "finished", status: "1" });
        } finally {
          timerMap.delete(id);
          checkCompletion();
        }
      }, delay);
      timerMap.set(id, true);
      return id;
    };

    self.clearTimeout = (id) => {
      if (timerMap.has(id)) {
        timerMap.delete(id);
        originalClearTimeout(id);
        checkCompletion();
      }
    };

    try {
      (0, eval)(userCode);
      mainExecutionDone = true;
      checkCompletion();
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
