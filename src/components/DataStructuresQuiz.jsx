import { useState } from "react";
import { questions, TOPICS } from "../data/questions";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DataStructuresQuiz() {
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [started, setStarted] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);

  const startQuiz = () => {
    const filtered =
      selectedTopic === "all"
        ? questions
        : questions.filter((q) => q.topicEn === selectedTopic);
    const shuffled = shuffle(filtered).slice(0, Math.min(questionCount, filtered.length));
    setQuizQuestions(shuffled);
    setCurrent(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
    setStarted(true);
  };

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    const isCorrect = idx === quizQuestions[current].answer;
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((a) => [...a, { correct: isCorrect, q: quizQuestions[current] }]);
  };

  const handleNext = () => {
    if (current + 1 >= quizQuestions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const getScoreColor = () => {
    const pct = score / quizQuestions.length;
    if (pct >= 0.8) return "#22c55e";
    if (pct >= 0.6) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreMessage = () => {
    const pct = score / quizQuestions.length;
    if (pct === 1) return "מושלם! 🏆 שלטת בחומר לחלוטין!";
    if (pct >= 0.8) return "כל הכבוד! 🌟 אתה מוכן היטב!";
    if (pct >= 0.6) return "יפה! 👍 כדאי לחזור על הנושאים שהחמצת.";
    return "המשך ללמוד 💪 עיין שוב בחומר ונסה שוב.";
  };

  // ===== WELCOME SCREEN =====
  if (!started) {
    return (
      <div style={styles.root}>
        <div style={styles.welcomeCard}>
          <div style={styles.welcomeHeader}>
            <div style={styles.welcomeIcon}>🎓</div>
            <h1 style={styles.welcomeTitle}>מבני נתונים ואלגוריתמים ב׳</h1>
            <p style={styles.welcomeSubtitle}>חיזוק ידע בשאלות אמריקאיות</p>
          </div>

          <div style={styles.topicGrid}>
            {TOPICS.map((t) => (
              <button
                key={t.id}
                style={{
                  ...styles.topicBtn,
                  ...(selectedTopic === t.id ? styles.topicBtnActive : {}),
                }}
                onClick={() => setSelectedTopic(t.id)}
              >
                <span style={styles.topicEmoji}>{t.emoji}</span>
                <span style={styles.topicLabel}>{t.label}</span>
                <span style={styles.topicCount}>
                  {t.id === "all"
                    ? questions.length
                    : questions.filter((q) => q.topicEn === t.id).length}{" "}
                  שאלות
                </span>
              </button>
            ))}
          </div>

          <div style={styles.countRow}>
            <span style={styles.countLabel}>מספר שאלות:</span>
            {[5, 10, 15, 20].map((n) => (
              <button
                key={n}
                style={{
                  ...styles.countBtn,
                  ...(questionCount === n ? styles.countBtnActive : {}),
                }}
                onClick={() => setQuestionCount(n)}
              >
                {n}
              </button>
            ))}
          </div>

          <button style={styles.startBtn} onClick={startQuiz}>
            🚀 התחל חידון
          </button>
        </div>
      </div>
    );
  }

  // ===== RESULTS SCREEN =====
  if (finished) {
    return (
      <div style={styles.root}>
        <div style={styles.resultsCard}>
          <div style={styles.scoreCircle}>
            <span style={{ ...styles.scoreNum, color: getScoreColor() }}>
              {score}/{quizQuestions.length}
            </span>
            <span style={styles.scoreLabel}>ציון</span>
          </div>

          <p style={styles.scoreMsg}>{getScoreMessage()}</p>

          <div style={styles.wrongList}>
            {answers.filter((a) => !a.correct).length > 0 && (
              <>
                <h3 style={styles.wrongTitle}>❌ שאלות שהחמצת:</h3>
                {answers
                  .filter((a) => !a.correct)
                  .map((a, i) => (
                    <div key={i} style={styles.wrongItem}>
                      <div style={styles.wrongQ}>🔹 {a.q.question}</div>
                      <div style={styles.wrongA}>✅ תשובה נכונה: {a.q.options[a.q.answer]}</div>
                    </div>
                  ))}
              </>
            )}
          </div>

          <div style={styles.resultsBtns}>
            <button style={styles.startBtn} onClick={startQuiz}>
              🔄 נסה שוב
            </button>
            <button
              style={styles.backBtn}
              onClick={() => {
                setStarted(false);
                setFinished(false);
              }}
            >
              🏠 תפריט ראשי
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== QUIZ SCREEN =====
  const q = quizQuestions[current];
  const progress = ((current + 1) / quizQuestions.length) * 100;

  return (
    <div style={styles.root}>
      <div style={styles.quizCard}>
        <div style={styles.quizHeader}>
          <div style={styles.progressRow}>
            <span style={styles.progressText}>
              שאלה {current + 1} / {quizQuestions.length}
            </span>
            <span style={styles.scoreDisplay}>✅ {score} נכון</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
          <div style={styles.topicTag}>{q.topic}</div>
        </div>

        <div style={styles.questionBox}>
          <p style={styles.questionText}>{q.question}</p>
        </div>

        <div style={styles.optionsList}>
          {q.options.map((opt, idx) => {
            let optStyle = styles.option;
            if (selected !== null) {
              if (idx === q.answer) optStyle = { ...styles.option, ...styles.optionCorrect };
              else if (idx === selected && selected !== q.answer)
                optStyle = { ...styles.option, ...styles.optionWrong };
              else optStyle = { ...styles.option, ...styles.optionDisabled };
            }
            return (
              <button key={idx} style={optStyle} onClick={() => handleSelect(idx)}>
                <span style={styles.optionLetter}>{["א", "ב", "ג", "ד"][idx]}</span>
                <span style={styles.optionText}>{opt}</span>
                {selected !== null && idx === q.answer && (
                  <span style={styles.optionIcon}>✓</span>
                )}
                {selected !== null && idx === selected && selected !== q.answer && (
                  <span style={styles.optionIcon}>✗</span>
                )}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div style={styles.explanation}>
            <span style={styles.explanationIcon}>💡</span>
            <p style={styles.explanationText}>{q.explanation}</p>
          </div>
        )}

        {selected !== null && (
          <button style={styles.nextBtn} onClick={handleNext}>
            {current + 1 === quizQuestions.length ? "📊 ראה תוצאות" : "הבא ←"}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', 'Arial', sans-serif",
    direction: "rtl",
  },
  welcomeCard: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: "24px",
    padding: "40px 32px",
    maxWidth: "520px",
    width: "100%",
    boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
  },
  welcomeHeader: { textAlign: "center", marginBottom: "32px" },
  welcomeIcon: { fontSize: "56px", marginBottom: "12px" },
  welcomeTitle: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#1e1b4b",
    margin: "0 0 8px",
    lineHeight: 1.3,
  },
  welcomeSubtitle: { fontSize: "15px", color: "#6b7280", margin: 0 },
  topicGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "24px",
  },
  topicBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "14px 10px",
    border: "2px solid #e5e7eb",
    borderRadius: "14px",
    background: "#f9fafb",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  topicBtnActive: {
    border: "2px solid #4f46e5",
    background: "#eef2ff",
    boxShadow: "0 0 0 3px rgba(79,70,229,0.15)",
  },
  topicEmoji: { fontSize: "26px", marginBottom: "6px" },
  topicLabel: { fontSize: "13px", fontWeight: "700", color: "#1f2937", marginBottom: "3px" },
  topicCount: { fontSize: "11px", color: "#9ca3af" },
  countRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },
  countLabel: { fontSize: "14px", color: "#374151", fontWeight: "600" },
  countBtn: {
    padding: "8px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    background: "#f9fafb",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    color: "#374151",
  },
  countBtnActive: { border: "2px solid #4f46e5", background: "#4f46e5", color: "#fff" },
  startBtn: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "17px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(79,70,229,0.35)",
    marginBottom: "10px",
  },
  backBtn: {
    width: "100%",
    padding: "14px",
    background: "#f3f4f6",
    color: "#374151",
    border: "2px solid #e5e7eb",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },
  quizCard: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: "24px",
    padding: "32px 28px",
    maxWidth: "560px",
    width: "100%",
    boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
  },
  quizHeader: { marginBottom: "24px" },
  progressRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  progressText: { fontSize: "13px", fontWeight: "600", color: "#6b7280" },
  scoreDisplay: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#16a34a",
    background: "#dcfce7",
    padding: "3px 10px",
    borderRadius: "20px",
  },
  progressBar: {
    height: "6px",
    background: "#e5e7eb",
    borderRadius: "99px",
    overflow: "hidden",
    marginBottom: "12px",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
    borderRadius: "99px",
    transition: "width 0.4s ease",
  },
  topicTag: {
    display: "inline-block",
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: "700",
    padding: "4px 12px",
    borderRadius: "20px",
  },
  questionBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
  },
  questionText: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#1e1b4b",
    margin: 0,
    lineHeight: 1.6,
  },
  optionsList: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" },
  option: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    background: "#fff",
    cursor: "pointer",
    textAlign: "right",
    transition: "all 0.15s",
    width: "100%",
  },
  optionCorrect: { border: "2px solid #16a34a", background: "#f0fdf4", cursor: "default" },
  optionWrong: { border: "2px solid #dc2626", background: "#fef2f2", cursor: "default" },
  optionDisabled: { opacity: 0.45, cursor: "default" },
  optionLetter: {
    minWidth: "30px",
    height: "30px",
    background: "#f3f4f6",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "800",
    color: "#4f46e5",
    flexShrink: 0,
  },
  optionText: { flex: 1, fontSize: "15px", color: "#1f2937", lineHeight: 1.4 },
  optionIcon: { fontSize: "18px", fontWeight: "900", flexShrink: 0 },
  explanation: {
    display: "flex",
    gap: "10px",
    background: "#fffbeb",
    border: "1px solid #fcd34d",
    borderRadius: "12px",
    padding: "14px 16px",
    marginBottom: "16px",
    alignItems: "flex-start",
  },
  explanationIcon: { fontSize: "20px", flexShrink: 0 },
  explanationText: { margin: 0, fontSize: "14px", color: "#92400e", lineHeight: 1.6 },
  nextBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(79,70,229,0.3)",
  },
  resultsCard: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: "24px",
    padding: "40px 32px",
    maxWidth: "520px",
    width: "100%",
    boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
  scoreCircle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "6px solid #e5e7eb",
    margin: "0 auto 20px",
    background: "#f9fafb",
  },
  scoreNum: { fontSize: "28px", fontWeight: "900", lineHeight: 1 },
  scoreLabel: { fontSize: "12px", color: "#9ca3af", fontWeight: "600" },
  scoreMsg: { fontSize: "18px", fontWeight: "700", color: "#1e1b4b", marginBottom: "24px" },
  wrongList: { textAlign: "right", marginBottom: "24px" },
  wrongTitle: { fontSize: "16px", fontWeight: "800", color: "#dc2626", marginBottom: "14px" },
  wrongItem: {
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: "12px",
    padding: "12px 14px",
    marginBottom: "10px",
  },
  wrongQ: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "6px",
    lineHeight: 1.4,
  },
  wrongA: { fontSize: "13px", color: "#16a34a", fontWeight: "600" },
  resultsBtns: { display: "flex", flexDirection: "column", gap: "10px" },
};
