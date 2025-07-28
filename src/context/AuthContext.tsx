import type React from "react";
import { createContext, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { login as loginApi, register as registerApi } from "@/api/auth";
import { fetchUsers } from "@/api/users";
import type { LoginResponse, RegisterRequest } from "@/types";

interface AuthContextType {
	user: LoginResponse["user"] | null;
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	register: (data: RegisterRequest) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
	invalidateUser: () => void;
	updateUserState: (updates: Partial<LoginResponse["user"]>) => void;
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
	const [isLoading, setIsLoading] = useState(true);
	const queryClient = useQueryClient();

	// Query for user data with real-time updates
	const { data: userData, isLoading: userLoading } = useQuery({
		queryKey: ["user", token],
		queryFn: async () => {
			if (!token) return null;
			// Only fetch all users if admin
			if (user?.role === 'admin') {
				const users = await fetchUsers(token);
				const currentUser = users.find(u => u.email === user?.email);
				return currentUser || user;
			} else {
				// For non-admins, just return the current user from localStorage
				return user;
			}
		},
		enabled: !!token,
		refetchInterval: 30000, // Refetch every 30 seconds
		staleTime: 0, // Always consider data stale to allow immediate refetch
		refetchOnWindowFocus: true, // Refetch when window gains focus
	});



	useEffect(() => {
		setIsLoading(false);
	}, []);

	// Update user data when query data changes
	useEffect(() => {
		if (userData) {
			// Convert User type to LoginResponse["user"] type
			const convertedUser = {
				id: userData.id,
				email: userData.email,
				first_name: userData.first_name,
				last_name: userData.last_name,
				place_of_assignment: userData.place_of_assignment,
				role: userData.role,
				condition: userData.condition,
				profile_picture: userData.profile_picture || undefined,
			};
			setUser(convertedUser);
			localStorage.setItem("user", JSON.stringify(convertedUser));
		}
	}, [userData]);

	const login = async (email: string, password: string) => {
		const response = await loginApi(email, password);
		setToken(response.token);
		setUser(response.user);
		localStorage.setItem("token", response.token);
		localStorage.setItem("user", JSON.stringify(response.user));
		
		// Invalidate and refetch user data
		queryClient.invalidateQueries({ queryKey: ["user"] });
	};

	const register = async (data: RegisterRequest) => {
		await registerApi(data);
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		queryClient.clear();
	};

	const invalidateUser = () => {
		queryClient.invalidateQueries({ queryKey: ["user"] });
		// Force immediate refetch
		queryClient.refetchQueries({ queryKey: ["user"] });
	};

	const updateUserState = (updates: Partial<LoginResponse["user"]>) => {
		setUser(prev => {
			if (!prev) return null;
			const updatedUser = { ...prev, ...updates };
			localStorage.setItem("user", JSON.stringify(updatedUser));
			return updatedUser;
		});
	};

	return (
		<AuthContext.Provider value={{ user, token, login, register, logout, isLoading: isLoading || userLoading, invalidateUser, updateUserState }}>
			{children}
		</AuthContext.Provider>
	);
}
