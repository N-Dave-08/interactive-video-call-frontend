export interface LoginResponse {
	success: boolean;
	message: string;
	token: string;
	user: {
		id: string;
		email: string;
		first_name: string;
		last_name: string;
		place_of_assignment: string;
		role: string;
		condition: string;
	};
}

export interface RegisterRequest {
	first_name: string;
	last_name: string;
	username: string;
	place_of_assignment: string;
	phone_number: string;
	email: string;
	password: string;
}

export interface RegisterResponse {
	state: string;
	message: string;
	data: {
		id: string;
		role: string;
		condition: string;
		first_name: string;
		last_name: string;
		username: string;
		email: string;
		password: string;
		phone_number: string;
		place_of_assignment: string;
		updatedAt: string;
		createdAt: string;
	};
}

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
