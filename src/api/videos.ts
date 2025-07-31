import type { VideosApiResponse, Video } from "@/types";

export async function fetchVideos(): Promise<VideosApiResponse> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/videos/get`,
	);
	if (!response.ok) {
		throw new Error("Failed to fetch videos");
	}
	return response.json();
}

export async function addVideo(videoData: {
	title: string;
	link: string;
}): Promise<{ success: boolean; message: string; data?: Video }> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/videos/add`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(videoData),
		},
	);
	if (!response.ok) {
		throw new Error("Failed to add video");
	}
	return response.json();
}

export async function deleteVideo(
	id: string,
): Promise<{ success: boolean; message: string }> {
	const response = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/videos/delete/${id}`,
		{
			method: "DELETE",
		},
	);
	if (!response.ok) {
		throw new Error("Failed to delete video");
	}
	return response.json();
}
