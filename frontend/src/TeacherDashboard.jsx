import { useState, useEffect } from "react";
import axios from "axios";
import api from "./api/axios";



const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const d = {
    plus:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    book:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    video:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    test:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    users:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    check:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    x:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    back:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
    grad:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
    trash:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
    warn:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    drag:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="9" cy="5" r="1" fill={color}/><circle cx="9" cy="12" r="1" fill={color}/><circle cx="9" cy="19" r="1" fill={color}/><circle cx="15" cy="5" r="1" fill={color}/><circle cx="15" cy="12" r="1" fill={color}/><circle cx="15" cy="19" r="1" fill={color}/></svg>,
    review: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    up: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>,
    down: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>,
    file:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>,
  };
  return d[name] || null;
};

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.75s" repeatCount="indefinite"/>
        </path>
      </svg>
    </div>
  );
}

function Err({ msg }) {
  if (!msg) return null;
  return <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "11px 14px", fontSize: 13, color: "#DC2626", display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}><Icon name="warn" size={15} color="#DC2626" />{msg}</div>;
}
function Ok({ msg }) {
  if (!msg) return null;
  return <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10, padding: "11px 14px", fontSize: 13, color: "#059669", display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}><Icon name="check" size={15} color="#059669" />{msg}</div>;
}

function Btn({ onClick, children, variant = "primary", disabled = false, small = false, fullWidth = false }) {
  const S = { primary: { background: "#111827", color: "#fff", border: "none" }, secondary: { background: "#fff", color: "#374151", border: "1px solid #D1D5DB" }, danger: { background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }, success: { background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" } };
  return <button onClick={onClick} disabled={disabled} style={{ ...S[variant], borderRadius: 8, padding: small ? "6px 12px" : "10px 18px", cursor: disabled ? "not-allowed" : "pointer", fontSize: small ? 13 : 14, fontWeight: 600, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6, opacity: disabled ? 0.55 : 1, width: fullWidth ? "100%" : "auto", justifyContent: fullWidth ? "center" : "flex-start" }}>{children}</button>;
}

const inputStyle = { width: "100%", padding: "10px 13px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" };

function Input({ label, value, onChange, type = "text", placeholder = "", required = false }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{label}{required && <span style={{ color: "#DC2626" }}> *</span>}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 4, placeholder = "" }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{label}</label>}
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} style={{ ...inputStyle, resize: "vertical" }} />
    </div>
  );
}

function TypeBadge({ type }) {
  const cfg = { video: ["#EFF6FF", "#3B82F6", "Відео"], text: ["#ECFDF5", "#10B981", "Текст"], test: ["#FFFBEB", "#F59E0B", "Тест"] };
  const [bg, color, label] = cfg[type] || ["#F3F4F6", "#6B7280", type];
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20 }}>{label.toUpperCase()}</span>;
}

function Modal({ title, onClose, children, width = 560 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: width, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #E5E7EB", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 18, color: "#111827" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="x" size={16} /></button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function parseError(e) {
  const d = e.response?.data;
  if (!d) return "Помилка сервера";
  if (typeof d === "string") return d;
  return Object.values(d).flat().join(" ");
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST REVIEW PANEL — перевірка відповідей студентів
// ═══════════════════════════════════════════════════════════════════════════════
function TestReviewPanel({ course }) {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [selected, setSelected] = useState(null); // selected attempt to review
  const [scores, setScores]     = useState({});   // { answerId: { score, is_correct } }
  const [saving, setSaving]     = useState(null);
  const [savedOk, setSavedOk]   = useState("");

  useEffect(() => {
    api.get(`/courses/${course.id}/attempts/`)
      .then(({ data }) => setAttempts(data))
      .catch(() => setError("Не вдалося завантажити спроби"))
      .finally(() => setLoading(false));
  }, [course.id]);

  const openAttempt = (attempt) => {
    setSelected(attempt);
    setSavedOk("");
    // Init scores from existing values
    const init = {};
    attempt.answers.forEach(a => {
      init[a.id] = { score: a.awarded_score ?? 0, is_correct: a.is_correct ?? false };
    });
    setScores(init);
  };

  const saveAnswer = async (answerId) => {
    setSaving(answerId);
    try {
      await api.post(`/answers/${answerId}/check/`, {
        awarded_score: parseFloat(scores[answerId]?.score) || 0,
        is_correct: scores[answerId]?.is_correct || false,
      });
      // Refresh attempts
      const { data } = await api.get(`/courses/${course.id}/attempts/`);
      setAttempts(data);
      const updated = data.find(a => a.id === selected.id);
      if (updated) setSelected(updated);
      setSavedOk(`Відповідь збережено`);
      setTimeout(() => setSavedOk(""), 2500);
    } catch (e) {
      setError(parseError(e));
    }
    setSaving(null);
  };

  const statusLabel = { submitted: ["#FFFBEB","#92400E","Подано"], checking: ["#EFF6FF","#1D4ED8","Перевіряється"], checked: ["#ECFDF5","#059669","Перевірено"] };
  const qTypeLabel  = { single_choice: "Вибір одного", multiple_choice: "Вибір декількох", text: "Текстова", file: "Файлова" };

  if (selected) {
    const needsManual = selected.answers.filter(a => ["text","file"].includes(a.question_type) && !a.is_checked);
    const [stBg, stColor, stLabel] = statusLabel[selected.status] || ["#F3F4F6","#6B7280","—"];

    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 13, fontFamily: "inherit", marginBottom: 20, padding: 0 }}>
          <Icon name="back" size={14} /> Назад до списку
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, padding: "16px 20px", background: "#F9FAFB", borderRadius: 12, border: "1px solid #E5E7EB" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>{selected.student_username || `Студент #${selected.student}`}</div>
            <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 3 }}>Тест: {selected.test_title}</div>
          </div>
          <span style={{ background: stBg, color: stColor, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>{stLabel}</span>
          {selected.total_score !== null && selected.total_score !== undefined && (
            <span style={{ fontSize: 14, fontWeight: 700, color: selected.passed ? "#059669" : "#DC2626" }}>
              {selected.total_score} балів · {selected.passed ? "Здано ✓" : "Не здано ✗"}
            </span>
          )}
        </div>

        <Err msg={error} />
        <Ok msg={savedOk} />

        {needsManual.length > 0 && (
          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#92400E", marginBottom: 20 }}>
            ⚠ {needsManual.length} відповіді очікують вашої перевірки (позначені нижче)
          </div>
        )}

        {selected.answers.map((ans, idx) => {
          const needsCheck = ["text","file"].includes(ans.question_type) && !ans.is_checked;
          const isAuto = ["single_choice","multiple_choice"].includes(ans.question_type);
          const sc = scores[ans.id] || { score: ans.awarded_score ?? 0, is_correct: ans.is_correct ?? false };

          return (
            <div key={ans.id} style={{ border: `1.5px solid ${needsCheck ? "#FDE68A" : ans.is_checked ? "#A7F3D0" : "#E5E7EB"}`, borderRadius: 12, padding: "20px 22px", marginBottom: 16, background: needsCheck ? "#FFFBEB" : "#fff" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#111827", color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{idx + 1}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 3 }}>{ans.question_text}</p>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{qTypeLabel[ans.question_type]} · макс. {/* we don't have max_score here, just show what was awarded */}</span>
                </div>
                {ans.is_checked && (
                  <span style={{ background: "#ECFDF5", color: "#059669", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                    ✓ Перевірено: {ans.awarded_score} б.
                  </span>
                )}
                {needsCheck && (
                  <span style={{ background: "#FFFBEB", color: "#D97706", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                    ⚠ Потребує перевірки
                  </span>
                )}
              </div>

              {/* Student answer display */}
              <div style={{ paddingLeft: 38 }}>
                {/* Choice answers */}
                {ans.selected_options && ans.selected_options.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6, fontWeight: 600 }}>Вибрані варіанти:</div>
                    {ans.selected_options.map(o => (
                      <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#F9FAFB", borderRadius: 8, marginBottom: 4, fontSize: 13, color: "#374151" }}>
                        <Icon name="check" size={13} color={isAuto && ans.is_correct ? "#059669" : "#9CA3AF"} />
                        {o.option_text}
                      </div>
                    ))}
                  </div>
                )}

                {/* Text answer */}
                {ans.text_answer && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6, fontWeight: 600 }}>Текстова відповідь студента:</div>
                    <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, padding: "14px 16px", fontSize: 14, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                      {ans.text_answer}
                    </div>
                  </div>
                )}

                {/* File answer */}
                {ans.file_answer && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6, fontWeight: 600 }}>Файл студента:</div>
                    <a href={`http://localhost:8000${ans.file_answer}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, padding: "8px 14px", textDecoration: "none", color: "#1D4ED8", fontSize: 13, fontWeight: 600 }}>
                      <Icon name="file" size={15} color="#1D4ED8" />
                      Завантажити файл
                    </a>
                  </div>
                )}

                {/* Auto-checked display */}
                {isAuto && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6B7280" }}>
                    <span style={{ fontWeight: 600 }}>Авто-перевірка:</span>
                    <span style={{ color: ans.is_correct ? "#059669" : "#DC2626", fontWeight: 700 }}>
                      {ans.is_correct ? "✓ Правильно" : "✗ Неправильно"}
                    </span>
                    <span>· {ans.awarded_score} балів</span>
                  </div>
                )}

                {/* Manual check form */}
                {["text","file"].includes(ans.question_type) && (
                  <div style={{ marginTop: 14, padding: "16px", background: "#F9FAFB", borderRadius: 10, border: "1px solid #E5E7EB" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>Ваша оцінка:</div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                      <div>
                        <label style={{ display: "block", fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Балів</label>
                        <input type="number" min={0} step={0.5} value={sc.score}
                          onChange={e => setScores(p => ({ ...p, [ans.id]: { ...p[ans.id], score: e.target.value } }))}
                          style={{ width: 90, padding: "8px 12px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 14, fontFamily: "inherit" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Правильно?</label>
                        <div style={{ display: "flex", gap: 8 }}>
                          {[true, false].map(v => (
                            <div key={String(v)} onClick={() => setScores(p => ({ ...p, [ans.id]: { ...p[ans.id], is_correct: v } }))}
                              style={{ padding: "7px 14px", borderRadius: 8, border: `2px solid ${sc.is_correct === v ? "#111827" : "#E5E7EB"}`, background: sc.is_correct === v ? "#111827" : "#fff", color: sc.is_correct === v ? "#fff" : "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                              {v ? "Так" : "Ні"}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ alignSelf: "flex-end" }}>
                        <Btn onClick={() => saveAnswer(ans.id)} disabled={saving === ans.id} variant="primary" small>
                          {saving === ans.id ? "Збереження..." : <><Icon name="check" size={14} color="#fff" />Зберегти оцінку</>}
                        </Btn>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── Attempts list ────────────────────────────────────────────────────────────
  const [stBg, stColor, stLabel] = [null, null, null];
  const getStatus = (s) => ({ submitted: ["#FFFBEB","#92400E","Подано"], checking: ["#EFF6FF","#1D4ED8","Перевіряється"], checked: ["#ECFDF5","#059669","Перевірено"] }[s] || ["#F3F4F6","#6B7280","—"]);

  const pending = attempts.filter(a => a.status !== "checked");
  const checked = attempts.filter(a => a.status === "checked");

  return (
    <div>
      <Err msg={error} />
      {loading ? <Spinner /> : attempts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "56px 0", color: "#9CA3AF" }}>
          <Icon name="test" size={40} color="#D1D5DB" />
          <p style={{ marginTop: 12, fontSize: 14 }}>Студенти ще не здавали тести</p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ background: "#FEF2F2", color: "#DC2626", borderRadius: 20, padding: "2px 10px", fontSize: 12 }}>{pending.length}</span>
                Очікують перевірки
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {pending.map(a => {
                  const [bg, color, label] = getStatus(a.status);
                  return (
                    <div key={a.id} style={{ background: "#fff", border: "1.5px solid #FDE68A", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon name="users" size={18} color="#9CA3AF" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{a.student_username || `Студент #${a.student}`}</div>
                        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                          Тест: {a.test_title} · {a.completed_at ? new Date(a.completed_at).toLocaleString("uk-UA") : "—"}
                        </div>
                      </div>
                      <span style={{ background: bg, color, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>{label}</span>
                      <Btn small onClick={() => openAttempt(a)}>
                        <Icon name="review" size={14} color="#fff" /> Перевірити
                      </Btn>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {checked.length > 0 && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Перевірені ({checked.length})</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {checked.map(a => (
                  <div key={a.id} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: a.passed ? "#ECFDF5" : "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name={a.passed ? "check" : "x"} size={16} color={a.passed ? "#059669" : "#DC2626"} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{a.student_username || `Студент #${a.student}`}</div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                        {a.test_title} · {a.total_score} балів · {a.passed ? "Здано ✓" : "Не здано ✗"}
                      </div>
                    </div>
                    <Btn small variant="secondary" onClick={() => openAttempt(a)}>Переглянути</Btn>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENROLLMENTS PANEL
// ═══════════════════════════════════════════════════════════════════════════════
function EnrollmentsPanel({ course }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [acting, setActing]   = useState(null);
  const [ok, setOk]           = useState("");

  useEffect(() => {
    api.get(`/courses/${course.id}/enrollments/`)
      .then(({ data }) => setEnrollments(data))
      .catch(() => setError("Не вдалося завантажити список слухачів"))
      .finally(() => setLoading(false));
  }, [course.id]);

  const setStatus = async (id, status) => {
    setActing(id); setOk(""); setError("");
    try {
      const { data } = await api.patch(`/enrollments/${id}/status/`, { status });
      setEnrollments(p => p.map(e => e.id === id ? { ...e, status: data.status } : e));
      setOk(status === "approved" ? "Слухача прийнято!" : "Заявку відхилено");
      setTimeout(() => setOk(""), 2500);
    } catch { setError("Помилка зміни статусу"); }
    setActing(null);
  };

  const statusCfg = { pending: ["#FFFBEB","#92400E","Очікує"], approved: ["#ECFDF5","#059669","Прийнято"], completed: ["#EFF6FF","#1D4ED8","Завершено"], rejected: ["#FEF2F2","#DC2626","Відхилено"] };

  return (
    <div>
      <Err msg={error} />
      <Ok msg={ok} />
      {loading ? <Spinner /> : enrollments.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#9CA3AF" }}>
          <Icon name="users" size={40} color="#D1D5DB" />
          <p style={{ marginTop: 12, fontSize: 14 }}>Заявок на запис ще немає</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {enrollments.map(e => {
            const [bg, color, label] = statusCfg[e.status] || ["#F3F4F6","#6B7280","—"];
            return (
              <div key={e.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="users" size={17} color="#9CA3AF" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{e.student_username || `#${e.student}`}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{e.student_email} · {e.enrollment_date}</div>
                </div>
                <span style={{ background: bg, color, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>{label}</span>
                {e.status === "pending" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn small variant="success" disabled={acting === e.id} onClick={() => setStatus(e.id, "approved")}>
                      <Icon name="check" size={13} color="#059669" /> Прийняти
                    </Btn>
                    <Btn small variant="danger" disabled={acting === e.id} onClick={() => setStatus(e.id, "rejected")}>
                      <Icon name="x" size={13} color="#DC2626" /> Відхилити
                    </Btn>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODALS: CreateCourse / AddItem / AddText / AddVideo / CreateTest
// ═══════════════════════════════════════════════════════════════════════════════
function CreateCourseModal({ onClose, onCreated }) {
  const [f, setF] = useState({ title: "", description: "", start_date: "", end_date: "", duration_hours: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const upd = k => v => setF(p => ({ ...p, [k]: v }));
  const submit = async () => {
    if (!f.title || !f.start_date || !f.end_date || !f.duration_hours) { setError("Заповніть усі обов'язкові поля"); return; }
    setLoading(true); setError("");
    try {
      const { data: me } = await api.get("/users/me/");
      const { data } = await api.post("/courses/create/", { ...f, teacher: me.id, duration_hours: parseInt(f.duration_hours) });
      onCreated(data); onClose();
    } catch (e) { setError(parseError(e)); }
    setLoading(false);
  };
  return (
    <Modal title="Створити новий курс" onClose={onClose}>
      <Err msg={error} />
      <Input label="Назва курсу" value={f.title} onChange={upd("title")} required placeholder="Наприклад: Основи педагогіки" />
      <Textarea label="Опис" value={f.description} onChange={upd("description")} placeholder="Детальний опис..." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input label="Дата початку" value={f.start_date} onChange={upd("start_date")} type="date" required />
        <Input label="Дата завершення" value={f.end_date} onChange={upd("end_date")} type="date" required />
      </div>
      <Input label="Тривалість (годин)" value={f.duration_hours} onChange={upd("duration_hours")} type="number" required placeholder="40" />
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Скасувати</Btn>
        <Btn onClick={submit} disabled={loading}>{loading ? "..." : <><Icon name="plus" size={15} color="#fff"/>Створити</>}</Btn>
      </div>
    </Modal>
  );
}

function AddItemModal({ course, existingItems, onClose, onCreated }) {
  const [f, setF] = useState({ title: "", item_type: "text" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const TYPES = [{ v: "text", l: "Текстовий урок", icon: "book", c: "#10B981" }, { v: "video", l: "Відеоурок", icon: "video", c: "#3B82F6" }, { v: "test", l: "Тест", icon: "test", c: "#F59E0B" }];
  const submit = async () => {
    if (!f.title.trim()) { setError("Введіть назву"); return; }
    setLoading(true); setError("");
    try {
      const order = existingItems.length > 0 ? Math.max(...existingItems.map(i => i.order)) + 1 : 1;
      const { data } = await api.post("/course-items/create/", { course: course.id, title: f.title, item_type: f.item_type, order });
      onCreated(data); onClose();
    } catch (e) { setError(parseError(e)); }
    setLoading(false);
  };
  return (
    <Modal title="Додати розділ" onClose={onClose}>
      <Err msg={error} />
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Тип блоку</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {TYPES.map(t => (
            <div key={t.v} onClick={() => setF(p => ({ ...p, item_type: t.v }))}
              style={{ border: `2px solid ${f.item_type === t.v ? "#111827" : "#E5E7EB"}`, borderRadius: 10, padding: "14px 8px", cursor: "pointer", textAlign: "center", background: f.item_type === t.v ? "#F9FAFB" : "#fff" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: f.item_type === t.v ? "#111827" : "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                <Icon name={t.icon} size={17} color={f.item_type === t.v ? "#fff" : t.c} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{t.l}</div>
            </div>
          ))}
        </div>
      </div>
      <Input label="Назва розділу" value={f.title} onChange={v => setF(p => ({ ...p, title: v }))} required placeholder="Наприклад: Вступ" />
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Скасувати</Btn>
        <Btn onClick={submit} disabled={loading}>{loading ? "..." : <><Icon name="plus" size={15} color="#fff"/>Додати</>}</Btn>
      </div>
    </Modal>
  );
}

function AddTextModal({ item, onClose, onSaved }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submit = async () => {
    if (!content.trim()) { setError("Введіть текст"); return; }
    setLoading(true); setError("");
    try { await api.post("/text-lessons/create/", { course_item: item.id, content }); onSaved(); onClose(); }
    catch (e) { setError(parseError(e)); }
    setLoading(false);
  };
  return (
    <Modal title={`Текст: "${item.title}"`} onClose={onClose} width={720}>
      <Err msg={error} />
      <Textarea label="Зміст уроку" value={content} onChange={setContent} rows={14} placeholder="Введіть навчальний текст..." />
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Скасувати</Btn>
        <Btn onClick={submit} disabled={loading}>{loading ? "..." : <><Icon name="check" size={15} color="#fff"/>Зберегти</>}</Btn>
      </div>
    </Modal>
  );
}

function AddVideoModal({ item, onClose, onSaved }) {
  const [url, setUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submit = async () => {
    if (!url.trim()) { setError("Введіть URL"); return; }
    setLoading(true); setError("");
    try { await api.post("/video-lessons/create/", { course_item: item.id, video_url: url, description: desc }); onSaved(); onClose(); }
    catch (e) { setError(parseError(e)); }
    setLoading(false);
  };
  return (
    <Modal title={`Відео: "${item.title}"`} onClose={onClose}>
      <Err msg={error} />
      <Input label="URL відео (YouTube / Vimeo)" value={url} onChange={setUrl} required placeholder="https://youtube.com/watch?v=..." />
      {url.includes("youtube.com") && <div style={{ background: "#EFF6FF", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#3B82F6", marginBottom: 14 }}>▶ YouTube буде вбудовано через плеєр</div>}
      <Textarea label="Опис (необов'язково)" value={desc} onChange={setDesc} rows={3} placeholder="Короткий опис..." />
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Скасувати</Btn>
        <Btn onClick={submit} disabled={loading}>{loading ? "..." : <><Icon name="check" size={15} color="#fff"/>Зберегти</>}</Btn>
      </div>
    </Modal>
  );
}

function CreateTestModal({ item, course, onClose, onSaved }) {
  const [step, setStep] = useState(1);
  const [meta, setMeta] = useState({ title: item.title, description: "", passing_score: "60" });
  const [testId, setTestId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createTest = async () => {
    if (!meta.title.trim()) { setError("Введіть назву"); return; }
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/tests/create/", { course: course.id, course_item: item.id, title: meta.title, description: meta.description, passing_score: parseInt(meta.passing_score) || 60 });
      setTestId(data.id); setStep(2);
    } catch (e) { setError(parseError(e)); }
    setLoading(false);
  };

  const addQ = () => setQuestions(p => [...p, { text: "", question_type: "single_choice", max_score: "1", options: [{ text: "", is_correct: false }, { text: "", is_correct: false }] }]);
  const removeQ = qi => setQuestions(p => p.filter((_, i) => i !== qi));
  const setQ = (qi, k, v) => setQuestions(p => p.map((q, i) => i === qi ? { ...q, [k]: v } : q));
  const setOpt = (qi, oi, k, v) => setQuestions(p => p.map((q, i) => {
    if (i !== qi) return q;
    const opts = q.options.map((o, j) => k === "is_correct" && q.question_type === "single_choice" ? { ...o, is_correct: j === oi } : j === oi ? { ...o, [k]: v } : o);
    return { ...q, options: opts };
  }));
  const addOpt = qi => setQuestions(p => p.map((q, i) => i === qi ? { ...q, options: [...q.options, { text: "", is_correct: false }] } : q));
  const removeOpt = (qi, oi) => setQuestions(p => p.map((q, i) => i === qi ? { ...q, options: q.options.filter((_, j) => j !== oi) } : q));

  const saveAll = async () => {
    for (let i = 0; i < questions.length; i++) if (!questions[i].text.trim()) { setError(`Питання ${i + 1}: введіть текст`); return; }
    setLoading(true); setError("");
    try {
      for (let qi = 0; qi < questions.length; qi++) {
        const q = questions[qi];
        const { data: qd } = await api.post("/questions/create/", { test: testId, text: q.text, question_type: q.question_type, order: qi + 1, max_score: parseInt(q.max_score) || 1 });
        if (["single_choice","multiple_choice"].includes(q.question_type))
          for (const o of q.options) if (o.text.trim()) await api.post("/answer-options/create/", { question: qd.id, text: o.text, is_correct: o.is_correct });
      }
      onSaved(); onClose();
    } catch (e) { setError(parseError(e)); }
    setLoading(false);
  };

  const QTYPES = [{ v: "single_choice", l: "Одна правильна" }, { v: "multiple_choice", l: "Декілька правильних" }, { v: "text", l: "Текстова (ручна перевірка)" }, { v: "file", l: "Файлова (ручна перевірка)" }];

  return (
    <Modal title={step === 1 ? "Налаштування тесту" : "Питання"} onClose={onClose} width={700}>
      <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "1px solid #E5E7EB", marginBottom: 22 }}>
        {["1. Параметри","2. Питання"].map((s, i) => <div key={s} style={{ flex: 1, padding: "9px", textAlign: "center", fontSize: 13, fontWeight: 600, background: step === i + 1 ? "#111827" : "#F9FAFB", color: step === i + 1 ? "#fff" : "#9CA3AF" }}>{s}</div>)}
      </div>
      <Err msg={error} />
      {step === 1 && (
        <>
          <Input label="Назва тесту" value={meta.title} onChange={v => setMeta(p => ({ ...p, title: v }))} required />
          <Textarea label="Опис" value={meta.description} onChange={v => setMeta(p => ({ ...p, description: v }))} rows={3} />
          <Input label="Прохідний бал (%)" value={meta.passing_score} onChange={v => setMeta(p => ({ ...p, passing_score: v }))} type="number" />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}><Btn variant="secondary" onClick={onClose}>Скасувати</Btn><Btn onClick={createTest} disabled={loading}>{loading ? "..." : "Далі →"}</Btn></div>
        </>
      )}
      {step === 2 && (
        <>
          {questions.length === 0 && <div style={{ textAlign: "center", padding: "24px 0", color: "#9CA3AF", fontSize: 14, background: "#F9FAFB", borderRadius: 10, marginBottom: 16 }}>Тест створено! Додайте питання.</div>}
          {questions.map((q, qi) => (
            <div key={qi} style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 18, marginBottom: 14, background: "#FAFAFA" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Питання {qi + 1}</span>
                <button onClick={() => removeQ(qi)} style={{ background: "none", border: "none", cursor: "pointer", color: "#DC2626", fontSize: 12 }}>Видалити</button>
              </div>
              <div style={{ marginBottom: 10 }}>
                <select value={q.question_type} onChange={e => setQ(qi, "question_type", e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13, fontFamily: "inherit", background: "#fff", marginBottom: 10 }}>
                  {QTYPES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
                </select>
                <textarea value={q.text} onChange={e => setQ(qi, "text", e.target.value)} rows={2} placeholder="Текст питання *" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", marginBottom: 8 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Макс. балів:</span>
                  <input type="number" value={q.max_score} onChange={e => setQ(qi, "max_score", e.target.value)} min={1} style={{ width: 70, padding: "6px 10px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13, fontFamily: "inherit" }} />
                </div>
              </div>
              {["single_choice","multiple_choice"].includes(q.question_type) && (
                <div>
                  {q.options.map((o, oi) => (
                    <div key={oi} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <input type={q.question_type === "single_choice" ? "radio" : "checkbox"} checked={o.is_correct} onChange={() => setOpt(qi, oi, "is_correct", !o.is_correct)} style={{ accentColor: "#059669", width: 16, height: 16, flexShrink: 0 }} />
                      <input type="text" value={o.text} onChange={e => setOpt(qi, oi, "text", e.target.value)} placeholder={`Варіант ${oi + 1}`} style={{ flex: 1, padding: "7px 11px", borderRadius: 7, border: "1px solid #D1D5DB", fontSize: 13, fontFamily: "inherit" }} />
                      {q.options.length > 2 && <button onClick={() => removeOpt(qi, oi)} style={{ background: "none", border: "none", cursor: "pointer" }}><Icon name="x" size={14} color="#9CA3AF" /></button>}
                    </div>
                  ))}
                  <button onClick={() => addOpt(qi)} style={{ background: "transparent", border: "1px dashed #D1D5DB", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontSize: 12, color: "#6B7280", fontFamily: "inherit" }}>+ Варіант</button>
                </div>
              )}
              {q.question_type === "text" && <div style={{ background: "#EFF6FF", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#3B82F6" }}>💬 Студент введе текст. Перевіряється вручну.</div>}
              {q.question_type === "file" && <div style={{ background: "#FFFBEB", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#F59E0B" }}>📎 Студент завантажить файл. Перевіряється вручну.</div>}
            </div>
          ))}
          <button onClick={addQ} style={{ width: "100%", border: "2px dashed #D1D5DB", borderRadius: 12, padding: "14px", cursor: "pointer", background: "transparent", fontSize: 14, fontWeight: 600, color: "#6B7280", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
            <Icon name="plus" size={16} color="#6B7280" /> Додати питання
          </button>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={onClose}>Закрити</Btn>
            <Btn onClick={saveAll} disabled={loading || questions.length === 0}>{loading ? "..." : <><Icon name="check" size={15} color="#fff"/>Зберегти ({questions.length} пит.)</>}</Btn>
          </div>
        </>
      )}
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COURSE EDITOR
// ═══════════════════════════════════════════════════════════════════════════════
function CourseEditor({ course, onBack }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("content");
  const [modal, setModal] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [reordering, setReordering] = useState(false);
  const [reorderError, setReorderError] = useState("");
  const [reorderOk, setReorderOk] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionOk, setActionOk] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [editingContent, setEditingContent] = useState(null);

const updateItemInState = (updatedItem) => {
  setItems((prev) =>
    prev.map((i) => (i.id === updatedItem.id ? { ...i, ...updatedItem } : i))
  );
};

const updateTextLessonInState = (itemId, updatedLesson) => {
  setItems((prev) =>
    prev.map((i) =>
      i.id === itemId
        ? { ...i, text_lesson: updatedLesson, _hasContent: true }
        : i
    )
  );
};

const updateVideoLessonInState = (itemId, updatedLesson) => {
  setItems((prev) =>
    prev.map((i) =>
      i.id === itemId
        ? { ...i, video_lesson: updatedLesson, _hasContent: true }
        : i
    )
  );
};

function EditVideoModal({ item, onClose, onSaved }) {
  const [url, setUrl] = useState(item.video_lesson?.video_url || "");
  const [desc, setDesc] = useState(item.video_lesson?.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lessonId = item.video_lesson?.id;

  const submit = async () => {
    if (!url.trim()) {
      setError("Введіть URL відео");
      return;
    }

    if (!lessonId) {
      setError("Відеоурок не знайдено");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await api.patch(`/video-lessons/${lessonId}/update/`, {
        video_url: url.trim(),
        description: desc,
      });
      onSaved(data);
      onClose();
    } catch (e) {
      setError(parseError(e));
    }

    setLoading(false);
  };

  return (
    <Modal title={`Редагувати відео: "${item.title}"`} onClose={onClose}>
      <Err msg={error} />
      <Input
        label="URL відео"
        value={url}
        onChange={setUrl}
        required
      />
      <Textarea
        label="Опис"
        value={desc}
        onChange={setDesc}
        rows={3}
      />
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Скасувати</Btn>
        <Btn onClick={submit} disabled={loading}>
          {loading ? "..." : <><Icon name="check" size={15} color="#fff" />Зберегти</>}
        </Btn>
      </div>
    </Modal>
  );
}

const updateTestInState = (itemId, updatedTest) => {
  setItems((prev) =>
    prev.map((i) =>
      i.id === itemId
        ? { ...i, test_block: updatedTest, _hasContent: true }
        : i
    )
  );
};

function EditTestModal({ item, onClose, onSaved }) {
  const [title, setTitle] = useState(item.test_block?.title || item.title || "");
  const [description, setDescription] = useState(item.test_block?.description || "");
  const [passingScore, setPassingScore] = useState(
    item.test_block?.passing_score?.toString() || "60"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const testId = item.test_block?.id;

  const submit = async () => {
    if (!title.trim()) {
      setError("Введіть назву тесту");
      return;
    }

    if (!testId) {
      setError("Тест не знайдено");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await api.patch(`/tests/${testId}/update/`, {
        title: title.trim(),
        description,
        passing_score: parseInt(passingScore) || 60,
      });

      onSaved(data);
      onClose();
    } catch (e) {
      setError(parseError(e));
    }

    setLoading(false);
  };

  return (
    <Modal title={`Редагувати тест: "${item.title}"`} onClose={onClose}>
      <Err msg={error} />

      <Input
        label="Назва тесту"
        value={title}
        onChange={setTitle}
        required
      />

      <Textarea
        label="Опис"
        value={description}
        onChange={setDescription}
        rows={4}
      />

      <Input
        label="Прохідний бал (%)"
        value={passingScore}
        onChange={setPassingScore}
        type="number"
      />

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Скасувати</Btn>
        <Btn onClick={submit} disabled={loading}>
          {loading ? "..." : <><Icon name="check" size={15} color="#fff" />Зберегти</>}
        </Btn>
      </div>
    </Modal>
  );
}

function EditTextModal({ item, onClose, onSaved }) {
  const [content, setContent] = useState(item.text_lesson?.content || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lessonId = item.text_lesson?.id;

  const submit = async () => {
    if (!content.trim()) {
      setError("Введіть текст уроку");
      return;
    }

    if (!lessonId) {
      setError("Текстовий урок не знайдено");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await api.patch(`/text-lessons/${lessonId}/update/`, {
        content,
      });
      onSaved(data);
      onClose();
    } catch (e) {
      setError(parseError(e));
    }

    setLoading(false);
  };

  return (
    <Modal title={`Редагувати текст: "${item.title}"`} onClose={onClose} width={720}>
      <Err msg={error} />
      <Textarea
        label="Зміст уроку"
        value={content}
        onChange={setContent}
        rows={14}
      />
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Скасувати</Btn>
        <Btn onClick={submit} disabled={loading}>
          {loading ? "..." : <><Icon name="check" size={15} color="#fff" />Зберегти</>}
        </Btn>
      </div>
    </Modal>
  );
}

function EditItemModal({ item, onClose, onSaved }) {
  const [title, setTitle] = useState(item.title || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!title.trim()) {
      setError("Введіть назву розділу");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await api.patch(`/course-items/${item.id}/update/`, {
        title: title.trim(),
      });
      onSaved(data);
      onClose();
    } catch (e) {
      setError(parseError(e));
    }

    setLoading(false);
  };

  return (
    <Modal title="Редагувати розділ" onClose={onClose}>
      <Err msg={error} />
      <Input
        label="Назва розділу"
        value={title}
        onChange={setTitle}
        required
      />
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Скасувати</Btn>
        <Btn onClick={submit} disabled={loading}>
          {loading ? "..." : <><Icon name="check" size={15} color="#fff" />Зберегти</>}
        </Btn>
      </div>
    </Modal>
  );
}

const deleteContent = async (item) => {
  const confirmed = window.confirm("Видалити контент цього розділу?");
  if (!confirmed) return;

  setActionError("");
  setActionOk("");

  try {
    if (item.item_type === "text" && item.text_lesson?.id) {
      await api.delete(`/text-lessons/${item.text_lesson.id}/delete/`);
    } else if (item.item_type === "video" && item.video_lesson?.id) {
      await api.delete(`/video-lessons/${item.video_lesson.id}/delete/`);
    } else if (item.item_type === "test" && item.test_block?.id) {
      await api.delete(`/tests/${item.test_block.id}/delete/`);
    } else {
      setActionError("Контент для цього розділу не знайдено");
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              _hasContent: false,
              text_lesson: null,
              video_lesson: null,
              test_block: null,
            }
          : i
      )
    );

    setActionOk("Контент видалено");
    setTimeout(() => setActionOk(""), 2000);
  } catch (e) {
    setActionError(parseError(e));
  }
};

const deleteItem = async (itemId) => {
  const confirmed = window.confirm("Видалити цей розділ?");
  if (!confirmed) return;

  setActionError("");
  setActionOk("");

  try {
    await api.delete(`/course-items/${itemId}/delete/`);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    setActionOk("Розділ видалено");
    setTimeout(() => setActionOk(""), 2000);
  } catch (e) {
    setActionError(parseError(e));
  }
};

  useEffect(() => {
    setLoading(true);
    api
      .get(`/courses/${course.id}/items/`)
      .then(({ data }) => setItems(data))
      .catch(() => setReorderError("Не вдалося завантажити розділи курсу"))
      .finally(() => setLoading(false));
  }, [course.id]);

  const openContent = (item) => {
    setActiveItem(item);
    setModal(item.item_type);
  };

  const markHas = (id) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, _hasContent: true } : i))
    );
  };

  const reorderItems = async (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= items.length || fromIndex === toIndex) return;

    setReorderError("");
    setReorderOk("");

    const previousItems = [...items];

    const updated = [...items];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);

    const reordered = updated.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setItems(reordered);
    setReordering(true);

    try {
      const payload = {
        items: reordered.map((item) => ({
          id: item.id,
          order: item.order,
        })),
      };

      const { data } = await api.post(
        `/courses/${course.id}/items/reorder/`,
        payload
      );

      setItems(data);
      setReorderOk("Порядок розділів оновлено");
      setTimeout(() => setReorderOk(""), 2000);
    } catch (e) {
      setReorderError(parseError(e) || "Не вдалося змінити порядок розділів");
      setItems(previousItems);
    } finally {
      setReordering(false);
    }
  };

  const TABS = [
    { id: "content", label: "Зміст курсу", icon: "book" },
    { id: "students", label: "Слухачі", icon: "users" },
    { id: "review", label: "Перевірка тестів", icon: "review" },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <button
          onClick={onBack}
          style={{
            background: "#F3F4F6",
            border: "none",
            borderRadius: 8,
            width: 36,
            height: 36,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="back" size={18} />
        </button>

        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontSize: 22,
              color: "#111827",
            }}
          >
            {course.title}
          </h2>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>
            {course.duration_hours} год. · {items.length} розділів
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 28,
          borderRadius: 10,
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          width: "fit-content",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: tab === t.id ? "#111827" : "#fff",
              color: tab === t.id ? "#fff" : "#6B7280",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <Icon
              name={t.icon}
              size={15}
              color={tab === t.id ? "#fff" : "#9CA3AF"}
            />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "content" && (
        <>
          <Err msg={reorderError} />
          <Ok msg={reorderOk} />

          {loading ? (
            <Spinner />
          ) : (
            <>
              {items.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "48px 0",
                    border: "2px dashed #E5E7EB",
                    borderRadius: 14,
                    color: "#9CA3AF",
                    marginBottom: 20,
                  }}
                >
                  <Icon name="book" size={40} color="#D1D5DB" />
                  <p style={{ marginTop: 12, fontSize: 14 }}>
                    Розділів ще немає.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    overflow: "hidden",
                    marginBottom: 20,
                  }}
                >
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "16px 20px",
                        borderBottom:
                          idx < items.length - 1 ? "1px solid #F3F4F6" : "none",
                        background: "#fff",
                      }}
                    >
                      <span style={{ color: "#D1D5DB" }}>
                        <Icon name="drag" size={18} color="#D1D5DB" />
                      </span>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          flexShrink: 0,
                        }}
                      >
                        <button
                          onClick={() => reorderItems(idx, idx - 1)}
                          disabled={idx === 0 || reordering}
                          style={{
                            border: "1px solid #E5E7EB",
                            background: "#fff",
                            borderRadius: 8,
                            width: 30,
                            height: 30,
                            cursor:
                              idx === 0 || reordering ? "not-allowed" : "pointer",
                            opacity: idx === 0 || reordering ? 0.5 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon name="up" size={14} color="#6B7280" />
                        </button>

                        <button
                          onClick={() => reorderItems(idx, idx + 1)}
                          disabled={idx === items.length - 1 || reordering}
                          style={{
                            border: "1px solid #E5E7EB",
                            background: "#fff",
                            borderRadius: 8,
                            width: 30,
                            height: 30,
                            cursor:
                              idx === items.length - 1 || reordering
                                ? "not-allowed"
                                : "pointer",
                            opacity:
                              idx === items.length - 1 || reordering ? 0.5 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon name="down" size={14} color="#6B7280" />
                        </button>
                      </div>

                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 7,
                          background: "#F3F4F6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontWeight: 700,
                          fontSize: 12,
                          color: "#9CA3AF",
                        }}
                      >
                        {item.order}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                            color: "#111827",
                          }}
                        >
                          {item.title}
                        </div>

                        <div
                          style={{
                            fontSize: 12,
                            color:
                              item._hasContent ||
                              item.text_lesson ||
                              item.video_lesson ||
                              item.test_block
                                ? "#059669"
                                : "#F59E0B",
                            marginTop: 2,
                          }}
                        >
                          {item._hasContent ||
                          item.text_lesson ||
                          item.video_lesson ||
                          item.test_block
                            ? "✓ Контент додано"
                            : "⚠ Контент не додано"}
                        </div>
                      </div>

                      <TypeBadge type={item.item_type} />

                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                          <Btn
                            small
                            variant="secondary"
                            onClick={() => openContent(item)}
                          >
                            {item._hasContent || item.text_lesson || item.video_lesson || item.test_block
                              ? "Переглянути"
                              : "Додати контент"}
                          </Btn>
                            
                          <Btn
                            small
                            variant="secondary"
                            onClick={() => setEditingItem(item)}
                          >
                            <Icon name="edit" size={13} color="#374151" />
                            Розділ
                          </Btn>
                            
                          {item.item_type === "text" && item.text_lesson && (
                            <Btn
                              small
                              variant="secondary"
                              onClick={() => setEditingContent(item)}
                            >
                              <Icon name="edit" size={13} color="#374151" />
                              Текст
                            </Btn>
                          )}

                          {item.item_type === "test" && (item.test_block || item._hasContent) && (
                            <Btn
                              small
                              variant="secondary"
                              onClick={() => setEditingContent(item)}
                            >
                              <Icon name="edit" size={13} color="#374151" />
                              Тест
                            </Btn>
                          )}

                          {item.item_type === "video" && item.video_lesson && (
                            <Btn
                              small
                              variant="secondary"
                              onClick={() => setEditingContent(item)}
                            >
                              <Icon name="edit" size={13} color="#374151" />
                              Відео
                            </Btn>
                          )}

                          
                        {(item._hasContent || item.text_lesson || item.video_lesson || item.test_block) && (
                          <Btn small variant="danger" onClick={() => deleteContent(item)}>
                            <Icon name="trash" size={13} color="#DC2626" />
                            Контент
                          </Btn>
                        )}

                        <Btn small variant="danger" onClick={() => deleteItem(item.id)}>
                          <Icon name="trash" size={13} color="#DC2626" />
                          Розділ
                        </Btn>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Btn onClick={() => setModal("item")}>
                <Icon name="plus" size={15} color="#fff" /> Додати розділ
              </Btn>
            </>
          )}
        </>
      )}

      {tab === "students" && <EnrollmentsPanel course={course} />}
      {tab === "review" && <TestReviewPanel course={course} />}

            {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={(updatedItem) => updateItemInState(updatedItem)}
        />
      )}

      {editingContent && editingContent.item_type === "text" && (
        <EditTextModal
          item={editingContent}
          onClose={() => setEditingContent(null)}
          onSaved={(updatedLesson) =>
            updateTextLessonInState(editingContent.id, updatedLesson)
          }
        />
      )}

      {editingContent && editingContent.item_type === "test" && (
        <EditTestModal
          item={editingContent}
          onClose={() => setEditingContent(null)}
          onSaved={(updatedTest) =>
            updateTestInState(editingContent.id, updatedTest)
          }
        />
      )}

      {editingContent && editingContent.item_type === "video" && (
        <EditVideoModal
          item={editingContent}
          onClose={() => setEditingContent(null)}
          onSaved={(updatedLesson) =>
            updateVideoLessonInState(editingContent.id, updatedLesson)
          }
        />
      )}

      {modal === "item" && (
        <AddItemModal
          course={course}
          existingItems={items}
          onClose={() => setModal(null)}
          onCreated={(item) => setItems((prev) => [...prev, item])}
        />
      )}

      {modal === "text" && activeItem && (
        <AddTextModal
          item={activeItem}
          onClose={() => setModal(null)}
          onSaved={() => markHas(activeItem.id)}
        />
      )}

      {modal === "video" && activeItem && (
        <AddVideoModal
          item={activeItem}
          onClose={() => setModal(null)}
          onSaved={() => markHas(activeItem.id)}
        />
      )}

      {modal === "test" && activeItem && (
        <CreateTestModal
          item={activeItem}
          course={course}
          onClose={() => setModal(null)}
          onSaved={async () => {
            try {
              const { data } = await api.get(`/courses/${course.id}/items/`);
              setItems(data);
            } catch (e) {
              markHas(activeItem.id);
            }
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEACHER DASHBOARD — main export
// ═══════════════════════════════════════════════════════════════════════════════
export default function TeacherDashboard({ setPage }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    api.get("/courses/my-teaching/")
      .then(({ data }) => setCourses(data))
      .catch(() => setError("Помилка завантаження. Перевірте авторизацію."))
      .finally(() => setLoading(false));
  }, []);

  if (editing) return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px" }}>
      <CourseEditor course={editing} onBack={() => setEditing(null)} />
    </div>
  );

  return (
    <div style={{ maxWidth: 1060, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 34, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em", marginBottom: 6 }}>Кабінет викладача</h1>
          <p style={{ color: "#9CA3AF", fontSize: 15 }}>Керуйте курсами, матеріалами та слухачами</p>
        </div>
        <Btn onClick={() => setShowCreate(true)}><Icon name="plus" size={16} color="#fff" /> Новий курс</Btn>
      </div>

      {!loading && courses.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 32 }}>
          {[
            { label: "Моїх курсів",    val: courses.length,                                       icon: "grad",   color: "#3B82F6" },
            { label: "Розділів всього", val: courses.reduce((s,c)=>s+(c.items?.length||0), 0),    icon: "book",   color: "#10B981" },
            { label: "Перевірка тестів",val: "→",                                                 icon: "review", color: "#F59E0B" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={s.icon} size={20} color={s.color} />
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 24, color: "#111827" }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Err msg={error} />

      {loading ? <Spinner /> : courses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", border: "2px dashed #E5E7EB", borderRadius: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: 14, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icon name="grad" size={26} color="#D1D5DB" />
          </div>
          <h3 style={{ fontWeight: 700, fontSize: 18, color: "#374151", marginBottom: 8 }}>Курсів ще немає</h3>
          <p style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 24 }}>Створіть перший курс і почніть навчати!</p>
          <Btn onClick={() => setShowCreate(true)}><Icon name="plus" size={15} color="#fff" /> Створити</Btn>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {courses.map(c => (
            <div key={c.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "20px 24px", display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="grad" size={22} color="#059669" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 4 }}>{c.title}</h3>
                <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#9CA3AF" }}>
                  <span>{c.start_date} — {c.end_date}</span>
                  <span>·</span><span>{c.duration_hours} год.</span>
                  <span>·</span><span>{(c.items||[]).length} розділів</span>
                </div>
              </div>
              <Btn small variant="secondary" onClick={() => setEditing(c)}>Редагувати курс</Btn>
            </div>
          ))}
        </div>
      )}

      {showCreate && <CreateCourseModal onClose={() => setShowCreate(false)} onCreated={c => { setCourses(p => [...p, c]); setEditing(c); }} />}
    </div>
  );
}
