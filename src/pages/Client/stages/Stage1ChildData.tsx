import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChildData {
	first_name: string;
	last_name: string;
	age: string;
	birthday: string;
	place_of_birth: string;
}

export default function Stage1ChildData({
	value,
	onChange,
	onNext,
	loading,
	error,
}: {
	value: ChildData;
	onChange: (val: ChildData) => void;
	onNext: () => void;
	loading?: boolean;
	error?: string;
}) {
	return (
		<Card className="w-full">
			<CardContent className="pt-6 space-y-4">
				<div>
					<Label htmlFor="first_name">First Name</Label>
					<Input
						id="first_name"
						placeholder="First Name"
						value={value.first_name}
						onChange={(e) => onChange({ ...value, first_name: e.target.value })}
					/>
				</div>
				<div>
					<Label htmlFor="last_name">Last Name</Label>
					<Input
						id="last_name"
						placeholder="Last Name"
						value={value.last_name}
						onChange={(e) => onChange({ ...value, last_name: e.target.value })}
					/>
				</div>
				<div>
					<Label htmlFor="age">Age</Label>
					<Input
						id="age"
						placeholder="Age"
						value={value.age}
						onChange={(e) => onChange({ ...value, age: e.target.value })}
						type="number"
						min="1"
					/>
				</div>
				<div className="flex justify-end">
					<Button
						type="button"
						className="px-4 py-2"
						onClick={onNext}
						disabled={
							!value.first_name || !value.last_name || !value.age || loading
						}
					>
						{loading ? "Saving..." : "Next"}
					</Button>
				</div>
				{error && <div className="text-red-500 mt-2">{error}</div>}
			</CardContent>
		</Card>
	);
}
