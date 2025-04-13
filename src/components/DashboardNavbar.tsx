import { Link } from "react-router-dom";

function DashboardNavbar({ role }: { role: string | undefined }) {
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
            <Link to="/student-profile">Profile</Link>
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
            <Link to="/teacher-profile">Profile</Link>
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
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <div className="text-lg font-bold">Dashboard</div>
      <div>{getNavLinks()}</div>
    </nav>
  );
}

export default DashboardNavbar;
