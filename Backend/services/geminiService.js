const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateQuizFromText(text, settings) {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
});

const prompt = `
You are an experienced university exam paper setter.

Study Material:
${text}

Your task is to generate EXACTLY ${settings.count} ${settings.type} questions.

Difficulty:
${settings.difficulty}

Rules:

1. Every question must test a DIFFERENT concept.
2. Never repeat a question.
3. Never ask the same concept twice.
4. Cover all important topics from the study material.
5. Every MCQ must contain exactly 4 UNIQUE options.
6. Only ONE option should be correct.
7. Incorrect options should be believable.
8. Shuffle the position of the correct answer.
9. Keep explanations short (1–2 lines).
10. Do not invent facts that are not present in the document.
11. If the document does not contain enough information, generate fewer questions instead of repeating questions.
12. Return ONLY valid JSON.
13. Do not use Markdown.
14. Do not wrap the response inside \`\`\`.

Return ONLY this JSON:

{
  "quiz":[
    {
      "question":"...",
      "options":["...","...","...","..."],
      "correct":0,
      "explanation":"...",
      "type":"mcq"
    }
  ]
}
`;

  // Retry up to 3 times if Google returns 503
  let lastError;

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const result = await model.generateContent(prompt);

      const response = await result.response;
      const textResponse = response.text();

      const cleaned = textResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let parsed;

    try {
        parsed = JSON.parse(cleaned);
    } catch (e) {
        throw new Error(
            "Gemini returned an invalid response. Please try again."
        );
    }

    if (!parsed.quiz || !Array.isArray(parsed.quiz)) {
        throw new Error("Quiz format is invalid.");
    }

    return parsed.quiz;

    } catch (error) {
      lastError = error;

      if (
    (error.status === 503 || error.status === 429) &&
    attempt < 5
) {
        console.log(`Retrying... Attempt ${attempt}`);
        await new Promise(resolve =>
    setTimeout(resolve, attempt * 3000)
);
      } else {
        throw error;
      }
    }
  }

  throw lastError;
}

module.exports = {
  generateQuizFromText,
};