import type { User } from "@/types/user";

export interface UserQueryParams {
	search?: string;
	role?: string;
	page?: number;
	rowsPerPage?: number;
	condition?: string;
	place_of_assignment?: string;
}

export async function fetchUsers(): Promise<User[]> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/users/get`,
	);
	if (!response.ok) {
		throw new Error("Failed to fetch users");
	}
	const json: { success: boolean; message: string; data: User[] } =
		await response.json();
	return json.data;
}

export async function queryUsers(params: UserQueryParams): Promise<{
	data: User[];
	total: number;
}> {
	const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/api/users/get`);
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== "") {
			url.searchParams.append(key, String(value));
		}
	});

	// Debug: log the full URL and params
	// console.log("[queryUsers] Fetching:", url.toString(), "Params:", params);

	const response = await fetch(url.toString());
	if (!response.ok) {
		throw new Error("Failed to fetch users");
	}
	const json = await response.json();
	// Use pagination.totalCount for total
	return {
		data: json.data,
		total: json.pagination?.totalCount ?? json.data.length,
	};
}

export async function updateUserCondition(
	userId: string,
	condition: string,
): Promise<void> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/users/update/${userId}/condition`,
		{
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ condition }),
		},
	);
	if (!response.ok) {
		throw new Error("Failed to update user condition");
	}
}

export async function updateUserInfo(
	userId: string,
	data: Partial<User>,
): Promise<void> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/users/update/${userId}/info`,
		{
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		},
	);
	if (!response.ok) {
		throw new Error("Failed to update user info");
	}
}

export async function deleteUser(userId: string): Promise<void> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/users/delete/${userId}`,
		{
			method: "DELETE",
		},
	);
	if (!response.ok) {
		throw new Error("Failed to delete user");
	}
}

export async function createUser(data: Partial<User>): Promise<void> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/users/create`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		},
	);
	if (!response.ok) {
		throw new Error("Failed to create user");
	}
}
