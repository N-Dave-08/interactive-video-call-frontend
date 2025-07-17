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
	// Match the real table: 7 columns (select, user, contact, role, assignment, status, created)
	const cols = [
		{ width: "w-6" }, // select
		{ width: "w-32" }, // user
		{ width: "w-40" }, // contact
		{ width: "w-24" }, // role
		{ width: "w-32" }, // assignment
		{ width: "w-24" }, // status
		{ width: "w-24" }, // created
	];
	const rows = Array.from({ length: 8 });

	return (
		<div className="space-y-4">
			{/* Stats Cards Skeleton */}
			<div className="grid gap-4 md:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={`stats-skeleton-card-${i + 1}`}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								<Skeleton className="h-4 w-24 animate-pulse" />
							</CardTitle>
							<Skeleton className="h-4 w-4 rounded-full animate-pulse" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-16 animate-pulse" />
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
								{cols.map((col, i) => (
									<TableHead key={`header-skeleton-${i + 1}`}>
										<Skeleton className={`h-4 ${col.width} animate-pulse`} />
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((_, i) => (
								<TableRow key={`row-skeleton-${i + 1}`}>
									{cols.map((col, j) => (
										<TableCell key={`cell-skeleton-${i}-${j + 1}`}>
											<Skeleton className={`h-4 ${col.width} animate-pulse`} />
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
