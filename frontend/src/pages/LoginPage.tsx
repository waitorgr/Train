import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { saveTokens } from "../utils/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/users/login/", {
        username,
        password,
      });

      saveTokens(response.data.access, response.data.refresh);
      navigate("/");
    } catch {
      setError("Невірний логін або пароль");
    }
  };

  return (
    <div>
      <h1>Вхід</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Логін"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Увійти</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}