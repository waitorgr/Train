import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import type { Course, CourseItem, TestData } from "../types";

interface PublicCourseItem {
  id: number;
  title: string;
  item_type: "video" | "text" | "test";
  order: number;
}

export default function CourseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [items, setItems] = useState<CourseItem[]>([]);
  const [publicItems, setPublicItems] = useState<PublicCourseItem[]>([]);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(
    {}
  );
  const [result, setResult] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [message, setMessage] = useState("");
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [currentItem, setCurrentItem] = useState<CourseItem | null>(null);

  useEffect(() => {
    const fetchCourseAndItems = async () => {
      try {
        const coursesResponse = await api.get("/courses/");
        const foundCourse =
          coursesResponse.data.find((c: Course) => c.id === Number(id)) || null;
        setCourse(foundCourse);

        const publicItemsResponse = await api.get(`/courses/${id}/items/public/`);
        setPublicItems(publicItemsResponse.data);

        try {
          const itemsResponse = await api.get(`/courses/${id}/items/`);
          setItems(itemsResponse.data);
          setCurrentItemIndex(0);
          setCurrentItem(itemsResponse.data[0] || null);
          setAccessDenied(false);
        } catch (error: any) {
          if (error.response?.status === 401 || error.response?.status === 403) {
            setAccessDenied(true);
          } else {
            setMessage("Не вдалося завантажити вміст курсу.");
          }
        }
      } catch {
        setMessage("Не вдалося завантажити курс.");
      }
    };

    fetchCourseAndItems();
  }, [id]);

  const handleEnroll = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      navigate("/register");
      return;
    }

    try {
      await api.post("/enrollments/create/", {
        course: Number(id),
      });

      setMessage(
        "Заявку на запис подано. Доступ до матеріалів відкриється після підтвердження."
      );

      try {
        const itemsResponse = await api.get(`/courses/${id}/items/`);
        setItems(itemsResponse.data);
        setCurrentItemIndex(0);
        setCurrentItem(itemsResponse.data[0] || null);
        setAccessDenied(false);
      } catch {
        setAccessDenied(true);
      }
    } catch (error: any) {
      const data = error.response?.data;

      if (typeof data === "string") {
        setMessage(data);
      } else if (data?.detail) {
        setMessage(data.detail);
      } else if (data?.course) {
        setMessage(Array.isArray(data.course) ? data.course[0] : data.course);
      } else if (data?.non_field_errors) {
        setMessage(
          Array.isArray(data.non_field_errors)
            ? data.non_field_errors[0]
            : data.non_field_errors
        );
      } else {
        setMessage("Не вдалося записатися на курс.");
      }
    }
  };

  const loadTest = async (courseId: string) => {
    try {
      const response = await api.get(`/tests/course/${courseId}/`);
      setTestData(response.data);
      setResult("");
      setSelectedAnswers({});
    } catch {
      setMessage("Не вдалося завантажити тест.");
    }
  };

  const handleSelectAnswer = (questionId: number, optionId: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitTest = async () => {
    if (!testData) return;

    try {
      const answers = Object.entries(selectedAnswers).map(
        ([questionId, selectedOptionId]) => ({
          question_id: Number(questionId),
          selected_option_id: Number(selectedOptionId),
        })
      );

      const response = await api.post("/tests/submit/", {
        test_id: testData.id,
        answers,
      });

      setResult(
        `Результат: ${response.data.score}%. ${
          response.data.passed ? "Тест складено" : "Тест не складено"
        }`
      );
    } catch {
      setResult("Не вдалося відправити тест.");
    }
  };

  const handleNextItem = async () => {
    if (!currentItem) return;

    try {
      const response = await api.get(
        `/courses/${id}/items/next/${currentItem.order}/`
      );
      const nextItem = response.data as CourseItem;

      const nextIndex = items.findIndex((item) => item.id === nextItem.id);

      setCurrentItem(nextItem);
      setCurrentItemIndex(nextIndex >= 0 ? nextIndex : currentItemIndex + 1);
      setTestData(null);
      setResult("");
      setSelectedAnswers({});
      setMessage("");
    } catch {
      setMessage("Це останній елемент курсу.");
    }
  };

  return (
    <div>
      {course && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            marginBottom: "20px",
            background: "#fff",
          }}
        >
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <p>Викладач: {course.teacher_username}</p>
          <p>Тривалість: {course.duration_hours} годин</p>
        </div>
      )}

      {message && <p>{message}</p>}

      {accessDenied ? (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            marginBottom: "20px",
            background: "#fff",
          }}
        >
          <h2>Структура курсу</h2>

          {publicItems.length === 0 ? (
            <p>У курсі поки немає блоків.</p>
          ) : (
            publicItems.map((item) => (
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
              </div>
            ))
          )}

          <p>Щоб переглянути матеріали, потрібно записатися на курс.</p>
          <button onClick={handleEnroll}>Записатися на курс</button>
        </div>
      ) : (
        <>
          <h2>Вміст курсу</h2>

          {items.length === 0 && <p>У курсі поки немає матеріалів.</p>}

          {currentItem && (
            <>
              <p>
                Блок {currentItemIndex + 1} з {items.length}
              </p>

              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "12px",
                  marginBottom: "12px",
                  background: "#fff",
                }}
              >
                <h3>
                  {currentItem.order}. {currentItem.title}
                </h3>

                {currentItem.item_type === "video" && currentItem.video_lesson && (
                  <div>
                    {currentItem.video_lesson.description && (
                      <p>{currentItem.video_lesson.description}</p>
                    )}

                    {currentItem.video_lesson.video_url.includes("youtube.com") ||
                    currentItem.video_lesson.video_url.includes("youtu.be") ? (
                      <iframe
                        width="100%"
                        height="450"
                        src={currentItem.video_lesson.video_url
                          .replace("watch?v=", "embed/")
                          .replace("youtu.be/", "youtube.com/embed/")}
                        title={currentItem.title}
                        frameBorder="0"
                        allowFullScreen
                      />
                    ) : (
                      <video controls width="100%" style={{ maxWidth: "800px" }}>
                        <source src={currentItem.video_lesson.video_url} />
                        Ваш браузер не підтримує відео.
                      </video>
                    )}

                    <button onClick={handleNextItem} style={{ marginTop: "12px" }}>
                      Наступний блок
                    </button>
                  </div>
                )}

                {currentItem.item_type === "text" && currentItem.text_lesson && (
                  <div>
                    <p style={{ whiteSpace: "pre-line" }}>
                      {currentItem.text_lesson.content}
                    </p>

                    <button onClick={handleNextItem} style={{ marginTop: "12px" }}>
                      Наступний блок
                    </button>
                  </div>
                )}

                {currentItem.item_type === "test" && (
                  <div>
                    {!testData ? (
                      <button onClick={() => loadTest(id!)}>Відкрити тест</button>
                    ) : (
                      <div
                        style={{
                          marginTop: "20px",
                          border: "1px solid black",
                          padding: "16px",
                          background: "#fff",
                        }}
                      >
                        <h2>{testData.title}</h2>
                        <p>{testData.description}</p>

                        {testData.questions.map((question) => (
                          <div key={question.id} style={{ marginBottom: "16px" }}>
                            <p>{question.text}</p>
                            {question.options.map((option) => (
                              <label key={option.id} style={{ display: "block" }}>
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={option.id}
                                  onChange={() =>
                                    handleSelectAnswer(question.id, option.id)
                                  }
                                />
                                {option.text}
                              </label>
                            ))}
                          </div>
                        ))}

                        <button onClick={handleSubmitTest}>Завершити тест</button>

                        {result && <p>{result}</p>}

                        {result && (
                          <button onClick={handleNextItem} style={{ marginTop: "12px" }}>
                            Далі
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}