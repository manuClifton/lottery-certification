import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import PrivateRoute from "./components/PrivateRoute";
import PublicLayout from "./components/PublicLayout";
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
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard/certify" replace />
          ) : (
            <Navigate to="/verify" replace />
          )
        }
      />

      <Route
        path="/lottery-certification"
        element={
          <PublicLayout>
            <LoginPage onLogin={login} isAuthenticated={isAuthenticated} />
          </PublicLayout>
        }
      />

      <Route
        path="/verify"
        element={
          isAuthenticated ? (
            <AdminLayout onLogout={logout} />
          ) : (
            <PublicLayout />
          )
        }
      >
        <Route index element={<VerifyDrawPage />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <AdminLayout onLogout={logout} />
          </PrivateRoute>
        }
      >
        <Route
          path="certify"
          element={<CertifyDrawPage />}
        />
        <Route
          path="draws"
          element={<DrawsPage />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/verify" replace />} />
    </Routes>
  );
}

export default App;
