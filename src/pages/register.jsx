import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      alert("Registrering misslyckades");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrera dig</h2>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Lösenord" onChange={handleChange} required />
      <button type="submit">Registrera</button>
    </form>
  );
};

export default Register;
