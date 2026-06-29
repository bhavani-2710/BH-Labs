// In-memory store for viva scores
const vivaStore = {};

// GET /api/vivas
const getVivas = async (req, res) => {
  try {
    const entries = Object.entries(vivaStore).map(([key, score]) => ({ key, score }));
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/vivas
const saveVivaScore = async (req, res) => {
  try {
    const { key, score } = req.body;
    if (!key) {
      return res.status(400).json({ error: "key is required" });
    }
    vivaStore[key] = score;
    res.json({ key, score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getVivas,
  saveVivaScore,
};
