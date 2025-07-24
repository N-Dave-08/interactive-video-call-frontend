import type { VideosApiResponse } from "@/types/video";

export async function fetchVideos(): Promise<VideosApiResponse> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/videos/get`,
	);
	if (!response.ok) {
		throw new Error("Failed to fetch videos");
	}
	return response.json();
}
