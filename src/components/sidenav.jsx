import React from "react";
import { useNavigate } from "react-router-dom";

export default function SideNav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/home");
  };

  return (
    <div style={{ position: "fixed", left: 0, top: 0, height: "100%", width: "100px", backgroundColor: "#ddd", padding: "1rem" }}>
      <button onClick={handleLogout}>Logga ut</button>
    </div>
  );
}
