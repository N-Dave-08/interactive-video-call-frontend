import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CancelSessionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCancel: () => void;
	loading?: boolean;
	error?: string | null;
}

export const CancelSessionDialog: React.FC<CancelSessionDialogProps> = ({
	open,
	onOpenChange,
	onCancel,
	loading = false,
	error,
}) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent onClick={(e) => e.stopPropagation()}>
			<DialogHeader>
				<DialogTitle className="text-xl font-bold text-gray-800">
					Cancel Session
				</DialogTitle>
				<DialogDescription className="text-gray-600">
					Are you sure you want to cancel this session? This action cannot be
					undone.
				</DialogDescription>
			</DialogHeader>
			{error && (
				<div className="text-red-500 text-sm text-center mb-2">{error}</div>
			)}
			<DialogFooter className="flex justify-end gap-2">
				<Button
					type="button"
					variant="outline"
					onClick={() => onOpenChange(false)}
				>
					Back
				</Button>
				<Button disabled={loading} variant="destructive" onClick={onCancel}>
					{loading ? "Cancelling..." : "Confirm Cancel"}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);

export default CancelSessionDialog;
