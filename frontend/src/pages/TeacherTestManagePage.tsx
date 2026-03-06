import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import type { Question } from "../types";

interface TestInfo {
  id: number;
  course: number;
  course_item: number | null;
  title: string;
  description: string;
  passing_score: number;
  created_by: number;
  questions: Question[];
}

export default function TeacherTestManagePage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [testInfo, setTestInfo] = useState<TestInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [message, setMessage] = useState("");

  const [questionForm, setQuestionForm] = useState({
    text: "",
  });

  const [optionForm, setOptionForm] = useState({
    question: 0,
    text: "",
    is_correct: false,
  });

  const extractErrorMessage = (data: any): string => {
    if (!data) return "Сталася помилка.";
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;

    const firstKey = Object.keys(data)[0];
    if (!firstKey) return "Сталася помилка.";

    const value = data[firstKey];
    return Array.isArray(value) ? value[0] : String(value);
  };

  const loadTest = async () => {
    try {
      const response = await api.get(`/tests/${testId}/questions/`);
      setQuestions(response.data);
    } catch {
      setMessage("Не вдалося завантажити питання тесту.");
    }
  };

  const loadTestInfo = async () => {
    try {
      const response = await api.get("/courses/my-teaching/");
      const courses = response.data;

      for (const course of courses) {
        try {
          const testResponse = await api.get(`/tests/course/${course.id}/`);
          if (Number(testResponse.data.id) === Number(testId)) {
            setTestInfo(testResponse.data);
            return;
          }
        } catch {
          continue;
        }
      }
    } catch {
      setMessage("Не вдалося завантажити інформацію про тест.");
    }
  };

  useEffect(() => {
    loadTestInfo();
    loadTest();
  }, [testId]);

  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setQuestionForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/questions/create/", {
        test: Number(testId),
        text: questionForm.text,
      });

      setMessage("Питання успішно додано.");
      setQuestionForm({ text: "" });
      await loadTest();
    } catch (error: any) {
      setMessage(extractErrorMessage(error.response?.data));
    }
  };

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setOptionForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "question"
          ? Number(value)
          : value,
    }));
  };

  const handleCreateOption = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/answer-options/create/", {
        question: optionForm.question,
        text: optionForm.text,
        is_correct: optionForm.is_correct,
      });

      setMessage("Варіант відповіді успішно додано.");
      setOptionForm({
        question: 0,
        text: "",
        is_correct: false,
      });
      await loadTest();
    } catch (error: any) {
      setMessage(extractErrorMessage(error.response?.data));
    }
  };

  return (
    <div>
      <h1>Керування тестом</h1>

      {message && <p>{message}</p>}

      {testInfo && (
  <div
    style={{
      border: "1px solid #ccc",
      padding: "16px",
      marginBottom: "20px",
      background: "#fff",
    }}
  >
    <h2>{testInfo.title}</h2>
    <p>{testInfo.description}</p>
    <p>Прохідний бал: {testInfo.passing_score}%</p>

    <button
        onClick={() => {
          navigate(`/teacher/tests/${testInfo.id}/attempts`);
        }}
      >
        Переглянути спроби студентів
    </button>
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
        <h2>1. Додати питання</h2>

        <form onSubmit={handleCreateQuestion}>
          <div>
            <textarea
              name="text"
              placeholder="Текст питання"
              rows={4}
              value={questionForm.text}
              onChange={handleQuestionChange}
            />
          </div>

          <button type="submit">Додати питання</button>
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
        <h2>2. Додати варіант відповіді</h2>

        <form onSubmit={handleCreateOption}>
          <div>
            <select
              name="question"
              value={optionForm.question}
              onChange={handleOptionChange}
            >
              <option value={0}>Оберіть питання</option>
              {questions.map((question) => (
                <option key={question.id} value={question.id}>
                  {question.text}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              name="text"
              placeholder="Текст варіанта відповіді"
              value={optionForm.text}
              onChange={handleOptionChange}
            />
          </div>

          <div>
            <label>
              <input
                name="is_correct"
                type="checkbox"
                checked={optionForm.is_correct}
                onChange={handleOptionChange}
              />
              Правильна відповідь
            </label>
          </div>

          <button type="submit">Додати варіант</button>
        </form>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          background: "#fff",
        }}
      >
        <h2>Структура тесту</h2>

        {questions.length === 0 ? (
          <p>У тесті ще немає питань.</p>
        ) : (
          questions.map((question) => (
            <div
              key={question.id}
              style={{
                border: "1px solid #eee",
                padding: "12px",
                marginBottom: "12px",
              }}
            >
              <strong>{question.text}</strong>

              {question.options.length === 0 ? (
                <p>Варіантів відповіді ще немає.</p>
              ) : (
                <ul>
                  {question.options.map((option) => (
                    <li key={option.id}>
                      {option.text} {option.is_correct ? "✅" : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}