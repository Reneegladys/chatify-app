import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Home from "./pages/home.jsx"; // Combined auth page
import Chat from './pages/chat.jsx';
import ProtectedRoute from "./components/protectedroute.jsx";
import Sidenav from "./components/sidenav.jsx";

function App() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const showSidenav = token && location.pathname.startsWith("/chat");

  // Load user from localStorage to pass to Chat
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <>
      {showSidenav && <Sidenav />}
      <Routes>
        {/* Redirect root to combined auth page */}
        <Route path="/" element={<Navigate to="/Home" replace />} />

        {/* Existing individual pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Combined login & register page */}
        <Route path="/home" element={<Home />} />

        {/* Chat route */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
