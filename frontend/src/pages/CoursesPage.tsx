import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import type { Course } from "../types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await api.get("/courses/");
      setCourses(response.data);
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Доступні курси</h1>
      {courses.map((course) => (
        <div key={course.id} style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "12px" }}>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <p>Викладач: {course.teacher_username}</p>
          <p>Тривалість: {course.duration_hours} годин</p>
          <Link to={`/courses/${course.id}`}>Відкрити курс</Link>
        </div>
      ))}
    </div>
  );
}