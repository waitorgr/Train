import { useState, useEffect } from "react";
import TeacherDashboard from "./TeacherDashboard";
import StudentCoursePage from "./StudentCoursePage";
import api from "./api/axios";
import axios from "axios";


// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    graduation: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
    book:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    video:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    test:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    cert:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
    arrow:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    clock:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    user:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    logout:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    check:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    star:       <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    warn:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  };
  return icons[name] || null;
};

// ─── UI Helpers ───────────────────────────────────────────────────────────────
function Badge({ type }) {
  const cfg = {
    video: { label: "Відео",  color: "#3B82F6", bg: "#EFF6FF" },
    text:  { label: "Текст",  color: "#10B981", bg: "#ECFDF5" },
    test:  { label: "Тест",   color: "#F59E0B", bg: "#FFFBEB" },
  };
  const { label, color, bg } = cfg[type] || { label: type, color: "#6B7280", bg: "#F3F4F6" };
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, letterSpacing: "0.05em" }}>{label.toUpperCase()}</span>;
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 72 }}>
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.75s" repeatCount="indefinite"/>
        </path>
      </svg>
    </div>
  );
}

function ErrorBox({ msg }) {
  return (
    <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "13px 16px", fontSize: 14, color: "#DC2626", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <Icon name="warn" size={17} color="#DC2626" /><span>{msg}</span>
    </div>
  );
}

function SuccessBox({ msg }) {
  return (
    <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10, padding: "13px 16px", fontSize: 14, color: "#059669", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <Icon name="check" size={16} color="#059669" /><span>{msg}</span>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, user, onLogout }) {
  const links = [
    { id: "home", label: "Головна" },
    { id: "courses", label: "Курси" },
    ...(user ? [
      { id: "my-courses", label: "Мої курси" },
      { id: "certificates", label: "Сертифікати" },
      ...(user.role === "teacher" ? [{ id: "teacher", label: "Кабінет викладача" }] : []),
    ] : []),
  ];
  return (
    <nav style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ background: "#111827", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="graduation" size={20} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 18, color: "#111827" }}>КваліФорум</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {links.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)}
              style={{ background: page === l.id ? "#111827" : "transparent", color: page === l.id ? "#fff" : "#4B5563", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 14, fontWeight: 500, fontFamily: "inherit" }}>
              {l.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "#F9FAFB", borderRadius: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#111827", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="user" size={15} color="#fff" />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{user.username}</span>
                <span style={{ fontSize: 11, color: "#9CA3AF", background: "#F3F4F6", borderRadius: 10, padding: "2px 7px" }}>{user.role}</span>
              </div>
              <button onClick={onLogout} style={{ background: "transparent", border: "1px solid #E5E7EB", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#6B7280", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "inherit" }}>
                <Icon name="logout" size={15} /> Вийти
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setPage("login")} style={{ background: "transparent", border: "1px solid #D1D5DB", borderRadius: 8, padding: "8px 18px", cursor: "pointer", color: "#374151", fontSize: 14, fontWeight: 500, fontFamily: "inherit" }}>Увійти</button>
              <button onClick={() => setPage("register")} style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}>Реєстрація</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background: "#111827", color: "#9CA3AF", padding: "48px 24px 28px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 40, marginBottom: 36 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ background: "#fff", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="graduation" size={17} color="#111827" />
              </div>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 17, color: "#fff" }}>КваліФорум</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 260, color: "#6B7280" }}>Платформа для організації та проходження курсів підвищення кваліфікації.</p>
          </div>
          {[["Платформа", ["Головна","Курси","Про нас"]], ["Акаунт", ["Мої курси","Сертифікати","Профіль"]]].map(([title, lnks]) => (
            <div key={title}>
              <h4 style={{ color: "#fff", fontWeight: 600, fontSize: 13, marginBottom: 14 }}>{title}</h4>
              {lnks.map(l => <div key={l} style={{ fontSize: 13, color: "#6B7280", marginBottom: 8, cursor: "pointer" }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #1F2937", paddingTop: 20, fontSize: 12 }}>© 2026 КваліФорум. Усі права захищено.</div>
      </div>
    </footer>
  );
}

// ─── Course Card ──────────────────────────────────────────────────────────────
const PALETTES = [["#EFF6FF","#BFDBFE","#3B82F6"],["#ECFDF5","#A7F3D0","#10B981"],["#FFFBEB","#FDE68A","#F59E0B"],["#FDF4FF","#E9D5FF","#8B5CF6"]];

function CourseCard({ course, setPage, enrolled = false }) {
  const [bg, border, accent] = PALETTES[course.id % PALETTES.length];
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.10)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ background: `linear-gradient(135deg,${bg},${border})`, height: 148, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <Icon name="graduation" size={50} color={accent} />
        {enrolled && <div style={{ position: "absolute", top: 12, right: 12, background: "#059669", color: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>ЗАПИСАНИЙ</div>}
      </div>
      <div style={{ padding: "18px 20px 22px" }}>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 8, lineHeight: 1.4 }}>{course.title}</h3>
        <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{course.description}</p>
        <div style={{ display: "flex", gap: 14, marginBottom: 12, fontSize: 12, color: "#9CA3AF" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="user" size={12} />{course.teacher_username}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="clock" size={12} />{course.duration_hours} год.</span>
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
          {(course.items || []).map(item => <Badge key={item.id} type={item.item_type} />)}
        </div>
        <button onClick={() => setPage(enrolled ? `learn-${course.id}` : `course-${course.id}`)}
          style={{ width: "100%", background: enrolled ? "#059669" : "#111827", color: "#fff", border: "none", borderRadius: 8, padding: "10px", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}>
          {enrolled ? "▶ Продовжити навчання" : "Детальніше"}
        </button>
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ setPage, courses, coursesLoading }) {
  const stats = [{ num: `${courses.length || 0}`, label: "Курсів у системі" }, { num: "2 400+", label: "Слухачів" }, { num: "85+", label: "Викладачів" }, { num: "98%", label: "Задоволених" }];
  const features = [
    { icon: "book",  title: "Структуровані курси",    text: "Послідовне проходження модулів: відео, текст, тести. Кожен блок відкривається по порядку." },
    { icon: "test",  title: "Автоматичне тестування", text: "Single/multiple choice перевіряються миттєво. Відкриті відповіді — перевіряє викладач вручну." },
    { icon: "cert",  title: "Офіційні сертифікати",   text: "Після успішного складання тесту система автоматично генерує іменний сертифікат з унікальним номером." },
    { icon: "user",  title: "Рольовий доступ (JWT)",  text: "Окремі кабінети слухача, викладача та адміністратора з розмежуванням прав доступу." },
  ];
  return (
    <div>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#F0FDF4 0%,#EFF6FF 100%)", padding: "80px 24px 96px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 24, padding: "6px 16px", marginBottom: 28, fontSize: 13, color: "#6B7280" }}>
            <Icon name="star" size={13} color="#F59E0B" /> Платформа підвищення кваліфікації педагогів
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(30px,5.5vw,56px)", fontWeight: 700, color: "#111827", lineHeight: 1.15, marginBottom: 18, letterSpacing: "-0.03em" }}>
            Розвивайте свої<br /><span style={{ color: "#059669" }}>професійні компетенції</span>
          </h1>
          <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.75, marginBottom: 36, maxWidth: 500, margin: "0 auto 36px" }}>
            Сучасна веб-платформа для організації, проходження та контролю курсів підвищення кваліфікації.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("courses")} style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 10, padding: "13px 26px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
              Переглянути курси <Icon name="arrow" size={15} color="#fff" />
            </button>
            <button onClick={() => setPage("register")} style={{ background: "#fff", color: "#111827", border: "1px solid #D1D5DB", borderRadius: 10, padding: "13px 26px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Зареєструватись
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#111827", padding: "44px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, textAlign: "center" }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 34, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{s.num}</div>
              <div style={{ fontSize: 13, color: "#9CA3AF" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: "#111827", textAlign: "center", marginBottom: 44 }}>Чому КваліФорум?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: "#F9FAFB", borderRadius: 14, padding: 28, border: "1px solid #E5E7EB", display: "flex", gap: 18, alignItems: "flex-start" }}>
                <div style={{ background: "#111827", borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={f.icon} size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, color: "#111827", marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65 }}>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses from real API */}
      <section style={{ background: "#F9FAFB", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: "#111827" }}>Актуальні курси</h2>
            <button onClick={() => setPage("courses")} style={{ background: "transparent", border: "1px solid #D1D5DB", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, color: "#374151", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5 }}>
              Всі курси <Icon name="arrow" size={13} />
            </button>
          </div>
          {coursesLoading ? <Spinner /> : courses.length === 0 ? (
            <div style={{ textAlign: "center", padding: 48, color: "#9CA3AF", fontSize: 15 }}>
              Курсів ще немає. Додайте їх через Django Admin або викладацький кабінет.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
              {courses.slice(0, 3).map(c => <CourseCard key={c.id} course={c} setPage={setPage} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ─── Courses Page ─────────────────────────────────────────────────────────────
function CoursesPage({ setPage, courses, loading, error }) {
  const [search, setSearch] = useState("");
  const filtered = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 34, fontWeight: 700, color: "#111827", marginBottom: 10 }}>Каталог курсів</h1>
      <p style={{ color: "#6B7280", fontSize: 15, marginBottom: 32 }}>Знайдіть курс підвищення кваліфікації за своїм напрямком</p>
      <input type="text" placeholder="Пошук курсів..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", maxWidth: 460, padding: "11px 16px", borderRadius: 10, border: "1px solid #D1D5DB", fontSize: 14, fontFamily: "inherit", outline: "none", marginBottom: 32, boxSizing: "border-box" }} />
      {error && <ErrorBox msg={error} />}
      {loading ? <Spinner /> : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "72px 0", color: "#9CA3AF" }}>
          <Icon name="book" size={44} color="#D1D5DB" />
          <p style={{ marginTop: 14, fontSize: 15 }}>Курсів не знайдено</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 22 }}>
          {filtered.map(c => <CourseCard key={c.id} course={c} setPage={setPage} />)}
        </div>
      )}
    </div>
  );
}

// ─── Course Detail ────────────────────────────────────────────────────────────
function CourseDetailPage({ courseId, setPage, user }) {
  const [course, setCourse]     = useState(null);
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [done, setDone]         = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: all } = await api.get("/courses/");
        const found = all.find(c => c.id === parseInt(courseId));
        if (!found) { setError("Курс не знайдено"); return; }
        setCourse(found);
        const { data: pub } = await api.get(`/courses/${courseId}/items/public/`);
        setItems(pub);
        if (user) {
          try {
            const { data: enr } = await api.get("/enrollments/my/");
            setEnrolled(enr.some(e => e.course === parseInt(courseId) && ["approved","completed"].includes(e.status)));
          } catch {}
        }
      } catch { setError("Помилка завантаження курсу"); }
      finally  { setLoading(false); }
    })();
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!user) { setPage("login"); return; }
    setEnrolling(true); setError("");
    try {
      await api.post("/enrollments/create/", { course: parseInt(courseId) });
      setDone(true);
    } catch (e) {
      setError(e.response?.data?.detail || "Помилка запису на курс");
    } finally { setEnrolling(false); }
  };

  if (loading) return <Spinner />;
  if (!course) return <div style={{ textAlign: "center", padding: 80, color: "#DC2626" }}>{error || "Курс не знайдено"}</div>;

  const iconMap = { video: "video", text: "book", test: "test" };
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
      <button onClick={() => setPage("courses")} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 14, display: "flex", alignItems: "center", gap: 6, marginBottom: 32, fontFamily: "inherit" }}>
        ← Назад до курсів
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 40, alignItems: "start" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: "#111827", lineHeight: 1.25, marginBottom: 14, letterSpacing: "-0.02em" }}>{course.title}</h1>
          <div style={{ display: "flex", gap: 20, marginBottom: 22, fontSize: 14, color: "#6B7280" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="user" size={14} />{course.teacher_username}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="clock" size={14} />{course.duration_hours} год.</span>
          </div>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 36 }}>{course.description}</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 18 }}>Програма курсу</h2>
          <div style={{ borderRadius: 12, border: "1px solid #E5E7EB", overflow: "hidden" }}>
            {items.length === 0 && <div style={{ padding: 24, color: "#9CA3AF", textAlign: "center", fontSize: 14 }}>Блоки ще не додані</div>}
            {items.map((item, idx) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: idx < items.length - 1 ? "1px solid #F3F4F6" : "none", background: idx % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={iconMap[item.item_type] || "book"} size={15} color="#6B7280" />
                </div>
                <div style={{ flex: 1, fontWeight: 600, fontSize: 14, color: "#111827" }}>{item.title}</div>
                <Badge type={item.item_type} />
                {!enrolled && <span style={{ fontSize: 16 }}>🔒</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 26, position: "sticky", top: 80, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ background: "#F3F4F6", borderRadius: 10, height: 155, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
            <Icon name="graduation" size={54} color="#D1D5DB" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, marginBottom: 22 }}>
            {[["Початок:", course.start_date], ["Кінець:", course.end_date], ["Тривалість:", `${course.duration_hours} год.`], ["Блоків:", items.length]].map(([k,v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>{k}</span>
                <span style={{ fontWeight: 600, color: "#374151" }}>{v}</span>
              </div>
            ))}
          </div>
          {error && <ErrorBox msg={error} />}
          {done  && <SuccessBox msg="Запит надіслано! Очікуйте підтвердження від викладача." />}
          {enrolled && (
            <button onClick={() => setPage(`learn-${courseId}`)}
              style={{ width: "100%", background: "#059669", color: "#fff", border: "none", borderRadius: 10, padding: 13, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>
              ▶ Почати навчання
            </button>
          )}
          <button onClick={handleEnroll} disabled={enrolling || done || enrolled}
            style={{ width: "100%", background: (done || enrolled) ? "#D1D5DB" : "#111827", color: "#fff", border: "none", borderRadius: 10, padding: 13, fontSize: 15, fontWeight: 700, cursor: (enrolling || done || enrolled) ? "default" : "pointer", fontFamily: "inherit" }}>
            {enrolling ? "Відправка..." : enrolled ? "✓ Ви вже записані" : done ? "✓ Запит надіслано" : "Записатись на курс"}
          </button>
          {!user && <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", marginTop: 10 }}>Потрібна авторизація для запису</p>}
        </div>
      </div>
    </div>
  );
}

// ─── My Courses ───────────────────────────────────────────────────────────────
function MyCoursesPage({ setPage }) {
  const [courses, setCourses]   = useState([]);
  const [enrollMap, setEnrollMap] = useState({});
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [{ data: enr }, { data: all }] = await Promise.all([api.get("/enrollments/my/"), api.get("/courses/")]);
        const map = {};
        enr.forEach(e => { map[e.course] = e.status; });
        setEnrollMap(map);
        setCourses(all.filter(c => map[c.id]));
      } catch { setError("Помилка завантаження"); }
      finally  { setLoading(false); }
    })();
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: "#111827", marginBottom: 36 }}>Мої курси</h1>
      {error && <ErrorBox msg={error} />}
      {loading ? <Spinner /> : courses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "72px 0" }}>
          <Icon name="book" size={44} color="#D1D5DB" />
          <p style={{ color: "#9CA3AF", marginTop: 14 }}>Ви ще не записані на жоден курс</p>
          <button onClick={() => setPage("courses")} style={{ marginTop: 20, background: "#111827", color: "#fff", border: "none", borderRadius: 8, padding: "11px 22px", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>Переглянути курси</button>
        </div>
      ) : (
        <>
          {/* Status legend */}
          {Object.values(enrollMap).some(s => s === "pending") && (
            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#92400E", marginBottom: 24 }}>
              ⏳ Деякі курси очікують підтвердження від викладача
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 22 }}>
            {courses.map(c => <CourseCard key={c.id} course={c} setPage={setPage} enrolled={["approved","completed"].includes(enrollMap[c.id])} />)}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Certificates ─────────────────────────────────────────────────────────────
function CertificatesPage() {
  const [certs, setCerts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    api.get("/certificates/my/")
      .then(({ data }) => setCerts(data))
      .catch(() => setError("Помилка завантаження сертифікатів"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: "#111827", marginBottom: 36 }}>Мої сертифікати</h1>
      {error && <ErrorBox msg={error} />}
      {loading ? <Spinner /> : certs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "72px 0" }}>
          <Icon name="cert" size={44} color="#D1D5DB" />
          <p style={{ color: "#9CA3AF", marginTop: 14 }}>Сертифікати поки відсутні — завершіть курс та складіть тест</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {certs.map(cert => (
            <div key={cert.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", overflow: "hidden", display: "flex", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 7, background: "linear-gradient(180deg,#059669,#10B981)", flexShrink: 0 }} />
              <div style={{ padding: "22px 26px", display: "flex", alignItems: "center", gap: 22, flex: 1 }}>
                <div style={{ background: "#ECFDF5", borderRadius: 12, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="cert" size={24} color="#059669" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 17, color: "#111827", marginBottom: 5 }}>{cert.course_title}</h3>
                  <div style={{ fontSize: 13, color: "#6B7280" }}>Номер: <span style={{ fontWeight: 600, color: "#374151", fontFamily: "monospace" }}>{cert.certificate_number}</span></div>
                  <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 3 }}>
                    Видано: {new Date(cert.issued_at).toLocaleDateString("uk-UA", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#ECFDF5", borderRadius: 20, padding: "5px 12px" }}>
                  <Icon name="check" size={13} color="#059669" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#059669" }}>Дійсний</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
function AuthPage({ type, setPage, onLogin }) {
  const isLogin = type === "login";
  const [form, setForm]       = useState({ username: "", email: "", password: "", password2: "", role: "student" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      if (isLogin) {
        const { data } = await api.post("/users/login/", { username: form.username, password: form.password });
        localStorage.setItem("access",  data.access);
        localStorage.setItem("refresh", data.refresh);
        const { data: me } = await axios.get("http://localhost:8000/api/users/me/", { headers: { Authorization: `Bearer ${data.access}` } });
        onLogin(me);
        setPage(me.role === "teacher" ? "teacher" : "home");
      } else {
        if (form.password !== form.password2) { setError("Паролі не збігаються"); setLoading(false); return; }
        await api.post("/users/register/", { username: form.username, email: form.email, password: form.password, password2: form.password2, role: form.role });
        setPage("login");
      }
    } catch (e) {
      const d = e.response?.data;
      setError(d ? Object.values(d).flat().join(" ") : "Помилка. Перевірте введені дані.");
    }
    setLoading(false);
  };

  const F = (label, key, t = "text") => (
    <div key={key}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{label}</label>
      <input type={t} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} onKeyDown={e => e.key === "Enter" && handleSubmit()}
        style={{ width: "100%", padding: "10px 13px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#F0FDF4 0%,#EFF6FF 100%)", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "44px 38px", width: "100%", maxWidth: 400, boxShadow: "0 8px 40px rgba(0,0,0,0.10)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ background: "#111827", borderRadius: 14, width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Icon name="graduation" size={24} color="#fff" />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
            {isLogin ? "Увійти до системи" : "Реєстрація"}
          </h1>
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>КваліФорум — платформа підвищення кваліфікації</p>
        </div>
        {error && <ErrorBox msg={error} />}
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {F("Логін", "username")}
          {!isLogin && F("Email", "email", "email")}
          {F("Пароль", "password", "password")}
          {!isLogin && F("Підтвердіть пароль", "password2", "password")}
          {!isLogin && (
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Роль</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                style={{ width: "100%", padding: "10px 13px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff" }}>
                <option value="student">Слухач</option>
                <option value="teacher">Викладач</option>
              </select>
            </div>
          )}
          <button onClick={handleSubmit} disabled={loading}
            style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 10, padding: 13, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}>
            {loading ? "Зачекайте..." : (isLogin ? "Увійти" : "Зареєструватись")}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 22, fontSize: 14, color: "#6B7280" }}>
          {isLogin
            ? <>Немає акаунту? <span onClick={() => setPage("register")} style={{ color: "#111827", fontWeight: 600, cursor: "pointer" }}>Зареєструватись</span></>
            : <>Вже є акаунт? <span onClick={() => setPage("login")} style={{ color: "#111827", fontWeight: 600, cursor: "pointer" }}>Увійти</span></>}
        </div>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]                   = useState("home");
  const [user, setUser]                   = useState(null);
  const [courses, setCourses]             = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError]   = useState("");

  useEffect(() => {
    const s = document.createElement("style");
    s.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fff;color:#111827}`;
    document.head.appendChild(s);
  }, []);

  // Restore session on reload
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;
    axios.get("http://localhost:8000/api/users/me/", { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setUser(data))
      .catch(() => localStorage.clear());
  }, []);

  // Load courses (public endpoint — no auth needed)
  useEffect(() => {
    api.get("/courses/")
      .then(({ data }) => setCourses(data))
      .catch(() => setCoursesError("Не вдалося завантажити курси. Перевірте чи запущено бекенд на localhost:8000"))
      .finally(() => setCoursesLoading(false));
  }, []);

  const handleLogout = () => { localStorage.clear(); setUser(null); setPage("home"); };
  const requireAuth  = (el) => user ? el : <AuthPage type="login" setPage={setPage} onLogin={setUser} />;

  let content;
  if      (page === "home")         content = <HomePage setPage={setPage} courses={courses} coursesLoading={coursesLoading} />;
  else if (page === "courses")      content = <CoursesPage setPage={setPage} courses={courses} loading={coursesLoading} error={coursesError} />;
  else if (page === "my-courses")   content = requireAuth(<MyCoursesPage setPage={setPage} />);
  else if (page === "certificates") content = requireAuth(<CertificatesPage />);
  else if (page === "teacher")      content = requireAuth(<TeacherDashboard setPage={setPage} />);
  else if (page.startsWith("learn-")) {
    const id = page.split("-")[1];
    content = requireAuth(<StudentCoursePage courseId={id} setPage={setPage} />);
  }
  else if (page === "login")        content = <AuthPage type="login"    setPage={setPage} onLogin={setUser} />;
  else if (page === "register")     content = <AuthPage type="register" setPage={setPage} onLogin={setUser} />;
  else if (page.startsWith("course-")) content = <CourseDetailPage courseId={page.split("-")[1]} setPage={setPage} user={user} />;
  else content = <HomePage setPage={setPage} courses={courses} coursesLoading={coursesLoading} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      <main style={{ flex: 1 }}>{content}</main>
      <Footer setPage={setPage} />
    </div>
  );
}
