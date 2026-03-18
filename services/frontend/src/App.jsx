import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./hooks/useAuth";
import CertifyDrawPage from "./pages/private/CertifyDrawPage";
import DrawsPage from "./pages/private/DrawsPage";
import LoginPage from "./pages/public/LoginPage";
import VerifyDrawPage from "./pages/public/VerifyDrawPage";

function App() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<Layout isAuthenticated={isAuthenticated} onLogout={logout} />}
      >
        <Route index element={<Navigate to="/verify" replace />} />
        <Route path="verify" element={<VerifyDrawPage />} />
        <Route
          path="login"
          element={<LoginPage onLogin={login} isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="dashboard/certify"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <CertifyDrawPage />
            </PrivateRoute>
          }
        />
        <Route
          path="dashboard/draws"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <DrawsPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/verify" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
