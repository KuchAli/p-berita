import { api } from "../../../services/api";
import type { User } from "../types";

export async function loginRequest(email: string, password: string) {
  const { data } = await api.post<{ access_token: string }>("/auth/login", {
    email,
    password,
  });
  return data.access_token;
}

export async function getMe() {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

export interface RegisterPayload {
  username: string;
  password: string;
}

export async function registerRequest(payload: RegisterPayload) {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}