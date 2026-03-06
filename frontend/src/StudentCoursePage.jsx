import { useState, useEffect, useRef } from "react";
import api from "./api/axios";
import axios from "axios";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const d = {
    book:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    video:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    test:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    back:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
    arrow:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    check:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    cert:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
    warn:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    lock:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    upload: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    file:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    clock:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  };
  return d[name] || null;
};

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.75s" repeatCount="indefinite"/>
        </path>
      </svg>
    </div>
  );
}

function TypeBadge({ type }) {
  const cfg = { video: ["#EFF6FF","#3B82F6","Відео"], text: ["#ECFDF5","#10B981","Текст"], test: ["#FFFBEB","#F59E0B","Тест"] };
  const [bg, color, label] = cfg[type] || ["#F3F4F6","#6B7280", type];
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{label.toUpperCase()}</span>;
}

function getYouTubeId(url = "") {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return m ? m[1] : null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEXT VIEWER
// ═══════════════════════════════════════════════════════════════════════════════
function TextViewer({ item, onComplete, completed }) {
  if (!item.text_lesson) return (
    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 32, textAlign: "center", color: "#92400E" }}>
      <Icon name="warn" size={32} color="#F59E0B" />
      <p style={{ marginTop: 12, fontSize: 15 }}>Викладач ще не додав текст до цього уроку.</p>
    </div>
  );

  return (
    <div>
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "36px 42px", marginBottom: 24 }}>
        <div style={{ fontSize: 16, color: "#374151", lineHeight: 1.9, whiteSpace: "pre-wrap", fontFamily: "Georgia, 'Times New Roman', serif" }}>
          {item.text_lesson.content}
        </div>
      </div>
      {!completed && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onComplete}
            style={{ background: "#059669", color: "#fff", border: "none", borderRadius: 10, padding: "11px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="check" size={15} color="#fff" /> Позначити як прочитано
          </button>
        </div>
      )}
      {completed && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span style={{ background: "#ECFDF5", color: "#059669", borderRadius: 10, padding: "11px 20px", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="check" size={15} color="#059669" /> Прочитано
          </span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO VIEWER
// ═══════════════════════════════════════════════════════════════════════════════
function VideoViewer({ item, onComplete, completed }) {
  const lesson = item.video_lesson;
  if (!lesson) return (
    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 32, textAlign: "center", color: "#92400E" }}>
      <Icon name="warn" size={32} color="#F59E0B" />
      <p style={{ marginTop: 12, fontSize: 15 }}>Викладач ще не додав відео.</p>
    </div>
  );

  const ytId = getYouTubeId(lesson.video_url);

  return (
    <div>
      <div style={{ borderRadius: 14, overflow: "hidden", background: "#000", aspectRatio: "16/9", marginBottom: 20 }}>
        {ytId ? (
          <iframe width="100%" height="100%"
            src={`https://www.youtube.com/embed/${ytId}`}
            title={item.title} frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen style={{ display: "block" }}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#fff", gap: 12, padding: 40 }}>
            <Icon name="video" size={48} color="#9CA3AF" />
            <a href={lesson.video_url} target="_blank" rel="noopener noreferrer"
              style={{ color: "#60A5FA", fontSize: 14, textDecoration: "underline" }}>
              Відкрити відео за посиланням →
            </a>
          </div>
        )}
      </div>
      {lesson.description && (
        <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "16px 20px", fontSize: 14, color: "#6B7280", lineHeight: 1.7, marginBottom: 20 }}>
          {lesson.description}
        </div>
      )}
      {!completed && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onComplete}
            style={{ background: "#059669", color: "#fff", border: "none", borderRadius: 10, padding: "11px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="check" size={15} color="#fff" /> Відео переглянуто
          </button>
        </div>
      )}
      {completed && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span style={{ background: "#ECFDF5", color: "#059669", borderRadius: 10, padding: "11px 20px", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="check" size={15} color="#059669" /> Переглянуто
          </span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST VIEWER — з файловими відповідями і збереженням спроби
// ═══════════════════════════════════════════════════════════════════════════════
function TestViewer({ item, courseId, onComplete }) {
  const [test, setTest]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [answers, setAnswers]   = useState({});
  const [fileAnswers, setFileAnswers] = useState({}); // { qId: File }
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState("");
  const [attemptId, setAttemptId] = useState(null);
  const fileRefs = useRef({});

  useEffect(() => {
    // Try to get test for this specific course_item
    api.get(`/tests/course/${courseId}/`)
      .then(({ data }) => {
        setTest(data);
        const init = {};
        data.questions.forEach(q => { init[q.id] = { selected: [], text: "" }; });
        setAnswers(init);
      })
      .catch(() => setError("Тест ще не створено для цього блоку."))
      .finally(() => setLoading(false));
  }, [courseId, item.id]);

  const toggleOpt = (qId, optId, single) => {
    setAnswers(prev => {
      const cur = prev[qId]?.selected || [];
      return {
        ...prev,
        [qId]: { ...prev[qId], selected: single ? [optId] : cur.includes(optId) ? cur.filter(x => x !== optId) : [...cur, optId] }
      };
    });
  };

  const handleFileChange = (qId, file) => {
    setFileAnswers(prev => ({ ...prev, [qId]: file }));
  };

  const handleSubmit = async () => {
    setSubmitting(true); setError("");
    try {
      // Step 1: submit text/choice answers
      const payload = {
        test_id: test.id,
        answers: test.questions
          .filter(q => q.question_type !== "file")
          .map(q => ({
            question_id: q.id,
            selected_option_ids: answers[q.id]?.selected || [],
            text_answer: answers[q.id]?.text || "",
          })),
      };
      const { data: submitData } = await api.post("/tests/submit/", payload);
      const aid = submitData.attempt_id || submitData.id;
      setAttemptId(aid);

      // Step 2: upload files if any
      const fileQuestions = test.questions.filter(q => q.question_type === "file" && fileAnswers[q.id]);
      for (const q of fileQuestions) {
        const formData = new FormData();
        formData.append("question_id", q.id);
        formData.append("attempt_id", aid);
        formData.append("file", fileAnswers[q.id]);
        await api.post("/answers/upload-file/", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      setResult(submitData);
      setSubmitted(true);
      // Mark item as complete after submitting test
      onComplete();
    } catch (e) {
      setError(e.response?.data?.detail || JSON.stringify(e.response?.data) || "Помилка подачі тесту");
    }
    setSubmitting(false);
  };

  if (loading) return <Spinner />;

  if (error && !test) return (
    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 32, textAlign: "center", color: "#92400E" }}>
      <Icon name="warn" size={32} color="#F59E0B" />
      <p style={{ marginTop: 12, fontSize: 15 }}>{error}</p>
    </div>
  );

  // ── Result screen ────────────────────────────────────────────────────────────
  if (submitted && result) {
    const needsCheck = result.status === "checking" || result.status === "submitted";
    const passed = result.passed;

    return (
      <div style={{ textAlign: "center", padding: "56px 24px" }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: needsCheck ? "#FFFBEB" : passed ? "#ECFDF5" : "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", border: `3px solid ${needsCheck ? "#FDE68A" : passed ? "#A7F3D0" : "#FECACA"}` }}>
          {needsCheck ? <Icon name="clock" size={40} color="#F59E0B" />
            : passed  ? <Icon name="cert"  size={40} color="#059669" />
            :            <Icon name="warn"  size={40} color="#DC2626" />}
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: "#111827", marginBottom: 10 }}>
          {needsCheck ? "Тест подано на перевірку!" : passed ? "Тест складено успішно!" : "Тест не складено"}
        </h2>
        {result.total_score !== undefined && (
          <p style={{ fontSize: 16, color: "#6B7280", marginBottom: 8 }}>
            Результат: <strong style={{ color: "#111827" }}>{result.total_score}</strong> балів
          </p>
        )}
        <p style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 28 }}>
          Статус:{" "}
          <span style={{ fontWeight: 600, color: needsCheck ? "#F59E0B" : passed ? "#059669" : "#DC2626" }}>
            {needsCheck ? "Очікує перевірки викладача" : passed ? "Пройдено ✓" : "Не пройдено"}
          </span>
        </p>
        {needsCheck && (
          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "16px 24px", display: "inline-block", fontSize: 14, color: "#92400E", marginBottom: 16 }}>
            ⏳ Викладач перевірить відповіді та виставить оцінку. Результат з'явиться у вашому профілі.
          </div>
        )}
        {passed && !needsCheck && (
          <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 12, padding: "16px 24px", display: "inline-block", fontSize: 14, color: "#059669" }}>
            🎓 Сертифікат доступний у розділі «Сертифікати»
          </div>
        )}
      </div>
    );
  }

  const QTYPE_LABEL = {
    single_choice: "Одна правильна відповідь",
    multiple_choice: "Декілька правильних відповідей",
    text: "Текстова відповідь (перевіряється викладачем)",
    file: "Файлова відповідь (перевіряється викладачем)",
  };

  return (
    <div>
      {/* Test meta */}
      <div style={{ background: "#F9FAFB", borderRadius: 12, padding: "20px 24px", marginBottom: 24, border: "1px solid #E5E7EB" }}>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 20, color: "#111827", marginBottom: 6 }}>{test.title}</h3>
        {test.description && <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>{test.description}</p>}
        <div style={{ fontSize: 13, color: "#9CA3AF" }}>
          {test.questions.length} питань · Прохідний бал: {test.passing_score}%
        </div>
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#DC2626", marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Questions */}
      {test.questions.map((q, qi) => (
        <div key={q.id} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "22px 24px", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#111827", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 700 }}>{qi + 1}</div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 15, color: "#111827", lineHeight: 1.5, marginBottom: 4 }}>{q.text}</p>
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>{QTYPE_LABEL[q.question_type]} · {q.max_score} {q.max_score === 1 ? "бал" : "балів"}</span>
            </div>
          </div>

          {/* Single / Multiple choice */}
          {["single_choice", "multiple_choice"].includes(q.question_type) && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 42 }}>
              {q.options.map(opt => {
                const sel = answers[q.id]?.selected?.includes(opt.id);
                return (
                  <div key={opt.id} onClick={() => toggleOpt(q.id, opt.id, q.question_type === "single_choice")}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: `2px solid ${sel ? "#111827" : "#E5E7EB"}`, background: sel ? "#F9FAFB" : "#fff", cursor: "pointer" }}>
                    <div style={{ width: 20, height: 20, borderRadius: q.question_type === "single_choice" ? "50%" : 4, border: `2px solid ${sel ? "#111827" : "#D1D5DB"}`, background: sel ? "#111827" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {sel && <Icon name="check" size={11} color="#fff" />}
                    </div>
                    <span style={{ fontSize: 14, color: "#374151", fontWeight: sel ? 600 : 400 }}>{opt.text}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Text answer */}
          {q.question_type === "text" && (
            <div style={{ paddingLeft: 42 }}>
              <textarea value={answers[q.id]?.text || ""} rows={4}
                onChange={e => setAnswers(prev => ({ ...prev, [q.id]: { ...prev[q.id], text: e.target.value } }))}
                placeholder="Введіть вашу відповідь..."
                style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #D1D5DB", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }}
              />
              <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>Буде перевірена викладачем вручну</p>
            </div>
          )}

          {/* File answer */}
          {q.question_type === "file" && (
            <div style={{ paddingLeft: 42 }}>
              <input type="file" ref={el => fileRefs.current[q.id] = el} style={{ display: "none" }}
                onChange={e => handleFileChange(q.id, e.target.files[0])} />
              <div style={{ border: "2px dashed #D1D5DB", borderRadius: 10, padding: "24px", textAlign: "center", cursor: "pointer", background: fileAnswers[q.id] ? "#ECFDF5" : "#F9FAFB" }}
                onClick={() => fileRefs.current[q.id]?.click()}>
                {fileAnswers[q.id] ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "#059669" }}>
                    <Icon name="file" size={22} color="#059669" />
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{fileAnswers[q.id].name}</div>
                      <div style={{ fontSize: 12 }}>{(fileAnswers[q.id].size / 1024).toFixed(1)} KB</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setFileAnswers(p => { const n = {...p}; delete n[q.id]; return n; }); }}
                      style={{ marginLeft: 8, background: "transparent", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 18 }}>×</button>
                  </div>
                ) : (
                  <div style={{ color: "#6B7280" }}>
                    <Icon name="upload" size={28} color="#9CA3AF" />
                    <p style={{ marginTop: 8, fontSize: 14, fontWeight: 600 }}>Натисніть щоб обрати файл</p>
                    <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>Перевіряється викладачем вручну</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button onClick={handleSubmit} disabled={submitting}
          style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 15, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8, opacity: submitting ? 0.6 : 1 }}>
          {submitting ? "Відправка..." : <><Icon name="check" size={16} color="#fff" />Подати тест</>}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN StudentCoursePage
// ═══════════════════════════════════════════════════════════════════════════════
export default function StudentCoursePage({ courseId, setPage }) {
  const [course, setCourse]           = useState(null);
  const [items, setItems]             = useState([]);
  const [activeIdx, setActiveIdx]     = useState(0);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [loading, setLoading]         = useState(true);
  const [accessError, setAccessError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [{ data: allCourses }, { data: courseItems }, { data: progress }] = await Promise.all([
          api.get("/courses/"),
          api.get(`/courses/${courseId}/items/`),
          api.get(`/courses/${courseId}/progress/`),
        ]);
        const found = allCourses.find(c => c.id === parseInt(courseId));
        if (found) setCourse(found);
        setItems(courseItems);
        setCompletedIds(new Set(progress.completed_item_ids));
      } catch (e) {
        if (e.response?.status === 403) {
          setAccessError("Доступ до курсу ще не підтверджений викладачем. Зачекайте підтвердження.");
        } else {
          setAccessError("Не вдалося завантажити матеріали курсу.");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  const markComplete = async (itemId) => {
    try {
      await api.post(`/course-items/${itemId}/complete/`);
      setCompletedIds(prev => new Set([...prev, itemId]));
    } catch (e) {
      console.error("Помилка збереження прогресу:", e);
    }
  };

  const activeItem = items[activeIdx];
  const totalDone = items.filter(i => completedIds.has(i.id)).length;
  const pct = items.length > 0 ? Math.round((totalDone / items.length) * 100) : 0;

  const iconMap = { video: "video", text: "book", test: "test" };

  if (loading) return <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}><Spinner /></div>;

  if (accessError) return (
    <div style={{ maxWidth: 600, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <Icon name="lock" size={28} color="#F59E0B" />
      </div>
      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Доступ обмежено</h2>
      <p style={{ fontSize: 15, color: "#6B7280", marginBottom: 28, lineHeight: 1.7 }}>{accessError}</p>
      <button onClick={() => setPage(`course-${courseId}`)}
        style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}>
        ← Повернутися до опису курсу
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px", display: "grid", gridTemplateColumns: "290px 1fr", gap: 28, alignItems: "start" }}>

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <div style={{ position: "sticky", top: 80 }}>
        <button onClick={() => setPage(`course-${courseId}`)}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13, fontFamily: "inherit", marginBottom: 16, padding: 0 }}>
          <Icon name="back" size={14} /> До опису курсу
        </button>

        {course && (
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 15, color: "#111827", lineHeight: 1.4, marginBottom: 14 }}>{course.title}</h2>
        )}

        {/* Progress */}
        <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "12px 14px", marginBottom: 16, border: "1px solid #E5E7EB" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6B7280", marginBottom: 7 }}>
            <span>Прогрес</span>
            <span style={{ fontWeight: 700, color: pct === 100 ? "#059669" : "#111827" }}>{pct}%</span>
          </div>
          <div style={{ background: "#E5E7EB", borderRadius: 4, height: 6 }}>
            <div style={{ background: pct === 100 ? "#059669" : "#111827", borderRadius: 4, height: "100%", width: `${pct}%`, transition: "width 0.4s ease" }} />
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>{totalDone} з {items.length} розділів завершено</div>
        </div>

        {/* Item list */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {items.map((item, idx) => {
            const isActive = idx === activeIdx;
            const isDone = completedIds.has(item.id);
            return (
              <button key={item.id} onClick={() => setActiveIdx(idx)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: `1px solid ${isActive ? "#111827" : "transparent"}`, background: isActive ? "#111827" : "#fff", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: isActive ? "rgba(255,255,255,0.15)" : isDone ? "#ECFDF5" : "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {isDone
                    ? <Icon name="check" size={13} color="#059669" />
                    : <Icon name={iconMap[item.item_type] || "book"} size={13} color={isActive ? "#fff" : "#9CA3AF"} />}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isActive ? "#fff" : "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: isActive ? "rgba(255,255,255,0.6)" : isDone ? "#059669" : "#9CA3AF", marginTop: 1 }}>
                    {isDone ? "✓ Завершено" : item.item_type === "video" ? "Відео" : item.item_type === "text" ? "Текст" : "Тест"}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div>
        {!activeItem ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#9CA3AF" }}>
            <p>Оберіть розділ зліва для початку навчання</p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <TypeBadge type={activeItem.item_type} />
              <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 24, color: "#111827", letterSpacing: "-0.02em" }}>
                {activeItem.title}
              </h1>
              {completedIds.has(activeItem.id) && (
                <span style={{ marginLeft: "auto", background: "#ECFDF5", color: "#059669", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon name="check" size={13} color="#059669" /> Завершено
                </span>
              )}
            </div>

            {activeItem.item_type === "text" && (
              <TextViewer item={activeItem} completed={completedIds.has(activeItem.id)}
                onComplete={() => markComplete(activeItem.id)} />
            )}
            {activeItem.item_type === "video" && (
              <VideoViewer item={activeItem} completed={completedIds.has(activeItem.id)}
                onComplete={() => markComplete(activeItem.id)} />
            )}
            {activeItem.item_type === "test" && (
              <TestViewer item={activeItem} courseId={courseId}
                onComplete={() => markComplete(activeItem.id)} />
            )}

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 24, borderTop: "1px solid #E5E7EB" }}>
              <button onClick={() => setActiveIdx(i => Math.max(0, i - 1))} disabled={activeIdx === 0}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "1px solid #D1D5DB", borderRadius: 10, padding: "11px 20px", cursor: activeIdx === 0 ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 600, color: activeIdx === 0 ? "#D1D5DB" : "#374151", fontFamily: "inherit" }}>
                <Icon name="back" size={15} color={activeIdx === 0 ? "#D1D5DB" : "#374151"} /> Попередній
              </button>

              {activeIdx < items.length - 1 ? (
                <button onClick={() => setActiveIdx(i => i + 1)}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "#111827", color: "#fff", border: "none", borderRadius: 10, padding: "11px 22px", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}>
                  Наступний <Icon name="arrow" size={15} color="#fff" />
                </button>
              ) : (
                <button onClick={() => setPage("certificates")}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "#059669", color: "#fff", border: "none", borderRadius: 10, padding: "11px 22px", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}>
                  <Icon name="cert" size={15} color="#fff" /> Мої сертифікати
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
