const fs = require("fs");
const { extractTextFromPDF } = require("../utils/pdfReader");
const { generateQuizFromText } = require("../services/geminiService");

const generateQuiz = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF uploaded.",
      });
    }

    const pdfText = await extractTextFromPDF(req.file.path);

    if (!pdfText || pdfText.trim().length === 0) {
      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        success: false,
        message: "The uploaded PDF contains no readable text.",
      });
    }

    const settings = {
      count: Number(req.body.count) || 10,
      difficulty: req.body.difficulty || "Mixed",
      type: req.body.type || "MCQ",
    };

    let quiz = await generateQuizFromText(pdfText, settings);

// Remove empty or invalid questions
quiz = quiz.filter((q) => {
  return (
    q.question &&
    q.question.trim() !== "" &&
    Array.isArray(q.options) &&
    q.options.length === 4
  );
});

// Remove duplicate questions
const seen = new Set();

quiz = quiz.filter((q) => {
  const key = q.question.trim().toLowerCase();

  if (seen.has(key)) {
    return false;
  }

  seen.add(key);
  return true;
});

    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      quiz,
    });

  } catch (error) {
    console.error(error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    let message = "Failed to generate quiz.";

if (error.message.includes("503")) {
  message = "Gemini is busy. Please try again in a few moments.";
}
else if (error.message.includes("429")) {
  message = "Gemini API quota exceeded. Please try again later.";
}
else if (error.message.includes("Failed to read PDF")) {
  message = "Unable to read the PDF. Please upload a text-based PDF.";
}
else if (error.message.includes("invalid")) {
  message = "AI returned an invalid response. Please try again.";
}
else if (error.message.includes("No PDF")) {
  message = "Please upload a PDF first.";
}

res.status(500).json({
  success: false,
  message,
});
  }
};

module.exports = {
  generateQuiz,
};