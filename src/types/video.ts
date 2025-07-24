export interface Video {
	id: string;
	title: string;
	link: string;
	createdAt: string;
	updatedAt: string;
}

export interface VideosApiResponse {
	success: boolean;
	message: string;
	data: Video[];
}
