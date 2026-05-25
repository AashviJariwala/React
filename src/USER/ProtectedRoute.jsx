import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useMemo } from "react";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("userToken");

  const isValidSession = useMemo(() => {
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);

      const currentTime = Math.floor(new Date() / 1000);

      if (decoded.exp < currentTime) {
        sessionStorage.removeItem("userToken");
        return false;
      }

      return true;
    } catch (error) {
      sessionStorage.removeItem("userToken");
      return false;
    }
  }, [token]);

  if (!isValidSession) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
