# 🧠 QuizMind AI

> Transform your PDF study materials into intelligent AI-powered quizzes in seconds.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![Gemini](https://img.shields.io/badge/Google-Gemini%202.5%20Flash-orange?logo=google)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📖 Overview

**QuizMind AI** is an AI-powered web application that automatically generates quizzes from uploaded PDF documents. It uses **Google Gemini 2.5 Flash** to analyze study material and create meaningful multiple-choice questions with explanations.

The application is designed to help students, educators, and self-learners quickly test their understanding without manually creating quizzes.

---

## ✨ Features

* 📄 Upload any text-based PDF
* 🤖 AI-powered quiz generation using Google Gemini
* 🎯 Choose the number of questions
* 📊 Select difficulty level (Easy, Medium, Hard, Mixed)
* ❓ Multiple Choice and Mixed (MCQ + True/False) quiz modes
* 💡 Detailed explanations for every answer
* 📈 Instant score calculation
* 🔄 Review incorrect answers after submission
* 📱 Responsive and modern dark-themed UI
* ⚠️ Smart error handling for API failures and quota limits
* 🔒 Secure backend using environment variables

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* Multer
* pdf-parse
* Google Gemini API
* dotenv

---

## 📂 Project Structure

```text
QuizMind-AI/
│
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── Backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── README.md
└── LICENSE
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/quizmind-ai.git
```

---

### 2. Install Frontend Dependencies

```bash
cd Frontend
npm install
```

---

### 3. Install Backend Dependencies

```bash
cd ../Backend
npm install
```

---

### 4. Configure Environment Variables

Create a `.env` file inside the Backend folder.

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=5000
```

---

### 5. Start Backend

```bash
npm run dev
```

---

### 6. Start Frontend

```bash
cd ../Frontend
npm run dev
```

---

## 🚀 Usage

1. Open the application.
2. Upload a text-based PDF document.
3. Select:

   * Number of Questions
   * Difficulty Level
   * Question Type
4. Click **Generate Quiz**.
5. Answer the generated questions.
6. View your score and explanations.

---

## 🧠 AI Features

QuizMind AI uses **Google Gemini 2.5 Flash** to:

* Analyze uploaded study material
* Extract important concepts
* Generate unique quiz questions
* Avoid duplicate questions
* Produce realistic answer choices
* Provide explanations

---

## 🔐 Environment Variables

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=5000
```

---

## ⚠️ Limitations

* Supports text-based PDFs only.
* Scanned/image PDFs require OCR.
* Google Gemini Free Tier has daily request limits.
* Quiz quality depends on the uploaded document.

---

## 🔮 Future Improvements

* User authentication
* Quiz history
* Leaderboard
* PDF OCR support
* Export quiz as PDF
* Timed quizzes
* Adaptive difficulty
* Multiple language support

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

**Sourish Dikkala.**

Final Year B.Tech (CSE - AI & ML)

Passionate about Artificial Intelligence, Chatbot Development, and Full-Stack Web Development.

GitHub: https://github.com/DikkalaSourish

LinkedIn: https://www.linkedin.com/in/sourish-dikkala-6983742a3/

---

⭐ If you found this project useful, consider giving it a star on GitHub!
