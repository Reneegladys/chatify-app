import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Home from "./pages/home.jsx"; 
import Chat from './pages/chat.jsx';
import ProtectedRoute from "./components/protectedroute.jsx";
import Sidenav from "./components/sidenav.jsx";

function App() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const showSidenav = token && location.pathname.startsWith("/chat");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <>
      
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Home />} />

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
