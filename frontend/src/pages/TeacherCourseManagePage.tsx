import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import type { Course, CourseItem } from "../types";


interface TeacherProfile {
  id: number;
  username: string;
  email: string;
  role: "student" | "teacher" | "admin";
  phone?: string | null;
}

export default function TeacherCourseManagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [items, setItems] = useState<CourseItem[]>([]);
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [message, setMessage] = useState("");

  const [itemForm, setItemForm] = useState({
    title: "",
    item_type: "text",
    order: 1,
  });

  const [textForm, setTextForm] = useState({
    course_item: 0,
    content: "",
  });

  const [videoForm, setVideoForm] = useState({
    course_item: 0,
    video_url: "",
    description: "",
  });

  const [testForm, setTestForm] = useState({
    course: Number(id),
    course_item: 0,
    title: "",
    description: "",
    passing_score: 60,
  });

  const loadProfile = async () => {
    try {
      const response = await api.get("/users/profile/");
      setProfile(response.data);
    } catch {
      setMessage("Не вдалося завантажити профіль.");
    }
  };

  const loadCourse = async () => {
    try {
      const coursesResponse = await api.get("/courses/my-teaching/");
      const foundCourse =
        coursesResponse.data.find((c: Course) => c.id === Number(id)) || null;

      setCourse(foundCourse);

      if (!foundCourse) {
        setMessage("Курс не знайдено або у вас немає до нього доступу.");
        return;
      }

      const itemsResponse = await api.get(`/courses/${id}/items/`);
      setItems(itemsResponse.data);
    } catch {
      setMessage("Не вдалося завантажити курс.");
    }
  };

  useEffect(() => {
    loadProfile();
    loadCourse();
  }, [id]);

  const refreshItems = async () => {
    const itemsResponse = await api.get(`/courses/${id}/items/`);
    setItems(itemsResponse.data);
  };

  const extractErrorMessage = (data: any): string => {
    if (!data) return "Сталася помилка.";
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;

    const firstKey = Object.keys(data)[0];
    if (!firstKey) return "Сталася помилка.";

    const value = data[firstKey];
    return Array.isArray(value) ? value[0] : String(value);
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setItemForm((prev) => ({
      ...prev,
      [name]: name === "order" ? Number(value) : value,
    }));
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/course-items/create/", {
        course: Number(id),
        title: itemForm.title,
        item_type: itemForm.item_type,
        order: Number(itemForm.order),
      });

      setMessage("Блок курсу успішно створено.");
      setItemForm({
        title: "",
        item_type: "text",
        order: items.length + 2,
      });
      await refreshItems();
    } catch (error: any) {
      setMessage(extractErrorMessage(error.response?.data));
    }
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTextForm((prev) => ({
      ...prev,
      [name]: name === "course_item" ? Number(value) : value,
    }));
  };

  const handleCreateTextLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/text-lessons/create/", textForm);
      setMessage("Текстовий матеріал додано.");
      setTextForm({
        course_item: 0,
        content: "",
      });
      await refreshItems();
    } catch (error: any) {
      setMessage(extractErrorMessage(error.response?.data));
    }
  };

  const handleVideoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setVideoForm((prev) => ({
      ...prev,
      [name]: name === "course_item" ? Number(value) : value,
    }));
  };

  const handleCreateVideoLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/video-lessons/create/", videoForm);
      setMessage("Відеоматеріал додано.");
      setVideoForm({
        course_item: 0,
        video_url: "",
        description: "",
      });
      await refreshItems();
    } catch (error: any) {
      setMessage(extractErrorMessage(error.response?.data));
    }
  };

  const handleTestChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTestForm((prev) => ({
      ...prev,
      [name]:
        name === "course_item" || name === "passing_score"
          ? Number(value)
          : value,
    }));
  };

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/tests/create/", {
        ...testForm,
        course: Number(id),
      });

      setMessage("Тест успішно створено.");
      setTestForm({
        course: Number(id),
        course_item: 0,
        title: "",
        description: "",
        passing_score: 60,
      });
      await refreshItems();
    } catch (error: any) {
      setMessage(extractErrorMessage(error.response?.data));
    }
  };

  const textItems = items.filter((item) => item.item_type === "text");
  const videoItems = items.filter((item) => item.item_type === "video");
  const testItems = items.filter((item) => item.item_type === "test");

  return (
    <div>
      <h1>Керування курсом</h1>

      {message && <p>{message}</p>}

      {course && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            marginBottom: "20px",
            background: "#fff",
          }}
        >
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <p>Тривалість: {course.duration_hours} годин</p>
          <p>Викладач: {course.teacher_username}</p>
        </div>
      )}

      <div
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          marginBottom: "20px",
          background: "#fff",
        }}
      >
        <h2>Поточна структура курсу</h2>

        {items.length === 0 ? (
          <p>У курсі ще немає блоків.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #eee",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <strong>
                {item.order}. {item.title}
              </strong>
              <p>Тип: {item.item_type}</p>

              {item.item_type === "text" && item.text_lesson && (
                <p>Текст додано</p>
              )}

              {item.item_type === "video" && item.video_lesson && (
                <p>Відео додано</p>
              )}

              {item.item_type === "test" && (
                  <div>
                    <p>Тестовий блок</p>
                    <button
                      onClick={async () => {
                        try {
                          const response = await api.get(`/tests/course/${id}/`);
                          navigate(`/teacher/tests/${response.data.id}`);
                        } catch {
                          setMessage("Не вдалося знайти тест для цього курсу.");
                        }
                      }}
                    >
                      Керувати тестом
                    </button>
                  </div>
                )}
            </div>
          ))
        )}
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          marginBottom: "20px",
          background: "#fff",
        }}
      >
        <h2>1. Створити блок курсу</h2>

        <form onSubmit={handleCreateItem}>
          <div>
            <input
              name="title"
              placeholder="Назва блоку"
              value={itemForm.title}
              onChange={handleItemChange}
            />
          </div>

          <div>
            <select
              name="item_type"
              value={itemForm.item_type}
              onChange={handleItemChange}
            >
              <option value="text">Текст</option>
              <option value="video">Відео</option>
              <option value="test">Тест</option>
            </select>
          </div>

          <div>
            <input
              name="order"
              type="number"
              min={1}
              value={itemForm.order}
              onChange={handleItemChange}
            />
          </div>

          <button type="submit">Додати блок</button>
        </form>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          marginBottom: "20px",
          background: "#fff",
        }}
      >
        <h2>2. Додати текст до блоку</h2>

        <form onSubmit={handleCreateTextLesson}>
          <div>
            <select
              name="course_item"
              value={textForm.course_item}
              onChange={handleTextChange}
            >
              <option value={0}>Оберіть текстовий блок</option>
              {textItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.order}. {item.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <textarea
              name="content"
              placeholder="Текст матеріалу"
              rows={6}
              value={textForm.content}
              onChange={handleTextChange}
            />
          </div>

          <button type="submit">Додати текст</button>
        </form>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          marginBottom: "20px",
          background: "#fff",
        }}
      >
        <h2>3. Додати відео до блоку</h2>

        <form onSubmit={handleCreateVideoLesson}>
          <div>
            <select
              name="course_item"
              value={videoForm.course_item}
              onChange={handleVideoChange}
            >
              <option value={0}>Оберіть відеоблок</option>
              {videoItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.order}. {item.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              name="video_url"
              placeholder="Посилання на відео"
              value={videoForm.video_url}
              onChange={handleVideoChange}
            />
          </div>

          <div>
            <textarea
              name="description"
              placeholder="Опис відео"
              rows={4}
              value={videoForm.description}
              onChange={handleVideoChange}
            />
          </div>

          <button type="submit">Додати відео</button>
        </form>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          marginBottom: "20px",
          background: "#fff",
        }}
      >
        <h2>4. Створити тест для блоку</h2>

        <form onSubmit={handleCreateTest}>
          <div>
            <select
              name="course_item"
              value={testForm.course_item}
              onChange={handleTestChange}
            >
              <option value={0}>Оберіть тестовий блок</option>
              {testItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.order}. {item.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              name="title"
              placeholder="Назва тесту"
              value={testForm.title}
              onChange={handleTestChange}
            />
          </div>

          <div>
            <textarea
              name="description"
              placeholder="Опис тесту"
              rows={4}
              value={testForm.description}
              onChange={handleTestChange}
            />
          </div>

          <div>
            <input
              name="passing_score"
              type="number"
              min={1}
              max={100}
              value={testForm.passing_score}
              onChange={handleTestChange}
            />
          </div>

          <button type="submit">Створити тест</button>
        </form>
      </div>

      {profile && profile.role !== "teacher" && (
        <p>Ця сторінка доступна тільки викладачу.</p>
      )}
    </div>
  );
}