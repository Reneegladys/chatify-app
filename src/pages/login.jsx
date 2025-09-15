import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./login.css"; 

const BASE_URL = "https://chatify-api.up.railway.app";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Hämta CSRF-token
      const csrfRes = await fetch(`${BASE_URL}/csrf`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!csrfRes.ok) throw new Error("Misslyckades hämta CSRF-token");
      const { csrfToken } = await csrfRes.json();
      localStorage.setItem("csrfToken", csrfToken); // <-- Add this line

      //  Skicka login-data med CSRF-token i body
      const loginRes = await fetch(`${BASE_URL}/auth/token`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          csrfToken: csrfToken,
        }),
      });

      const data = await loginRes.json();

      if (loginRes.ok) {
        // Dekoda JWT-token
        const decoded = jwtDecode(data.token);

        // Spara token + användardata i localStorage
        
        sessionStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(decoded));

        // Navigera till skyddad sida
        navigate("/chat");
      } else {
        setError(data.error || "Felaktiga inloggningsuppgifter");
      }
    } catch (err) {
      setError("Nätverksfel eller serverfel: " + err.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          autoComplete="username"
          className="login-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
          className="login-input"
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
}
