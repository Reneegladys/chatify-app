import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://chatify-api.up.railway.app";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Inloggningen misslyckades");
        return;
      }

      // Spara token i localStorage
      localStorage.setItem("token", data.token);

      // Navigera till chat-sidan
      navigate("/chat");
    } catch (error) {
      console.error("Fel vid inloggning:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Logga in</h2>
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input
        name="password"
        type="password"
        placeholder="Lösenord"
        onChange={handleChange}
        required
        autoComplete="current-password"
      />
      <button type="submit">Logga in</button>
    </form>
  );
}
