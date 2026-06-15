const express = require("express");
const multer = require("multer");
const { generateQuiz } = require("../controllers/quizController");

const router = express.Router();

// Accept only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

router.post("/generate", upload.single("pdf"), generateQuiz);

module.exports = router;