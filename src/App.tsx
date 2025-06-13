import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import Navbar from "./components/Navbar";
import DashboardNavbar from "./components/DashboardNavbar";
import MusicPlayer from "./components/MusicPlayer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateQuiz from "./pages/CreateQuiz";
import PlayQuiz from "./pages/PlayQuiz";
import JoinQuiz from "./pages/JoinQuiz";
import FourOFour from "./pages/FourOFour";
import VerifyEmail from "./pages/VerifyEmail";
import SuggestPage from "./pages/SuggestPage";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";

import ProtectedRoute from "./components/ProtectedRoute";

import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const cookieString = document.cookie;
      const decodedToken: { role: string } = jwtDecode(
        decodeURIComponent(cookieString.replace("Bearer%20", ""))
      );
      setRole(decodedToken.role);
    } catch (error) {
      console.error("Error decoding token:", error);
      setRole(null);
    }
  }, [location]);

  // routes that should show the regular Navbar
  const regularNavbarRoutes = ["/", "/login", "/register"];
  const shouldShowRegularNavbar = regularNavbarRoutes.includes(
    location.pathname
  );

  // routes that should show the DashboardNavbar
  const dashboardRoutes = [
    "/student-dashboard",
    "/teacher-dashboard",
    "/admin-dashboard",
    "/create",
    "/play",
    "/join",
  ];

  const shouldShowDashboardNavbar = dashboardRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // exclude MusicPlayer on these routes because they will have their own music
  // NOTE: i dont have time for this rn
  const excludeMPRoutes = ["/play"];
  const shouldShowMP = !excludeMPRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="min-h-screen bg-brown-500">
      {shouldShowRegularNavbar && <Navbar />}
      {shouldShowDashboardNavbar && role && <DashboardNavbar role={role} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreateQuiz />} />
        <Route path="/play/:inviteCode" element={<PlayQuiz />} />
        <Route path="/join" element={<JoinQuiz />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/suggest" element={<SuggestPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<FourOFour />} />
      </Routes>
      {shouldShowMP && <MusicPlayer />}
    </div>
  );
}
export default App;
