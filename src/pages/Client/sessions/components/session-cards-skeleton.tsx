import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SessionCardsSkeleton() {
	// Number of skeleton cards to show
	const skeletons = Array.from({ length: 3 });

	return (
		<div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
			{skeletons.map((_, i) => (
				<Card key={`session-skeleton-card-${i + 1}`} className="shadow-sm h-96">
					<CardContent className="py-6 space-y-4">
						<Skeleton className="h-6 w-2/3 mb-2" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-4 w-1/2" />
					</CardContent>
				</Card>
			))}
		</div>
	);
}
