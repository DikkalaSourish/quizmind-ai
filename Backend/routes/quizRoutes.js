const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { generateQuiz } = require("../controllers/quizController");

const router = express.Router();
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  cb(null, uploadDir);
},

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Accept only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, //20MB
  },
});

router.post("/generate", upload.single("pdf"), generateQuiz);

module.exports = router;