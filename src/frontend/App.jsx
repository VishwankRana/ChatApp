import { Routes, Route, useNavigate } from "react-router-dom";
import Chat from "./pages/Chat";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/chat" element={<Chat handleLogout={handleLogout} />} />
    </Routes>
  );
}

export default App;
