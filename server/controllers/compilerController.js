/**
 * runCode
 * Proxies a code execution request to the Wandbox public compiler API
 * (https://wandbox.org). Accepts the compiler identifier, source code,
 * and optional stdin, and forwards the Wandbox JSON response directly
 * to the client.
 *
 * @route  POST /api/run
 * @param  {import("express").Request}  req
 *   Body: { compiler: string, code: string, stdin?: string }
 *   - compiler: Wandbox compiler ID (e.g. "gcc-head-c", "cpython-3.12.7")
 *   - code:     Source code to compile and run
 *   - stdin:    Optional standard input to feed to the program
 * @param  {import("express").Response} res
 *   Returns the Wandbox JSON result on success, or an error object on failure.
 */
const runCode = async (req, res) => {
  try {
    const { compiler, code, stdin } = req.body;
    if (!compiler || !code) {
      return res.status(400).json({ error: "compiler and code are required" });
    }

    let finalCode = code;
    // For Java compilations, strip the "public" keyword from class definitions
    // because Wandbox saves the primary code file as prog.java, which triggers
    // a compilation error if any public class is not named "prog".
    if (compiler.includes("openjdk") || req.body.language === "java") {
      finalCode = code.replace(/\bpublic\s+class\s+(\w+)/g, "class $1");
    }

    const wandboxBody = { compiler, code: finalCode };
    if (stdin) wandboxBody.stdin = stdin;

    const response = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wandboxBody),
    });

    if (!response.ok) {
      return res.status(502).json({ error: "Wandbox failed", status: response.status });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Wandbox proxy error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  runCode,
};
