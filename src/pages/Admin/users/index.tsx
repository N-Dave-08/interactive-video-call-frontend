import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { queryUsers } from "@/api/users";
import type { User, UserQueryParams } from "@/types";
import { DataTable } from "./components/users-data-table";
import { useAuth } from "@/hooks/useAuth";

export default function UsersPage() {
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

	const { token } = useAuth();

	const params: UserQueryParams = {
		search: debouncedSearch,
		role,
		condition,
		place_of_assignment: placeOfAssignment,
		page,
		rowsPerPage,
	};

	const {
		data: queryData,
		isLoading: loading,
		error,
	} = useQuery<
		{
			data: User[];
			total: number;
			statistics: import("@/types").UserStatistics;
			pagination: import("@/types").UserPagination;
		},
		Error
	>({
		queryKey: ["users", params],
		queryFn: () => token ? queryUsers(params, token) : Promise.reject(new Error("No token")),
	});

	if (error) return <div>{error.message || "Failed to fetch users"}</div>;

	const defaultStatistics = {
		totalUsers: 0,
		adminCount: 0,
		socialWorkerCount: 0,
		newThisWeek: 0,
		approvedCount: 0,
		approvalRate: 0,
		rejectedCount: 0,
		blockedCount: 0,
		needForApprovalCount: 0,
	};

	const defaultPagination = {
		currentPage: 1,
		rowsPerPage: 10,
		totalPages: 1,
		totalCount: 0,
	};

	return (
		<>
			<div className="mb-4">
				<h2 className="text-2xl font-bold tracking-tight">User Management</h2>
				<p className="text-muted-foreground">
					Manage your team members and their account permissions here.
				</p>
			</div>
			<DataTable
				data={queryData?.data || []}
				total={queryData?.pagination?.totalCount || queryData?.total || 0}
				statistics={queryData?.statistics ?? defaultStatistics}
				pagination={queryData?.pagination ?? defaultPagination}
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
