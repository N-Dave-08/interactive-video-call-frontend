import { AlertTriangle, Trash2 } from "lucide-react";
import type { Video } from "@/types";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DeleteVideoDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	video: Video | null;
	onConfirm: () => void;
	isDeleting: boolean;
}

export function DeleteVideoDialog({
	open,
	onOpenChange,
	video,
	onConfirm,
	isDeleting,
}: DeleteVideoDialogProps) {
	if (!video) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Trash2 className="h-5 w-5 text-destructive" />
						Delete Video
					</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this video? This action cannot be
						undone.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<Alert>
						<AlertTriangle className="h-4 w-4" />
						<AlertDescription>
							You are about to delete the video: <strong>{video.title}</strong>
						</AlertDescription>
					</Alert>
					<div className="text-sm text-muted-foreground">
						<strong>Video Link:</strong> {video.link}
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isDeleting}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={onConfirm}
						disabled={isDeleting}
					>
						{isDeleting ? "Deleting..." : "Delete Video"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
