import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  if (user?.role !== "admin" && user?.role !== "superadmin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;