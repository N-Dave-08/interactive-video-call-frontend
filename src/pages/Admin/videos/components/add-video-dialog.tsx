import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { addVideo } from "@/api/videos";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddVideoDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AddVideoDialog({ open, onOpenChange }: AddVideoDialogProps) {
	const [title, setTitle] = useState("");
	const [link, setLink] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const queryClient = useQueryClient();

	const addMutation = useMutation({
		mutationFn: addVideo,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["videos"] });
			toast.success("Video added successfully");
			handleClose();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to add video");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || !link.trim()) {
			toast.error("Please fill in all fields");
			return;
		}

		setIsSubmitting(true);
		addMutation.mutate(
			{ title: title.trim(), link: link.trim() },
			{
				onSettled: () => {
					setIsSubmitting(false);
				},
			},
		);
	};

	const handleClose = () => {
		setTitle("");
		setLink("");
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add New Video</DialogTitle>
					<DialogDescription>
						Add a new educational video to the platform.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Enter video title"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="link">Video Link</Label>
						<Input
							id="link"
							value={link}
							onChange={(e) => setLink(e.target.value)}
							placeholder="Enter video URL (YouTube, Vimeo, etc.)"
							required
						/>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Adding..." : "Add Video"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
