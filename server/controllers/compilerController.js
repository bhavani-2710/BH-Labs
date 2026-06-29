// POST /api/run (proxies compilation requests to Wandbox)
const runCode = async (req, res) => {
  try {
    const { compiler, code, stdin } = req.body;
    if (!compiler || !code) {
      return res.status(400).json({ error: "compiler and code are required" });
    }
    const wandboxBody = { compiler, code };
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
