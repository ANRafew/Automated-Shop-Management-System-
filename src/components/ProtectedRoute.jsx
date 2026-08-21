import { Navigate } from "react-router-dom";

function ProtectedRoute({ role, children }) {
  const storedUser = JSON.parse(sessionStorage.getItem("user")); // stored in session after login

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  if (storedUser.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
export default ProtectedRoute;