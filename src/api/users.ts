import type {
	User,
	UserPagination,
	UserQueryParams,
	UserStatistics,
} from "@/types";

export async function fetchUsers(token: string): Promise<User[]> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/users/get`,
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);
	if (!response.ok) {
		throw new Error("Failed to fetch users");
	}
	const json: { success: boolean; message: string; data: User[] } =
		await response.json();
	return json.data;
}

export async function queryUsers(
	params: UserQueryParams,
	token: string,
): Promise<{
	data: User[];
	total: number;
	statistics: UserStatistics;
	pagination: UserPagination;
}> {
	const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/api/users/get`);
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== "") {
			url.searchParams.append(key, String(value));
		}
	});

	const response = await fetch(url.toString(), {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!response.ok) {
		throw new Error("Failed to fetch users");
	}
	const json = await response.json();
	return {
		data: json.data,
		total: json.pagination?.totalCount ?? json.data.length,
		statistics: json.statistics,
		pagination: json.pagination,
	};
}

export async function updateUserCondition(
	userId: string,
	condition: string,
	token: string,
): Promise<void> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/users/update/${userId}/condition`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
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
	token: string,
): Promise<void> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/users/update/${userId}/info`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		},
	);
	if (!response.ok) {
		throw new Error("Failed to update user info");
	}
}

export async function updateUserProfilePicture(
	userId: string,
	file: File,
	token: string,
): Promise<string> {
	const formData = new FormData();
	formData.append("image", file);

	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/users/update/${userId}/profile_picture`,
		{
			method: "PUT",
			body: formData,
			headers: { Authorization: `Bearer ${token}` },
		},
	);
	if (!response.ok) {
		throw new Error("Failed to update profile picture");
	}
	const data = await response.json();
	return data.data.profile_picture;
}

export async function archiveUser(
	userId: string,
	token: string,
): Promise<void> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/users/update/${userId}/archived`,
		{
			method: "PUT",
			headers: { Authorization: `Bearer ${token}` },
		},
	);
	if (!response.ok) {
		throw new Error("Failed to archive user");
	}
}

export async function createUser(
	data: Partial<User>,
	token: string,
): Promise<void> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/users/create`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		},
	);
	if (!response.ok) {
		throw new Error("Failed to create user");
	}
}

export async function removeUserProfilePicture(
	userId: string,
	token: string,
): Promise<void> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/users/remove/${userId}/profile_picture`,
		{
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
		},
	);
	if (!response.ok) {
		throw new Error("Failed to remove profile picture");
	}
}

interface UserStatsResponse {
	totalUsers: number;
	approvedCount: number;
	rejectedCount: number;
	blockedCount: number;
	pendingCount: number;
}

export async function fetchUserStats(
	period: string,
	token: string,
): Promise<UserStatsResponse> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/users/get/stats?period=${period}`,
		{
			headers: { Authorization: `Bearer ${token}` },
		},
	);
	if (!response.ok) {
		throw new Error("Failed to fetch user statistics");
	}
	const json: { success: boolean; data: UserStatsResponse } =
		await response.json();
	return json.data;
}
