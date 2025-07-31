import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchVideos } from "@/api/videos";
import { DataTable } from "./components/videos-data-table";

export default function VideosPage() {
	// Query params state
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");

	// Debounce search input
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearch(search);
		}, 300);
		return () => clearTimeout(handler);
	}, [search]);

	const {
		data: queryData,
		isLoading: loading,
		error,
	} = useQuery({
		queryKey: ["videos", { search: debouncedSearch }],
		queryFn: () => fetchVideos(),
	});

	if (error) return <div>{error.message || "Failed to fetch videos"}</div>;

	return (
		<>
			<div className="mb-4">
				<h2 className="text-2xl font-bold tracking-tight">Video Management</h2>
				<p className="text-muted-foreground">
					Manage educational videos and content here.
				</p>
			</div>
			<DataTable
				data={queryData?.data || []}
				total={queryData?.data?.length || 0}
				search={search}
				setSearch={setSearch}
				loading={loading}
			/>
		</>
	);
}
