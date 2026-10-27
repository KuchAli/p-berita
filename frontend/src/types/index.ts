export type Role = "admin" | "user";

export interface User {
    id: string;
    usernmae: string;
    name: string;
    role: Role;
}