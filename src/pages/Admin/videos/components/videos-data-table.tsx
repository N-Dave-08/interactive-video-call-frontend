import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	Play,
	Plus,
	Search,
	Table2,
	Trash2,
	Video as VideoIcon,
	X,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { deleteVideo } from "@/api/videos";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SpinnerLoading from "@/components/ui/spinner-loading";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Video } from "@/types";
import { DeleteVideoDialog } from "./delete-video-dialog";
import { AddVideoDialog } from "./add-video-dialog";

interface DataTableProps {
	data: Video[];
	total: number;
	search: string;
	setSearch: (v: string) => void;
	loading: boolean;
}

export function DataTable({
	data,
	search,
	setSearch,
	loading,
}: DataTableProps) {
	const [addDialogOpen, setAddDialogOpen] = React.useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
	const [deletingVideo, setDeletingVideo] = React.useState<Video | null>(null);
	const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");

	const queryClient = useQueryClient();

	// Function to extract YouTube video ID and get thumbnail
	const getYouTubeThumbnail = (url: string): string | undefined => {
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

	// Function to get YouTube embed URL
	const getYouTubeEmbedUrl = (url: string): string | undefined => {
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

			return undefined;
		} catch {
			return undefined;
		}
	};

	// Delete mutation
	const deleteMutation = useMutation({
		mutationFn: deleteVideo,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["videos"] });
			toast.success("Video deleted successfully");
			setDeleteDialogOpen(false);
			setDeletingVideo(null);
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete video");
		},
	});

	const handleDelete = (video: Video) => {
		setDeletingVideo(video);
		setDeleteDialogOpen(true);
	};

	const handleConfirmDelete = () => {
		if (deletingVideo) {
			deleteMutation.mutate(deletingVideo.id);
		}
	};

	// Filter data based on search
	const filteredData = React.useMemo(() => {
		if (!search) return data;
		return data.filter(
			(video) =>
				video.title.toLowerCase().includes(search.toLowerCase()) ||
				video.link.toLowerCase().includes(search.toLowerCase()),
		);
	}, [data, search]);

	// Use filtered data directly without pagination
	const displayData = filteredData;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button size="sm" onClick={() => setAddDialogOpen(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Add Video
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant={viewMode === "grid" ? "default" : "outline"}
						size="sm"
						onClick={() => setViewMode("grid")}
					>
						<VideoIcon className="h-4 w-4 mr-2" />
						Grid
					</Button>
					<Button
						variant={viewMode === "table" ? "default" : "outline"}
						size="sm"
						onClick={() => setViewMode("table")}
					>
						<Table2 className="h-4 w-4 mr-2" />
						Table
					</Button>
				</div>
			</div>

			{/* Search */}
			<div className="flex items-center gap-2">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search videos..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-8"
					/>
				</div>
			</div>

			{/* Content */}
			{viewMode === "grid" ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{displayData.map((video) => (
						<Card key={video.id} className="relative group">
							<CardContent className="p-4">
								{/* Video Thumbnail/Preview */}
								<div className="aspect-[16/9] w-full mb-3 relative rounded-lg overflow-hidden bg-muted">
									{getYouTubeEmbedUrl(video.link) ? (
										<iframe
											src={getYouTubeEmbedUrl(video.link)}
											title={video.title}
											className="w-full h-full"
											frameBorder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
										/>
									) : (
										<div className="absolute inset-0 flex items-center justify-center">
											<Play className="h-8 w-8 text-muted-foreground" />
										</div>
									)}
									{/* Action buttons overlay */}
									<div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDelete(video)}
											className="h-6 w-6 p-0"
										>
											<X className="h-3 w-3" />
										</Button>
									</div>
								</div>

								{/* Video Info */}
								<CardTitle className="text-sm font-medium line-clamp-2 mb-1">
									{video.title}
								</CardTitle>
								<p className="text-xs text-muted-foreground line-clamp-1">
									{video.link}
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									{new Date(video.createdAt).toLocaleDateString()}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<div className="relative rounded-lg border bg-card">
					<Table>
						<TableHeader>
							<TableRow className="border-b bg-muted/50">
								<TableHead className="font-semibold">Thumbnail</TableHead>
								<TableHead className="font-semibold">Title</TableHead>
								<TableHead className="font-semibold">Link</TableHead>
								<TableHead className="font-semibold">Created</TableHead>
								<TableHead className="font-semibold">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								Array.from({ length: 10 }).map((_, i) => (
									<TableRow
										key={`skeleton-row-${i + 1}`}
										className="border-none"
									>
										<TableCell className="py-3">
											<div className="w-20 h-12 bg-muted rounded animate-pulse" />
										</TableCell>
										<TableCell className="py-3">
											<div className="h-4 bg-muted rounded animate-pulse" />
										</TableCell>
										<TableCell className="py-3">
											<div className="h-4 bg-muted rounded animate-pulse" />
										</TableCell>
										<TableCell className="py-3">
											<div className="h-4 bg-muted rounded animate-pulse" />
										</TableCell>
										<TableCell className="py-3">
											<div className="h-4 bg-muted rounded animate-pulse" />
										</TableCell>
									</TableRow>
								))
							) : displayData.length ? (
								displayData.map((video) => (
									<TableRow key={video.id}>
										<TableCell className="py-3">
											<div className="w-20 h-12 relative rounded overflow-hidden bg-muted">
												{getYouTubeThumbnail(video.link) ? (
													<img
														src={getYouTubeThumbnail(video.link)}
														alt={video.title}
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="absolute inset-0 flex items-center justify-center">
														<Play className="h-4 w-4 text-muted-foreground" />
													</div>
												)}
											</div>
										</TableCell>
										<TableCell className="py-3">
											<div className="font-medium">{video.title}</div>
										</TableCell>
										<TableCell className="py-3">
											<a
												href={video.link}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 hover:text-blue-800 underline truncate block max-w-xs"
											>
												{video.link}
											</a>
										</TableCell>
										<TableCell className="py-3">
											<div className="text-sm text-muted-foreground">
												{new Date(video.createdAt).toLocaleDateString()}
											</div>
										</TableCell>
										<TableCell className="py-3">
											<div className="flex items-center gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleDelete(video)}
												>
													<Trash2 className="h-4 w-4 mr-2" />
													Delete
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={5} className="h-24 text-center">
										<div className="flex flex-col items-center gap-2 text-muted-foreground">
											<Search className="h-8 w-8" />
											<p>No videos found.</p>
										</div>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
					{loading && <SpinnerLoading />}
				</div>
			)}

			{/* Add Video Dialog */}
			<AddVideoDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

			{/* Delete Video Dialog */}
			<DeleteVideoDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				video={deletingVideo}
				onConfirm={handleConfirmDelete}
				isDeleting={deleteMutation.isPending}
			/>
		</div>
	);
}
