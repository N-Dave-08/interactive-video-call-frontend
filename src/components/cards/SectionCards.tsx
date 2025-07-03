import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function SectionCards() {
	const cards = [
		{
			title: "Your Profile",
		},
		{
			title: "Calendar: Schedule of Appointment",
		},
		{
			title: "Enter Mini Games",
		},
		{
			title: "Drawing Pads",
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-2">
			{cards.map((item) => (
				<Card className="@container/card" key={item.title}>
					<CardHeader>
						<CardTitle className="text-2xl font-semibold h-48">
							{item.title}
						</CardTitle>
					</CardHeader>
				</Card>
			))}
		</div>
	);
}
