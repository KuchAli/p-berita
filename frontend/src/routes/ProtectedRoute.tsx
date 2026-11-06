import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";
import type { Role } from "../features/auth/types";

type ProtectedRouteProps = {
  allowedRoles?: Role[];
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Memuat...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectPath = user.role === "admin" ? "/admin/dashboard" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
