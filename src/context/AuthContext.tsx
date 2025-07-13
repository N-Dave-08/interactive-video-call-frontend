import type React from "react";
import { createContext, useState } from "react";
import type { LoginResponse } from "@/api/auth";

interface AuthContextType {
	user: LoginResponse["user"] | null;
	token: string | null;
	login: (user: LoginResponse["user"], token: string) => void;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<LoginResponse["user"] | null>(() =>
		JSON.parse(localStorage.getItem("user") || "null"),
	);
	const [token, setToken] = useState<string | null>(() =>
		localStorage.getItem("token"),
	);

	const login = (user: LoginResponse["user"], token: string) => {
		setUser(user);
		setToken(token);
		localStorage.setItem("user", JSON.stringify(user));
		localStorage.setItem("token", token);
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("user");
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider value={{ user, token, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}
