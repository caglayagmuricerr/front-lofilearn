import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        const token = document.cookie;
        console.log("Token found:", token);
        if (!token) {
          throw new Error("No token found");
        }

        const decodedToken: { role: string } = jwtDecode(
          decodeURIComponent(token.replace("Bearer%20", ""))
        );

        if (decodedToken.role === requiredRole) {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [requiredRole]);

  if (loading) return <p>Loading...</p>;

  return isAuthorized ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
