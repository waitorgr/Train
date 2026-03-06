import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    phone: "",
  });
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const extractErrorMessage = (data: any): string => {
    if (!data) return "Помилка реєстрації";

    if (typeof data === "string") return data;
    if (data.detail) return data.detail;

    const firstKey = Object.keys(data)[0];
    if (!firstKey) return "Помилка реєстрації";

    const value = data[firstKey];
    if (Array.isArray(value)) return value[0];
    return String(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/users/register/", form);
      navigate("/login");
    } catch (err: any) {
      setError(extractErrorMessage(err.response?.data));
    }
  };

  return (
    <div>
      <h1>Реєстрація</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="username"
            placeholder="Логін"
            value={form.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            name="phone"
            placeholder="Телефон"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="student">Слухач</option>
            <option value="teacher">Викладач</option>
          </select>
        </div>
        <button type="submit">Зареєструватися</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}