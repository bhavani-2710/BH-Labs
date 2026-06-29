const express = require("express");
const { getCodes, saveCode } = require("../controllers/codeController");

const router = express.Router();

router.get("/", getCodes);
router.post("/", saveCode);

module.exports = router;
