import type {
	AvatarData,
	ChildData,
	EmotionalExpression,
	Session,
	SessionsListResponse,
} from "@/types/sessions";

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

export interface CreateSessionPayload {
	social_worker_id: string;
	title: string;
	child_data: ChildData;
	avatar_data: AvatarData;
	emotional_expression: EmotionalExpression;
	session_notes: string;
	tags: string[];
	stage: string;
}

export async function createSession(
	data: CreateSessionPayload,
): Promise<Session> {
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
