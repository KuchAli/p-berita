import ProtectedRoute from "./ProtectedRoute";
import type { Role } from "../features/auth/types";

type RoleRouteProps = {
  allowedRoles: Role[];
};

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  return <ProtectedRoute allowedRoles={allowedRoles} />;
};

export default RoleRoute;
