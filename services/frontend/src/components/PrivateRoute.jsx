import { Navigate } from "react-router-dom";

function PrivateRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/lottery-certification" replace />;
  }

  return children;
}

export default PrivateRoute;
