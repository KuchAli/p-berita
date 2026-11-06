import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";
import AuthLayout from "../layouts/AuthLayout";
import { DashboardPage } from "../pages/admin/DashboardPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import { HomePage } from "../pages/user/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import RoleRoute from "./RoleRoute";
import { HOME_BY_ROLE } from "../utils/constants";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={HOME_BY_ROLE[user.role]} replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to={HOME_BY_ROLE[user.role]} replace />
            ) : (
              <RegisterPage />
            )
          }
        />
      </Route>

      <Route element={<RoleRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<DashboardPage />} />
      </Route>

      <Route element={<RoleRoute allowedRoles={["user"]} />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
