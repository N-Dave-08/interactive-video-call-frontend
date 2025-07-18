import type { User } from "@/types/user";

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
