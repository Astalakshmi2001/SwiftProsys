// ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ roleAllowed }) => {
  const role = localStorage.getItem("role");
  const isLoggedIn = localStorage.getItem("loggedIn");

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role !== roleAllowed) return <Navigate to="/unauthorized" replace />;

  return <Outlet />; // ✅ This renders nested child routes
};

export default ProtectedRoute;
