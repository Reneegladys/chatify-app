import React from "react";
import { useNavigate } from "react-router-dom";
import "./sidenav.css"; // import the CSS file

export default function SideNav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("csrfToken");
    sessionStorage.removeItem("token");
    navigate("/home");
  };

  return (
    <div className="sidenav">
      <h2 className="sidenav-title">Menu</h2>
      <button className="sidenav-logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
