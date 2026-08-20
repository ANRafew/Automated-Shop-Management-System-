import { Navigate } from "react-router-dom";

function ProtectedRoute({ role, children }) {
  const user = JSON.parse(localStorage.getItem("user")); // stored after login

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
export default ProtectedRoute;