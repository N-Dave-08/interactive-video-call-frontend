import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Stage4Other({
	onNext,
	onBack,
	loading,
	error,
}: {
	onNext: () => void;
	onBack: () => void;
	loading?: boolean;
	error?: string;
}) {
	return (
		<Card className="w-full">
			<CardContent className="pt-6 space-y-4">
				<h2 className="text-xl font-semibold">Stage 4</h2>
				<div className="text-gray-500">(Placeholder for Stage 4 UI)</div>
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
