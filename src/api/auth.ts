import type { LoginResponse, RegisterRequest, RegisterResponse } from "@/types";

interface ApiError extends Error {
	response: Response;
}

export async function login(
	email: string,
	password: string,
): Promise<LoginResponse> {
	const res = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		},
	);
	if (!res.ok) {
		const error = new Error("Login failed") as ApiError;
		error.response = res;
		throw error;
	}
	return res.json();
}

export async function register(
	payload: RegisterRequest,
): Promise<RegisterResponse> {
	const res = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/users/create`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		},
	);
	const data = await res.json();
	if (!res.ok) throw new Error(data.message || "Registration failed");
	return data;
}
