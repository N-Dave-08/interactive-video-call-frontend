import { Badge } from "@/components/ui/badge";
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
	// Number of skeleton rows to show
	const rows = Array.from({ length: 8 });
	return (
		<div className="space-y-6">
			{/* Stats Cards Skeleton */}
			<div className="grid gap-4 md:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={`card-skeleton-${i + 1}`}>
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

			{/* Toolbar Skeleton */}
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex flex-1 items-center gap-2">
					<Skeleton className="h-9 w-64 rounded-md" />
					<Skeleton className="h-9 w-28 rounded-md" />
				</div>
				<div className="flex items-center gap-2">
					<Skeleton className="h-9 w-28 rounded-md" />
				</div>
			</div>

			{/* Table Skeleton */}
			<div className="rounded-lg border bg-card overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>
								<Skeleton className="h-4 w-4" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-8" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-24" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-24" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-16" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-20" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-16" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-12" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-4 w-8" />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map((_, i) => (
							<TableRow key={`row-skeleton-${i + 1}`}>
								<TableCell>
									<Skeleton className="h-4 w-4 rounded" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-4 rounded" />
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-3">
										<Skeleton className="h-8 w-8 rounded-full" />
										<div className="flex flex-col gap-1">
											<Skeleton className="h-4 w-24" />
											<Skeleton className="h-3 w-16" />
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-col gap-1">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-3 w-20" />
									</div>
								</TableCell>
								<TableCell>
									<Badge className="bg-gray-200 text-gray-400 px-3 py-1 text-xs font-semibold rounded-full">
										<Skeleton className="h-4 w-16" />
									</Badge>
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-20" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-16" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-12" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-8" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Skeleton */}
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<Skeleton className="h-6 w-40" />
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-8 rounded" />
					<Skeleton className="h-8 w-8 rounded" />
					<Skeleton className="h-8 w-16 rounded" />
					<Skeleton className="h-8 w-8 rounded" />
					<Skeleton className="h-8 w-8 rounded" />
				</div>
			</div>
		</div>
	);
}
