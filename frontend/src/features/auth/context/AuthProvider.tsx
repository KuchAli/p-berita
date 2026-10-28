import { useEffect, useState, type ReactNode } from "react";
import { AuthContextValue } from "./authContext";
import { loginRequest, getMe } from "../services/authService";
import type { User } from "../types";

const TOKEN_KEY = "token";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(
    () => !!localStorage.getItem(TOKEN_KEY),
  );

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;

    getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  async function login(username: string, password: string) {
    const token = await loginRequest(username, password);
    localStorage.setItem(TOKEN_KEY, token);
    const me = await getMe();
    setUser(me);
    return me;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  return (
    <AuthContextValue.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContextValue.Provider>
  );
};

export default AuthProvider;
