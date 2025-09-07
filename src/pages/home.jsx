import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <button className="landing-btn" onClick={() => navigate("/login")}>
        Login
      </button>
      <button className="landing-btn" onClick={() => navigate("/register")}>
        Register
      </button>
    </div>
  );
}
