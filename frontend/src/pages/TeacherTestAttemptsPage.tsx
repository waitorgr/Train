import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

interface TestAttempt {
  id: number;
  student: number;
  test: number;
  test_title: string;
  score: number;
  passed: boolean;
  checked_by: number | null;
  completed_at: string;
}

export default function TeacherTestAttemptsPage() {
  const { testId } = useParams();

  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [message, setMessage] = useState("");
  const [scores, setScores] = useState<Record<number, number>>({});

  const extractErrorMessage = (data: any): string => {
    if (!data) return "Сталася помилка.";
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;

    const firstKey = Object.keys(data)[0];
    if (!firstKey) return "Сталася помилка.";

    const value = data[firstKey];
    return Array.isArray(value) ? value[0] : String(value);
  };

  const loadAttempts = async () => {
    try {
      const response = await api.get(`/tests/${testId}/attempts/`);
      setAttempts(response.data);

      const initialScores: Record<number, number> = {};
      response.data.forEach((attempt: TestAttempt) => {
        initialScores[attempt.id] = attempt.score;
      });
      setScores(initialScores);
    } catch (error: any) {
      setMessage(extractErrorMessage(error.response?.data));
    }
  };

  useEffect(() => {
    loadAttempts();
  }, [testId]);

  const handleScoreChange = (attemptId: number, value: string) => {
    setScores((prev) => ({
      ...prev,
      [attemptId]: Number(value),
    }));
  };

  const handleCheckAttempt = async (attemptId: number) => {
    try {
      await api.post(`/attempts/${attemptId}/check/`, {
        score: scores[attemptId],
      });

      setMessage("Спробу успішно перевірено.");
      await loadAttempts();
    } catch (error: any) {
      setMessage(extractErrorMessage(error.response?.data));
    }
  };

  return (
    <div>
      <h1>Спроби проходження тесту</h1>

      {message && <p>{message}</p>}

      {attempts.length === 0 ? (
        <p>Спроб поки немає.</p>
      ) : (
        attempts.map((attempt) => (
          <div
            key={attempt.id}
            style={{
              border: "1px solid #ccc",
              padding: "16px",
              marginBottom: "16px",
              background: "#fff",
            }}
          >
            <h3>Спроба #{attempt.id}</h3>
            <p>ID студента: {attempt.student}</p>
            <p>Тест: {attempt.test_title}</p>
            <p>Поточний бал: {attempt.score}</p>
            <p>Статус: {attempt.passed ? "Складено" : "Не складено"}</p>
            <p>
              Дата проходження:{" "}
              {new Date(attempt.completed_at).toLocaleString()}
            </p>
            <p>
              Перевірено викладачем:{" "}
              {attempt.checked_by ? "Так" : "Ні"}
            </p>

            <div style={{ marginTop: "12px" }}>
              <input
                type="number"
                min={0}
                max={100}
                value={scores[attempt.id] ?? 0}
                onChange={(e) =>
                  handleScoreChange(attempt.id, e.target.value)
                }
              />
              <button
                onClick={() => handleCheckAttempt(attempt.id)}
                style={{ marginLeft: "8px" }}
              >
                Перевірити вручну
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}