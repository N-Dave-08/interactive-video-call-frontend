import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export function UsersDataTableSkeleton() {
	const rows = Array.from({ length: 6 });
	const cols = Array.from({ length: 6 });

	return (
		<div className="space-y-6">
			{/* Stats Cards Skeleton */}
			<div className="grid gap-4 md:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={`stats-skeleton-card-${i + 1}`}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								<Skeleton className="h-4 w-24" />
							</CardTitle>
							<Skeleton className="h-4 w-4 rounded-full" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-16" />
						</CardContent>
					</Card>
				))}
			</div>
			{/* Table Skeleton */}
			<Card className="p-4">
				<div className="rounded-lg overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								{cols.map((_, i) => (
									<TableHead key={`header-skeleton-${i + 1}`}>
										<Skeleton className="h-4 w-20" />
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((_, i) => (
								<TableRow key={`row-skeleton-${i + 1}`}>
									{cols.map((_, j) => (
										<TableCell key={`cell-skeleton-${i + 1}-${j + 1}`}>
											<Skeleton className="h-4 w-20" />
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Card>
		</div>
	);
}
