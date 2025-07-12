import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Stage6SessionNotesTags({
	notes,
	tagsInput,
	onNotesChange,
	onTagsInputChange,
	onTagsBlur,
	onNext,
	onBack,
	loading,
	error,
}: {
	notes: string;
	tagsInput: string;
	onNotesChange: (val: string) => void;
	onTagsInputChange: (val: string) => void;
	onTagsBlur: () => void;
	onNext: () => void;
	onBack: () => void;
	loading?: boolean;
	error?: string;
}) {
	return (
		<Card className="w-full">
			<CardContent className="pt-6 space-y-4">
				<h2 className="text-xl font-semibold">Session Notes & Tags</h2>
				<div>
					<Label htmlFor="session_notes">Session Notes</Label>
					<Input
						id="session_notes"
						placeholder="Session Notes"
						value={notes}
						onChange={(e) => onNotesChange(e.target.value)}
					/>
				</div>
				<div>
					<Label htmlFor="tags">Tags (comma separated)</Label>
					<Input
						id="tags"
						placeholder="e.g. fun, progress, challenge"
						value={tagsInput}
						onChange={(e) => onTagsInputChange(e.target.value)}
						onBlur={onTagsBlur}
					/>
				</div>
				<div className="flex justify-between mt-8">
					<Button type="button" variant="outline" onClick={onBack}>
						Back
					</Button>
					<Button
						type="button"
						className="px-4 py-2"
						onClick={onNext}
						disabled={loading}
					>
						{loading ? "Saving..." : "Finish"}
					</Button>
				</div>
				{error && <div className="text-red-500 mt-2">{error}</div>}
			</CardContent>
		</Card>
	);
}
