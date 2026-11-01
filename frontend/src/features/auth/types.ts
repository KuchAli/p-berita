export type Role = "admin" | "user";

export interface User {
  id: string;
  username: string;
  role: Role;
  name: string;
}