import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import type { Course } from "../types";

interface Profile {
  id: number;
  username: string;
  email: string;
  role: "student" | "teacher" | "admin";
  phone?: string | null;
}

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    duration_hours: 0,
  });

  const loadProfile = async () => {
    try {
      const response = await api.get("/users/profile/");
      setProfile(response.data);
    } catch {
      setMessage("Не вдалося завантажити профіль.");
    }
  };

  const loadCourses = async () => {
    try {
      const response = await api.get("/courses/my-teaching/");
      setCourses(response.data);
    } catch {
      setMessage("Не вдалося завантажити курси викладача.");
    }
  };

  useEffect(() => {
    loadProfile();
    loadCourses();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "duration_hours" ? Number(value) : value,
    }));
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!profile) {
      setMessage("Профіль ще не завантажено.");
      return;
    }

    if (profile.role !== "teacher") {
      setMessage("Лише викладач може створювати курси.");
      return;
    }

    try {
      await api.post("/courses/create/", {
        ...form,
        teacher: profile.id,
      });

      setMessage("Курс успішно створено.");
      setForm({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        duration_hours: 0,
      });
      loadCourses();
    } catch (error: any) {
      const data = error.response?.data;

      if (typeof data === "string") {
        setMessage(data);
      } else if (data?.detail) {
        setMessage(data.detail);
      } else {
        const firstKey = data ? Object.keys(data)[0] : null;
        if (firstKey) {
          const value = data[firstKey];
          setMessage(Array.isArray(value) ? value[0] : String(value));
        } else {
          setMessage("Не вдалося створити курс.");
        }
      }
    }
  };

  return (
    <div>
      <h1>Курси викладача</h1>

      {message && <p>{message}</p>}

      <div
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          marginBottom: "20px",
          background: "#fff",
        }}
      >
        <h2>Створити курс</h2>

        <form onSubmit={handleCreateCourse}>
          <div>
            <input
              name="title"
              placeholder="Назва курсу"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <textarea
              name="description"
              placeholder="Опис курсу"
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div>
            <input
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={handleChange}
            />
          </div>

          <div>
            <input
              name="end_date"
              type="date"
              value={form.end_date}
              onChange={handleChange}
            />
          </div>

          <div>
            <input
              name="duration_hours"
              type="number"
              placeholder="Тривалість у годинах"
              value={form.duration_hours}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Створити курс</button>
        </form>
      </div>

      <div>
        <h2>Мої курси</h2>

        {courses.length === 0 ? (
          <p>У вас поки немає курсів.</p>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                marginBottom: "12px",
                background: "#fff",
              }}
            >
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Тривалість: {course.duration_hours} годин</p>
              <Link to={`/teacher/courses/${course.id}`}>Керувати курсом</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}