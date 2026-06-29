const express = require("express");
const { getVivas, saveVivaScore } = require("../controllers/vivaController");

const router = express.Router();

router.get("/", getVivas);
router.post("/", saveVivaScore);

module.exports = router;
