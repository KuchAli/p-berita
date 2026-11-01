import type { Role } from "../features/auth/types";

export const TOKEN_KEY = "token";

export const HOME_BY_ROLE: Record<Role, string> = {
  admin: "/admin/dashboard",
  user: "/",
};

export const CATEGORIES = [
  "Terkini",
  "Politik",
  "Teknologi",
  "Olahraga",
  "Hiburan",
  "Ekonomi",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const REPORT_REASONS = [
  "Hoax / Misinformasi",
  "Spam",
  "Konten tidak pantas",
  "Ujaran kebencian",
  "Lainnya",
] as const;
