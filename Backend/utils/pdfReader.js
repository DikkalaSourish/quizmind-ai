const pdf = require("pdf-parse");

async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);

    let text = data.text;

    // Remove extra spaces
    text = text.replace(/\s+/g, " ");

    // Remove non-printable characters
    text = text.replace(/[^\x20-\x7E\n]/g, "");

    // Limit text sent to Gemini
    const MAX_CHARS = 25000;

    if (text.length > MAX_CHARS) {
      const part = Math.floor(MAX_CHARS / 3);

      const start = text.substring(0, part);

      const middleStart =
        Math.floor(text.length / 2) - Math.floor(part / 2);

      const middle = text.substring(
        middleStart,
        middleStart + part
      );

      const end = text.substring(text.length - part);

      text = start + "\n\n" + middle + "\n\n" + end;
    }

    return text;
  } catch (error) {
    console.error("PDF Read Error:", error);
    throw new Error("Failed to read PDF.");
  }
}

module.exports = {
  extractTextFromPDF,
};