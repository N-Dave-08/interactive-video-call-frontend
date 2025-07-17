import { useCallback, useEffect, useState } from "react";
import { queryUsers, type UserQueryParams } from "@/api/users";
import type { User } from "@/types/user";
import { DataTable } from "./users-data-table";

export default function UsersPage() {
	const [data, setData] = useState<User[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	// Query params state
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [role, setRole] = useState<string | undefined>(undefined);
	const [condition, setCondition] = useState<string | undefined>(undefined);
	const [placeOfAssignment, setPlaceOfAssignment] = useState<
		string | undefined
	>(undefined);
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Debounce search input
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearch(search);
		}, 300);
		return () => clearTimeout(handler);
	}, [search]);

	const fetchData = useCallback(() => {
		setLoading(true);
		const params: UserQueryParams = {
			search: debouncedSearch,
			role,
			condition,
			place_of_assignment: placeOfAssignment,
			page,
			rowsPerPage,
		};
		queryUsers(params)
			.then((res) => {
				setData(res.data);
				setTotal(res.total ?? 0);
				setLoading(false);
			})
			.catch(() => {
				setError("Failed to fetch users");
				setLoading(false);
			});
	}, [debouncedSearch, role, condition, placeOfAssignment, page, rowsPerPage]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	if (error) return <div>{error}</div>;

	return (
		<>
			<div className="mb-4">
				<h2 className="text-2xl font-bold tracking-tight">User Management</h2>
				<p className="text-muted-foreground">
					Manage your team members and their account permissions here.
				</p>
			</div>
			<DataTable
				data={data}
				total={total}
				search={search}
				setSearch={setSearch}
				role={role}
				setRole={setRole}
				condition={condition}
				setCondition={setCondition}
				placeOfAssignment={placeOfAssignment}
				setPlaceOfAssignment={setPlaceOfAssignment}
				page={page}
				setPage={setPage}
				rowsPerPage={rowsPerPage}
				setRowsPerPage={setRowsPerPage}
				loading={loading}
			/>
		</>
	);
}
