import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";

const BASE_URL = "https://chatify-api.up.railway.app";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });

  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      // Hämta CSRF-token
      const csrfRes = await fetch(`${BASE_URL}/csrf`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!csrfRes.ok) throw new Error("Kunde inte hämta CSRF-token");

      const { csrfToken } = await csrfRes.json();
      localStorage.setItem("csrfToken", csrfToken); 

      // Skicka registerdata med CSRF-token
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, csrfToken }),
      });

      if (res.status === 201) {
        setSuccessMsg(
          "Registrering lyckades! Du skickas vidare till inloggning..."
        );
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Ett fel uppstod vid registrering");
      }
    } catch {
      setError("Nätverksfel eller servern svarade inte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleSubmit} className="register-form" noValidate>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          autoComplete="username"
          className="register-input"
        />
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
          className="register-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          minLength={6}
          className="register-input"
        />
        <input
          name="avatar"
          placeholder="Avatar URL (optional)"
          value={form.avatar}
          onChange={handleChange}
          autoComplete="off"
          className="register-input"
        />
        <button type="submit" disabled={loading} className="register-button">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {error && (
        <p className="register-error" role="alert" aria-live="assertive">
          {error}
        </p>
      )}
      {successMsg && (
        <p className="register-success" role="alert" aria-live="polite">
          {successMsg}
        </p>
      )}
    </div>
  );
}
