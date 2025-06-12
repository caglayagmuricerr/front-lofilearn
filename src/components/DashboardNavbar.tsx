import { Link, useNavigate } from "react-router-dom";

function DashboardNavbar({ role }: { role: string | undefined }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getNavLinks = () => {
    switch (role) {
      case "student":
        return (
          <>
            <Link to="/student-dashboard" className="mr-4">
              Home
            </Link>
            <Link to="/join" className="mr-4">
              Join Quiz
            </Link>
          </>
        );
      case "teacher":
        return (
          <>
            <Link to="/teacher-dashboard" className="mr-4">
              Home
            </Link>
            <Link to="/create" className="mr-4">
              Create Quiz
            </Link>
            <Link to="/manage-quizzes" className="mr-4">
              Manage Quizzes
            </Link>
          </>
        );
      case "admin":
        return (
          <>
            <Link to="/admin-dashboard" className="mr-4">
              Admin Home
            </Link>
            <Link to="/user-management" className="mr-4">
              User Management
            </Link>
            <Link to="/system-settings" className="mr-4">
              System Settings
            </Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="bg-chestnut-500 p-4 text-white flex justify-between">
      <div className="text-lg font-bold">Dashboard</div>
      <div className="flex items-center">
        {getNavLinks()}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default DashboardNavbar;
