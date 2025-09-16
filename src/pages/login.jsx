import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import "./login.css";

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
      const res = await login(form);
      const { token, user } = res.data;
      sessionStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/chat");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
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