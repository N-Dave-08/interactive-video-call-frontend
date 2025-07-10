import type { SessionsListResponse } from "@/types/sessions";

export async function fetchSessionsBySocialWorkerId(
	socialWorkerId: string,
): Promise<SessionsListResponse> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/sessions/${socialWorkerId}/list`,
	);
	if (!response.ok) {
		throw new Error("Failed to fetch sessions");
	}
	return response.json();
}

export async function fetchSessionById(sessionId: string) {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/sessions/${sessionId}`,
	);
	if (!response.ok) {
		throw new Error("Failed to fetch session details");
	}
	return response.json();
}
