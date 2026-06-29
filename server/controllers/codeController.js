// In-memory store for user codes
const codeStore = {};

// GET /api/codes
const getCodes = async (req, res) => {
  try {
    const entries = Object.entries(codeStore).map(([key, code]) => ({ key, code }));
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/codes
const saveCode = async (req, res) => {
  try {
    const { key, code } = req.body;
    if (!key) {
      return res.status(400).json({ error: "key is required" });
    }
    codeStore[key] = code;
    res.json({ key, code });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCodes,
  saveCode,
};
