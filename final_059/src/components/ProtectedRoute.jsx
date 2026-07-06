import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    // If no token → block
    if (!token) {
      alert("Please log in to access this page.");
      navigate(-1);
      return;
    }

    // If role is required and user is not admin → block
    if (requiredRole && role !== requiredRole) {
      alert("You are not authorized to access this page.");
      navigate(-1);
    }

  }, [token, role, requiredRole, navigate]);

  // Block rendering if:
  // 1. No token
  // 2. Role required but mismatch
  if (!token) return null;
  if (requiredRole && role !== requiredRole) return null;

  return children;
};

export default ProtectedRoute;
