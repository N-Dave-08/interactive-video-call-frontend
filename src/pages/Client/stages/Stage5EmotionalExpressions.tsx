import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Stage5EmotionalExpressions({
	value,
	onChange,
	onNext,
	onBack,
	loading,
	error,
}: {
	value: string;
	onChange: (val: string) => void;
	onNext: () => void;
	onBack: () => void;
	loading?: boolean;
	error?: string;
}) {
	return (
		<Card className="w-full">
			<CardContent className="pt-6 space-y-4">
				<h2 className="text-xl font-semibold">Emotional Expression</h2>
				<div>
					<Label htmlFor="emotion_select">Emotion</Label>
					<select
						id="emotion_select"
						className="border p-2 rounded w-full"
						value={value}
						onChange={(e) => onChange(e.target.value)}
					>
						<option value="neutral">Neutral</option>
						<option value="happy">Happy</option>
						<option value="nervous">Nervous</option>
						<option value="sad">Sad</option>
					</select>
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
						{loading ? "Saving..." : "Next"}
					</Button>
				</div>
				{error && <div className="text-red-500 mt-2">{error}</div>}
			</CardContent>
		</Card>
	);
}
