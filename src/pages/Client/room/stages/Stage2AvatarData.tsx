import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface AvatarData {
	head: string;
	hair: string;
}

export default function Stage2AvatarData({
	value,
	onChange,
	onNext,
	onBack,
	loading,
	error,
}: {
	value: AvatarData;
	onChange: (val: AvatarData) => void;
	onNext: () => void;
	onBack: () => void;
	loading?: boolean;
	error?: string;
}) {
	return (
		<Card className="w-full">
			<CardContent className="pt-6 space-y-4">
				<h2 className="text-xl font-semibold">Avatar Data</h2>
				<div>
					<Label htmlFor="avatar_head">Head</Label>
					<select
						id="avatar_head"
						className="border p-2 rounded w-full"
						value={value.head}
						onChange={(e) => onChange({ ...value, head: e.target.value })}
					>
						<option value="default">Default</option>
						<option value="round">Round</option>
						<option value="oval">Oval</option>
					</select>
				</div>
				<div>
					<Label htmlFor="avatar_hair">Hair</Label>
					<select
						id="avatar_hair"
						className="border p-2 rounded w-full"
						value={value.hair}
						onChange={(e) => onChange({ ...value, hair: e.target.value })}
					>
						<option value="default">Default</option>
						<option value="short_black">Short Black</option>
						<option value="long_blonde">Long Blonde</option>
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
