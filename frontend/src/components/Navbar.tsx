import { Link, useNavigate } from "react-router-dom";
import { clearTokens, isAuthenticated } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens();
    navigate("/login");
  };

  return (
    <nav style={{ padding: "16px", borderBottom: "1px solid #ccc", marginBottom: "20px" }}>
      <Link to="/" style={{ marginRight: "12px" }}>Курси</Link>
      <Link to="/my-courses" style={{ marginRight: "12px" }}>Мої курси</Link>
      <Link to="/certificates" style={{ marginRight: "12px" }}>Сертифікати</Link>
      <Link to="/teacher/courses" style={{ marginRight: "12px" }}>Кабінет викладача</Link>

      {!isAuthenticated() ? (
        <>
          <Link to="/login" style={{ marginRight: "12px" }}>Вхід</Link>
          <Link to="/register">Реєстрація</Link>
        </>
      ) : (
        <button onClick={handleLogout}>Вийти</button>
      )}
    </nav>
  );
}