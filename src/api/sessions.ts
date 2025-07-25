import type {
	Session,
	SessionsListResponse,
	CreateSessionPayload,
	SessionApiResponse
} from "@/types";

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

export async function createSession(
	data: CreateSessionPayload,
): Promise<SessionApiResponse> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/sessions/create`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		},
	);
	if (!response.ok) throw new Error("Failed to create session");
	return response.json();
}

export async function updateSession(
	sessionId: string,
	data: Partial<Session>,
): Promise<SessionApiResponse> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/sessions/update/${sessionId}`,
		{
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		},
	);
	if (!response.ok) throw new Error("Failed to update session");
	return response.json();
}

export async function deleteSession(sessionId: string): Promise<void> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/sessions/delete/${sessionId}`,
		{
			method: "DELETE",
		},
	);
	if (!response.ok) {
		throw new Error("Failed to delete session");
	}
}
