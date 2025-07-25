import type { Activity } from "@/types";

export async function fetchActivities(): Promise<Activity[]> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/activities/get`,
	);
	if (!response.ok) {
		throw new Error("Failed to fetch activities");
	}
	const json = await response.json();
	return json.data;
}
