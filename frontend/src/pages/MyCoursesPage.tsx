import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

interface Enrollment {
  id: number;
  course: number;
  course_title: string;
  enrollment_date: string;
  status: string;
}

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    const fetchMyCourses = async () => {
      const response = await api.get("/enrollments/my/");
      setEnrollments(response.data);
    };

    fetchMyCourses();
  }, []);

  return (
    <div>
      <h1>Мої курси</h1>
      {enrollments.map((item) => (
        <div key={item.id} style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "12px" }}>
          <h2>{item.course_title}</h2>
          <p>Статус: {item.status}</p>
          <Link to={`/courses/${item.course}`}>Перейти до курсу</Link>
        </div>
      ))}
    </div>
  );
}