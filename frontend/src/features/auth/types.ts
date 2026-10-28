export interface User {
    id: string;
    username: string;
    isAdmin?: boolean
    name: string
}

export interface AuthState {
    token: string | null;
    user: User | null;
    loading: boolean;
    error: string | null
}