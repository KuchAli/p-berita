import { useContext } from "react";
import { AuthContextValue } from "../context/authContext";

export const useAuth = () => {
  const ctx = useContext(AuthContextValue);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
};
