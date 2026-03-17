const express = require("express");
const verifyController = require("../controllers/verifyController");

const router = express.Router();

router.post("/verify-draw", verifyController.verifyDraw);

module.exports = router;
