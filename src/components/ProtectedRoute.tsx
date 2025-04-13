// *******************************************
//  NEEDS TO BE CHANGED NO MORE LOCAL STORAGE
// *******************************************

import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userRole = payload.role;

      if (userRole === requiredRole) {
        setIsAuthorized(true);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }

    setLoading(false);
  }, [requiredRole]);

  if (loading) return <p>Loading...</p>;

  return isAuthorized ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
