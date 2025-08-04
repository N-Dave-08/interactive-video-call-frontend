import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Function to convert YouTube URLs to embed format
export const getYouTubeEmbedUrl = (url: string): string => {
	try {
		// Handle different YouTube URL formats
		let videoId: string | null = null;

		// youtube.com/watch?v=VIDEO_ID
		const watchMatch = url.match(
			/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
		);
		if (watchMatch) {
			videoId = watchMatch[1];
		}

		if (videoId) {
			return `https://www.youtube.com/embed/${videoId}`;
		}

		// If it's already an embed URL, return as is
		if (url.includes("youtube.com/embed/")) {
			return url;
		}

		// Fallback to original URL if no match found
		return url;
	} catch {
		return url;
	}
};

// Function to extract YouTube video ID and get thumbnail
export const getYouTubeThumbnail = (url: string): string | undefined => {
	try {
		// Handle different YouTube URL formats
		let videoId: string | null = null;

		// youtube.com/watch?v=VIDEO_ID
		const watchMatch = url.match(
			/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
		);
		if (watchMatch) {
			videoId = watchMatch[1];
		}

		if (videoId) {
			// Try maxresdefault first, fallback to hqdefault if not available
			return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
		}

		return undefined;
	} catch {
		return undefined;
	}
};
