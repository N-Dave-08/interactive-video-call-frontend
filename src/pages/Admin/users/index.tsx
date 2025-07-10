import { useEffect, useState } from "react";
import { fetchUsers } from "@/api/users";
import type { User } from "@/types/user";
import { DataTable } from "./data-table";

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

	if (loading) return <div>Loading users...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div>
			<DataTable data={data} />
		</div>
	);
}
