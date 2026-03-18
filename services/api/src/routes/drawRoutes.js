const express = require("express");
const multer = require("multer");
const AppError = require("../errores/AppError");
const drawController = require("../controllers/drawController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/plain") {
      cb(new AppError("Only TXT files are allowed", 400));
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024
  }
});

router.post(
  "/certify-draw",
  authMiddleware,
  upload.single("file"),
  drawController.certifyDraw
);
router.get("/draws", authMiddleware, drawController.getDraws);

module.exports = router;
