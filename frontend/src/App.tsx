import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CoursesPage from "./pages/CoursesPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import CertificatesPage from "./pages/CertificatesPage";
import TeacherCoursesPage from "./pages/TeacherCoursesPage";
import TeacherCourseManagePage from "./pages/TeacherCourseManagePage";
import TeacherTestManagePage from "./pages/TeacherTestManagePage";
import TeacherTestAttemptsPage from "./pages/TeacherTestAttemptsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<CoursesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/my-courses"
            element={
              <ProtectedRoute>
                <MyCoursesPage />
              </ProtectedRoute>
            }
          />

          <Route path="/courses/:id" element={<CourseDetailsPage />} />

          <Route
            path="/teacher/courses"
            element={
              <ProtectedRoute>
                <TeacherCoursesPage />
              </ProtectedRoute>}/>
          <Route path="/teacher/courses/:id" element={<ProtectedRoute><TeacherCourseManagePage /></ProtectedRoute>}/>
          <Route path="/teacher/tests/:testId" element={<ProtectedRoute><TeacherTestManagePage /></ProtectedRoute>}/>

          <Route
            path="/certificates"
            element={
              <ProtectedRoute>
                <CertificatesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/tests/:testId/attempts"
            element={
              <ProtectedRoute>
                <TeacherTestAttemptsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}