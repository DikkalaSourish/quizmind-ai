import { useState, useRef, useCallback } from "react";
import axios from "axios";

const COLORS = {
  bg: "#0A0F1E",
  surface: "#111827",
  card: "#1A2235",
  border: "#1E2D45",
  accent: "#6366F1",
  accentLight: "#818CF8",
  violet: "#A78BFA",
  emerald: "#10B981",
  rose: "#F43F5E",
  amber: "#F59E0B",
  text: "#F1F5F9",
  muted: "#64748B",
  subtle: "#94A3B8",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: ${COLORS.bg}; color: ${COLORS.text}; min-height: 100vh; }
  .app { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 2rem 1rem; }
  .glass { background: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 20px; }
  .btn-primary { background: ${COLORS.accent}; color: #fff; border: none; border-radius: 12px; padding: 14px 28px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif; }
  .btn-primary:hover:not(:disabled) { background: ${COLORS.accentLight}; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  .btn-secondary { background: transparent; color: ${COLORS.subtle}; border: 1px solid ${COLORS.border}; border-radius: 12px; padding: 12px 24px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif; }
  .btn-secondary:hover:not(:disabled) { border-color: ${COLORS.accent}; color: ${COLORS.accentLight}; }
  .btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }
  .chip {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 170px;
  height: 46px;
  gap: 6px;
  padding: 0 20px;
  border-radius: 999px;
  border: 1.5px solid ${COLORS.border};
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all .2s;
  background: transparent;
  color: ${COLORS.subtle};
  font-family: 'Inter', sans-serif;
}
  .count-chip {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 65px;
  height: 46px;
  border-radius: 999px;
  border: 1.5px solid ${COLORS.border};
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  background: transparent;
  color: ${COLORS.subtle};
  transition: .2s;
}

.count-chip.active {
  border-color: ${COLORS.accent};
  background: rgba(99,102,241,.12);
  color: ${COLORS.accentLight};
}
  .difficulty-chip {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 125px;
  height: 46px;
  border-radius: 999px;
  border: 1.5px solid ${COLORS.border};
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  background: transparent;
  color: ${COLORS.subtle};
  transition: .2s;
}

.difficulty-chip.active {
  border-color: ${COLORS.accent};
  background: rgba(99,102,241,.12);
  color: ${COLORS.accentLight};
}

  .chip.active { border-color: ${COLORS.accent}; color: ${COLORS.accentLight}; background: rgba(99,102,241,0.12); }
  .chip:hover:not(.active) { border-color: ${COLORS.muted}; color: ${COLORS.text}; }
  .option-btn { width: 100%; text-align: left; background: ${COLORS.surface}; border: 1.5px solid ${COLORS.border}; border-radius: 14px; padding: 16px 20px; font-size: 15px; color: ${COLORS.text}; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif; display: flex; align-items: center; gap: 14px; }
  .option-btn:hover:not(:disabled) { border-color: ${COLORS.accent}; background: rgba(99,102,241,0.08); }
  .option-btn.selected { border-color: ${COLORS.accent}; background: rgba(99,102,241,0.15); color: ${COLORS.accentLight}; }
  .option-btn.correct { border-color: ${COLORS.emerald}; background: rgba(16,185,129,0.12); color: #6EE7B7; }
  .option-btn.wrong { border-color: ${COLORS.rose}; background: rgba(244,63,94,0.12); color: #FDA4AF; }
  .option-btn:disabled { cursor: default; }
  .progress-bar { height: 4px; background: ${COLORS.border}; border-radius: 99px; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, ${COLORS.accent}, ${COLORS.violet}); border-radius: 99px; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
  .drop-zone { border: 2px dashed ${COLORS.border}; border-radius: 20px; padding: 48px 32px; text-align: center; transition: all 0.2s; cursor: pointer; }
  .drop-zone.drag-over { border-color: ${COLORS.accent}; background: rgba(99,102,241,0.06); }
  .drop-zone.has-file { border-color: ${COLORS.emerald}; background: rgba(16,185,129,0.06); }
  .score-ring { width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-direction: column; border: 4px solid ${COLORS.emerald}; background: rgba(16,185,129,0.08); }
  .tag { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600; letter-spacing: 0.3px; }
  .spinner { width: 40px; height: 40px; border: 3px solid ${COLORS.border}; border-top-color: ${COLORS.accent}; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeIn 0.35s ease forwards; }
  @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  .slide-in { animation: slideIn 0.3s ease forwards; }
  input[type="file"] { display: none; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: ${COLORS.surface}; } ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 99px; }
`;

const LABEL = ["A", "B", "C", "D"];
const MAX_PDF_BYTES = 32 * 1024 * 1024; // 32 MB — Anthropic's limit
const FETCH_TIMEOUT_MS = 90000; // 90 seconds

// FIX 1: Validate PDF size before reading
function fileToBase64(file) {
  return new Promise((res, rej) => {
    if (file.size > MAX_PDF_BYTES) {
      rej(new Error("PDF is too large (max 32 MB). Please use a smaller file."));
      return;
    }
    const r = new FileReader();
    r.onload = () => {
      const result = r.result;
      // FIX 2: Guard against unexpected FileReader result format
      const parts = result.split(",");
      if (parts.length < 2) {
        rej(new Error("Failed to read file. The file may be corrupted."));
        return;
      }
      res(parts[1]);
    };
    r.onerror = () => rej(new Error("Failed to read file. Please try again."));
    r.readAsDataURL(file);
  });
}

// FIX 3: Sanitize and validate each question from the AI
function sanitizeQuestions(rawQuiz) {
  if (!Array.isArray(rawQuiz) || rawQuiz.length === 0) {
    throw new Error("Quiz data is empty or malformed. Please try again.");
  }

  const valid = [];
  for (const q of rawQuiz) {
    // Must have a non-empty question string
    if (!q || typeof q.question !== "string" || !q.question.trim()) continue;

    // Options must be a non-empty array of strings
    if (!Array.isArray(q.options) || q.options.length < 2) continue;
    const opts = q.options.map((o) => (typeof o === "string" ? o : String(o ?? "")));

    // correct must be a valid 0-based index within options
    const correctIdx = typeof q.correct === "number" ? Math.round(q.correct) : -1;
    if (correctIdx < 0 || correctIdx >= opts.length) continue;

    // explanation is optional but should be a string
    const explanation =
      typeof q.explanation === "string" && q.explanation.trim()
        ? q.explanation.trim()
        : "No explanation provided.";

    const type =
      opts.length === 2 &&
      opts[0].toLowerCase() === "true" &&
      opts[1].toLowerCase() === "false"
        ? "true_false"
        : "mcq";

    valid.push({ question: q.question.trim(), options: opts, correct: correctIdx, explanation, type });
  }

  if (valid.length === 0) {
    throw new Error("No valid questions were generated. Please try again.");
  }

  return valid;
}

async function generateQuizFromPDF(file, settings) {
  const formData = new FormData();

  formData.append("pdf", file);
  formData.append("count", settings.count);
  formData.append("difficulty", settings.difficulty);
  formData.append("type", settings.type);

  try {
    const response = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/quiz/generate`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.quiz;
  } catch (error) {
    console.error(error);

    throw new Error(
      error.response?.data?.message ||
      "Failed to generate quiz."
    );
  }
}

export default function App() {
  const [phase, setPhase] = useState("home");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [settings, setSettings] = useState({ count: 10, difficulty: "Mixed", type: "MCQ" });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [questionKey, setQuestionKey] = useState(0);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Only PDF files are supported. Please upload a .pdf file.");
      return;
    }
    if (f.size > MAX_PDF_BYTES) {
      setError("PDF is too large (max 32 MB). Please use a smaller file.");
      return;
    }
    setFile(f);
    setError("");
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    // FIX 9: Guard against empty dataTransfer
    const dropped = e.dataTransfer?.files?.[0];
    if (dropped) handleFile(dropped);
  }, []);

  const onDragOver = useCallback((e) => { e.preventDefault(); setDragging(true); }, []);
  const onDragLeave = useCallback(() => setDragging(false), []);

  const generateQuiz = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const quiz = await generateQuizFromPDF(file, settings);

      setQuestions(quiz);
      setAnswers({});
      setCurrent(0);
      setShowReview(false);
      setPhase("quiz");
    } catch (e) {
      console.error("Quiz generation error:", e);
      setError(e.message || "Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (idx) => {
    setAnswers((prev) => ({ ...prev, [current]: idx }));
  };

  const goNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setQuestionKey((k) => k + 1);
    }
  };

  const goPrev = () => {
    if (current > 0) {
      setCurrent((c) => c - 1);
      setQuestionKey((k) => k + 1);
    }
  };

  const submitQuiz = () => {
    setPhase("results");
    setShowReview(false);
  };

  const restartQuiz = () => {
    setPhase("home");
    setFile(null);
    setQuestions([]);
    setAnswers({});
    setCurrent(0);
    setError("");
    setShowReview(false);
  };

  // FIX 10: Guard score computation against empty questions array
  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
  const skipped = questions.filter((_, i) => answers[i] === undefined).length;
  const wrong = questions.length - score - skipped;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const scoreColor = pct >= 80 ? COLORS.emerald : pct >= 50 ? COLORS.amber : COLORS.rose;

  const isLastQuestion = current === questions.length - 1;

  // ─── Home / Settings Phase ───────────────────────────────────────────────
  if (phase === "home" || phase === "settings") {
    return (
      <>
        <style>{css}</style>
        <div className="app">
          <div style={{ maxWidth: 560, width: "100%" }}>
            <div className="fade-in" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(99,102,241,0.15)", border: `1.5px solid rgba(99,102,241,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={COLORS.accentLight} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h1 style={{ fontSize: "2.2rem", fontWeight: 800, background: `linear-gradient(135deg, ${COLORS.text} 0%, ${COLORS.violet} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.2, marginBottom: "0.75rem" }}>
                QuizMind AI
              </h1>
              <p style={{ color: COLORS.muted, fontSize: "1rem", lineHeight: 1.7 }}>
                Transform your PDF study materials into intelligent AI-powered quizzes.
              </p>
            </div>

            <div className="glass fade-in" style={{ padding: "2rem", marginBottom: "1.25rem" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: COLORS.subtle, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "1rem" }}>Upload PDF</p>
              <div
                className={`drop-zone ${dragging ? "drag-over" : ""} ${file ? "has-file" : ""}`}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => fileRef.current.click()}
              >
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  ref={fileRef}
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                {file ? (
                  <div>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={COLORS.emerald} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <p style={{ color: COLORS.emerald, fontWeight: 600, marginBottom: "0.35rem" }}>{file.name}</p>
                    <p style={{ color: COLORS.muted, fontSize: "13px" }}>{(file.size / 1024).toFixed(0)} KB · Click to change</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `rgba(99,102,241,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.accentLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <p style={{ color: COLORS.subtle, marginBottom: "0.4rem", fontWeight: 500 }}>Drag & drop your PDF here</p>
                    <p style={{ color: COLORS.muted, fontSize: "13px" }}>or click to browse · max 32 MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="glass fade-in" style={{ padding: "2rem", marginBottom: "1.25rem" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: COLORS.subtle, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "1.25rem" }}>Quiz Settings</p>

              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "14px", color: COLORS.subtle, marginBottom: "0.75rem", fontWeight: 500 }}>Number of questions</p>
                <div style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", width: "100%",}}>
                  {[5, 10, 20, 30, 50].map((n) => (
                    <button key={n}className={`count-chip ${settings.count === n ? "active" : ""}`} onClick={() => setSettings((s) => ({ ...s, count: n }))}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "14px", color: COLORS.subtle, marginBottom: "0.75rem", fontWeight: 500 }}>Difficulty</p>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "14px", flexWrap: "nowrap"}}>
                  {["Easy", "Medium", "Hard", "Mixed"].map((d) => (
                    <button key={d} className={`difficulty-chip ${settings.difficulty === d ? "active" : ""}`} onClick={() => setSettings((s) => ({ ...s, difficulty: d }))}>
                      {d === "Easy" && "🟢"} {d === "Medium" && "🟡"} {d === "Hard" && "🔴"} {d === "Mixed" && "🎲"} {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontSize: "14px", color: COLORS.subtle, marginBottom: "0.75rem", fontWeight: 500 }}>Question type</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  {["MCQ", "Mixed"].map((t) => (
                    <button key={t} className={`chip ${settings.type === t ? "active" : ""}`} onClick={() => setSettings((s) => ({ ...s, type: t }))}>
                      {t === "MCQ" ? "Multiple Choice" : "MCQ + True/False"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: 12, padding: "12px 16px", marginBottom: "1rem", color: "#FDA4AF", fontSize: "14px" }}>
                ⚠️ {error}
              </div>
            )}

            <button
              className="btn-primary"
              style={{ width: "100%", fontSize: "16px", padding: "16px" }}
              onClick={generateQuiz}
              disabled={!file || loading}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                  Analyzing PDF & generating quiz…
                </span>
              ) : "Generate Quiz →"}
            </button>
          </div>
        </div>
      </>
    );
  }

  // ─── Quiz Phase ───────────────────────────────────────────────────────────
  if (phase === "quiz") {
    // FIX 11: Guard against empty questions array reaching this phase
    if (!questions || questions.length === 0) {
      setPhase("home");
      return null;
    }

    const q = questions[current];

    // FIX 12: Guard against undefined question at current index
    if (!q) {
      setCurrent(0);
      return null;
    }

    const userAns = answers[current];
    const answered = Object.keys(answers).length;

    return (
      <>
        <style>{css}</style>
        <div className="app">
          <div style={{ maxWidth: 640, width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div>
                <p style={{ fontSize: "13px", color: COLORS.muted, marginBottom: 2 }}>Question {current + 1} of {questions.length}</p>
                <p style={{ fontSize: "13px", color: COLORS.subtle }}>{answered} answered · {questions.filter((_, i) => answers[i] === undefined).length} unanswered</p>
              </div>
              <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px" }} onClick={submitQuiz}>
                Submit Quiz
              </button>
            </div>

            <div className="progress-bar" style={{ marginBottom: "1.75rem" }}>
              <div className="progress-fill" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
            </div>

            <div style={{ display: "flex", gap: "6px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setQuestionKey((k) => k + 1); }}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    border: `1.5px solid ${i === current ? COLORS.accent : answers[i] !== undefined ? "rgba(99,102,241,0.4)" : COLORS.border}`,
                    background: i === current ? "rgba(99,102,241,0.2)" : answers[i] !== undefined ? "rgba(99,102,241,0.08)" : "transparent",
                    color: i === current ? COLORS.accentLight : answers[i] !== undefined ? COLORS.accentLight : COLORS.muted,
                    fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s", fontFamily: "Inter, sans-serif"
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div key={questionKey} className="glass slide-in" style={{ padding: "2rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
                <span className="tag" style={{ background: "rgba(99,102,241,0.15)", color: COLORS.accentLight, border: "1px solid rgba(99,102,241,0.25)" }}>
                  {q.type === "true_false" ? "True / False" : "MCQ"}
                </span>
                <span className="tag" style={{ background: "rgba(167,139,250,0.12)", color: COLORS.violet, border: "1px solid rgba(167,139,250,0.2)" }}>
                  {settings.difficulty}
                </span>
              </div>
              <p style={{ fontSize: "1.15rem", fontWeight: 600, lineHeight: 1.65, color: COLORS.text, marginBottom: "1.75rem" }}>
                {q.question}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`option-btn ${
                      userAns !== undefined
                      ? i === q.correct
                      ? "correct"
                      : userAns === i
                      ? "wrong" 
                      : ""
                      : userAns === i
                      ? "selected"
                      : ""
                    }`}
                    onClick={() => selectAnswer(i)}
                  >
                    <span
                      style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background:
                        userAns !== undefined
                        ? i === q.correct
                        ? COLORS.emerald
                        : userAns === i
                        ? COLORS.rose
                        : COLORS.border
                        : userAns === i
                        ? COLORS.accent
                        : COLORS.border,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#fff",
                      flexShrink: 0,
                      transition: "background 0.2s",
                      }}
                    >
                      {LABEL[i] !== undefined ? LABEL[i] : i + 1}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* FIX 13: On last question, show a Submit CTA instead of disabled Next */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={goPrev} disabled={current === 0}>
                ← Previous
              </button>
              {isLastQuestion ? (
                <button className="btn-primary" style={{ flex: 2 }} onClick={submitQuiz}>
                  Submit Quiz ✓
                </button>
              ) : (
                <>
                  <button className="btn-secondary" style={{ flex: 1 }} onClick={goNext}>
                    Skip
                  </button>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={goNext}>
                    Next →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─── Results Phase ────────────────────────────────────────────────────────
  if (phase === "results") {
    return (
      <>
        <style>{css}</style>
        <div className="app">
          <div style={{ maxWidth: 620, width: "100%" }}>
            <div className="fade-in" style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.5rem" }}>Quiz Complete!</h2>
              <p style={{ color: COLORS.muted }}>Here's how you did on this round</p>
            </div>

            <div className="glass fade-in" style={{ padding: "2rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
                <div className="score-ring" style={{ borderColor: scoreColor, background: `${scoreColor}15` }}>
                  <span style={{ fontSize: "2rem", fontWeight: 800, color: scoreColor }}>{pct}%</span>
                  <span style={{ fontSize: "12px", color: COLORS.muted }}>Score</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, flex: 1, minWidth: 200 }}>
                  {[
                    { label: "Correct", value: score, color: COLORS.emerald, bg: "rgba(16,185,129,0.1)" },
                    { label: "Wrong", value: wrong, color: COLORS.rose, bg: "rgba(244,63,94,0.1)" },
                    { label: "Skipped", value: skipped, color: COLORS.amber, bg: "rgba(245,158,11,0.1)" },
                  ].map((s) => (
                    <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: "16px 12px", textAlign: "center", border: `1px solid ${s.color}25` }}>
                      <p style={{ fontSize: "1.75rem", fontWeight: 800, color: s.color }}>{s.value}</p>
                      <p style={{ fontSize: "12px", color: COLORS.muted, fontWeight: 500 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: "1.5rem" }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => setShowReview(!showReview)}>
                {showReview ? "Hide Review" : "Review Answers"}
              </button>
              <button className="btn-secondary" onClick={restartQuiz}>New Quiz</button>
              <button className="btn-secondary" onClick={() => { setPhase("quiz"); setCurrent(0); setAnswers({}); setShowReview(false); }}>
                Retry
              </button>
            </div>

            {showReview && (
              <div className="fade-in">
                {questions.map((q, i) => {
                  const ua = answers[i];
                  const isCorrect = ua === q.correct;
                  const isSkipped = ua === undefined;
                  const statusColor = isSkipped ? COLORS.amber : isCorrect ? COLORS.emerald : COLORS.rose;
                  const statusLabel = isSkipped ? "Skipped" : isCorrect ? "Correct" : "Wrong";
                  return (
                    <div key={i} className="glass" style={{ padding: "1.5rem", marginBottom: "1rem", borderLeft: `3px solid ${statusColor}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: "1rem" }}>
                        <p style={{ fontSize: "14px", fontWeight: 500, color: COLORS.muted }}>Q{i + 1}</p>
                        <span className="tag" style={{ background: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}30`, flexShrink: 0 }}>
                          {statusLabel}
                        </span>
                      </div>
                      <p style={{ fontWeight: 600, marginBottom: "1rem", lineHeight: 1.6 }}>{q.question}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1rem" }}>
                        {q.options.map((opt, oi) => {
                          const isCorr = oi === q.correct;
                          const isUser = oi === ua;
                          let cls = "option-btn";
                          if (isCorr) cls += " correct";
                          else if (isUser && !isCorr) cls += " wrong";
                          return (
                            <div key={oi} className={cls} style={{ pointerEvents: "none" }}>
                              <span style={{ width: 24, height: 24, borderRadius: 6, background: isCorr ? COLORS.emerald : isUser ? COLORS.rose : COLORS.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                                {LABEL[oi] !== undefined ? LABEL[oi] : oi + 1}
                              </span>
                              {opt}
                              {isCorr && <span style={{ marginLeft: "auto", color: COLORS.emerald, fontSize: 16 }}>✓</span>}
                              {isUser && !isCorr && <span style={{ marginLeft: "auto", color: COLORS.rose, fontSize: 16 }}>✗</span>}
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ background: "rgba(99,102,241,0.08)", borderRadius: 12, padding: "12px 14px", borderLeft: `3px solid ${COLORS.accent}` }}>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: COLORS.accentLight, marginBottom: 4 }}>Explanation</p>
                        <p style={{ fontSize: "14px", color: COLORS.subtle, lineHeight: 1.6 }}>{q.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return null;
}
