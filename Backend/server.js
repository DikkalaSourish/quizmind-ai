require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads", { recursive: true });
}

const app = express();

app.use(cors());
app.use(express.json());

const quizRoutes = require("./routes/quizRoutes");

app.use("/api/quiz", quizRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 AI Quiz Generator Backend Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});