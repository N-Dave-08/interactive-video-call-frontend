import { useEffect, useState } from "react";
import { fetchUsers } from "@/api/users";
import type { User } from "@/types/user";
import { DataTable } from "./users-data-table";
import { UsersDataTableSkeleton } from "./users-data-table-skeleton";

export default function UsersPage() {
	const [data, setData] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchUsers()
			.then((users) => {
				setData(users);
				setLoading(false);
			})
			.catch(() => {
				setError("Failed to fetch users");
				setLoading(false);
			});
	}, []);

	if (error) return <div>{error}</div>;

	return (
		<>
			<div className="mb-8">
				<h2 className="text-2xl font-bold tracking-tight">User Management</h2>
				<p className="text-muted-foreground">
					Manage your team members and their account permissions here.
				</p>
			</div>
			{loading ? <UsersDataTableSkeleton /> : <DataTable data={data} />}
		</>
	);
}
