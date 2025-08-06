import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import {
	AlertCircle,
	Archive,
	Calendar,
	CheckCircle,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Clock,
	Columns,
	Edit,
	Filter,
	Mail,
	MapPin,
	MoreVertical,
	Phone,
	RotateCcw,
	Search,
	Shield,
	UserPlus,
	XCircle,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { updateUserCondition } from "@/api/users";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import SpinnerLoading from "@/components/ui/spinner-loading";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { User } from "@/types";
import type { UserPagination, UserStatistics } from "@/types";
import { AddUserDialog } from "./add-user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { UnarchiveUserDialog } from "./unarchive-user-dialog";
import { BulkArchiveDialog } from "./bulk-archive-dialog";
import { BulkUnarchiveDialog } from "./bulk-unarchive-dialog";

const getConditionBadge = (condition: string) => {
	const variants = {
		approved: {
			variant: "default" as const,
			icon: CheckCircle,
			color: "text-green-600",
		},
		pending: {
			variant: "secondary" as const,
			icon: Clock,
			color: "text-yellow-600",
		},
		rejected: {
			variant: "destructive" as const,
			icon: XCircle,
			color: "text-red-600",
		},
		blocked: {
			variant: "outline" as const,
			icon: AlertCircle,
			color: "text-gray-600",
		},
		archived: {
			variant: "outline" as const,
			icon: Archive,
			color: "text-gray-500",
		},
	};

	const config =
		variants[condition as keyof typeof variants] || variants.pending;
	const Icon = config.icon;

	return (
		<Badge
			variant={config.variant}
			className="flex items-center gap-1 capitalize"
		>
			<Icon className="h-3 w-3" />
			{condition}
		</Badge>
	);
};

const getRoleBadge = (role: string) => {
	if (role === "admin") {
		return (
			<Badge className="bg-gradient-to-r from-purple-600 to-purple-800 text-white border-none px-3 py-1 text-xs font-semibold rounded-full shadow-sm">
				Admin
			</Badge>
		);
	}
	if (role === "social_worker") {
		return (
			<Badge className="bg-gradient-to-r from-sky-500 to-teal-500 text-white border-none px-3 py-1 text-xs font-semibold rounded-full shadow-sm">
				Social Worker
			</Badge>
		);
	}
	return (
		<Badge className="bg-gray-200 text-gray-800 border-gray-300 px-3 py-1 text-xs font-semibold rounded-full">
			{role}
		</Badge>
	);
};

const columns: ColumnDef<User>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="translate-y-[2px]"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="translate-y-[2px]"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},

	{
		header: "User",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex items-center gap-3">
					<Avatar className="h-8 w-8">
						<AvatarImage
							src={user.profile_picture ?? "/placeholder.svg"}
							alt={`${user.first_name} ${user.last_name}`}
						/>
						<AvatarFallback className="text-xs">
							{user.first_name[0]}
							{user.last_name[0]}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="font-medium text-sm">
							{user.first_name} {user.last_name}
						</span>
						<span className="text-xs text-muted-foreground">
							@{user.username}
						</span>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "email",
		header: "Contact",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2 text-sm">
						<Mail className="h-3 w-3 text-muted-foreground" />
						<span className="truncate max-w-[200px]">{user.email}</span>
					</div>
					{user.phone_number && (
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<Phone className="h-3 w-3" />
							<span>{user.phone_number}</span>
						</div>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => getRoleBadge(row.original.role),
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "place_of_assignment",
		header: "Assignment",
		cell: ({ row }) => (
			<div className="flex items-center gap-2 text-sm">
				<MapPin className="h-3 w-3 text-muted-foreground" />
				<span className="truncate max-w-[150px]">
					{row.original.place_of_assignment}
				</span>
			</div>
		),
	},
	{
		accessorKey: "condition",
		header: "Status",
		cell: ({ row, table }) => {
			const value = row.original.condition;
			const id = row.original.id;
			const queryClient = useQueryClient();
			const { token } = useAuth();
			const { mutate: updateCondition, isPending } = useMutation({
				mutationFn: async (newCondition: string) => {
					if (!token) throw new Error("No token");
					await updateUserCondition(id, newCondition, token);
				},
				onSuccess: (_data, newCondition) => {
					queryClient.invalidateQueries({ queryKey: ["users"] });
					(
						table.options.meta as {
							onConditionChange?: (id: string, condition: string) => void;
						}
					)?.onConditionChange?.(id, newCondition);
					toast.success(`User status updated to ${newCondition}`);
				},
				onError: (err) => {
					toast.error(
						`Failed to update user status: ${err instanceof Error ? err.message : "Unknown error"}`,
					);
				},
			});

			const handleChange = (newCondition: string) => {
				updateCondition(newCondition);
			};

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="h-auto p-0 hover:bg-transparent"
							disabled={isPending}
						>
							{getConditionBadge(value)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						<DropdownMenuItem
							onClick={() => handleChange("approved")}
							disabled={isPending}
						>
							<CheckCircle className="h-4 w-4 mr-2 text-green-600" /> Approve
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleChange("pending")}
							disabled={isPending}
						>
							<Clock className="h-4 w-4 mr-2 text-yellow-600" /> Pending
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleChange("rejected")}
							disabled={isPending}
						>
							<XCircle className="h-4 w-4 mr-2 text-red-600" /> Reject
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleChange("blocked")}
							disabled={isPending}
						>
							<AlertCircle className="h-4 w-4 mr-2 text-gray-600" /> Block
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "createdAt",
		header: "Created",
		cell: ({ row }) => {
			const date = new Date(row.original.createdAt);
			return (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Calendar className="h-3 w-3" />
					<span>{date.toLocaleDateString()}</span>
				</div>
			);
		},
	},
	{
		id: "actions",
		header: "",
		cell: ({ row }) => {
			const user = row.original;

			const handleEdit = () => {
				const event = new CustomEvent("editUser", {
					detail: row.original,
				});
				window.dispatchEvent(event);
			};

			const handleDelete = () => {
				const event = new CustomEvent("deleteUser", {
					detail: row.original,
				});
				window.dispatchEvent(event);
			};

			const handleUnarchive = () => {
				const event = new CustomEvent("unarchiveUser", {
					detail: row.original,
				});
				window.dispatchEvent(event);
			};

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="h-8 w-8 p-0 data-[state=open]:bg-muted"
						>
							<MoreVertical className="h-4 w-4" />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuItem onClick={handleEdit}>
							<Edit className="h-4 w-4 mr-2" />
							Edit User
						</DropdownMenuItem>
						{user.condition === "archived" ? (
							<DropdownMenuItem
								className="text-green-600 focus:text-green-600"
								onClick={handleUnarchive}
							>
								<RotateCcw className="h-4 w-4 mr-2" />
								Unarchive User
							</DropdownMenuItem>
						) : (
							<DropdownMenuItem
								className="text-destructive focus:text-destructive"
								onClick={handleDelete}
							>
								<Archive className="h-4 w-4 mr-2" />
								Archive User
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
];

interface DataTableProps {
	data: User[];
	total: number;
	statistics: UserStatistics;
	pagination: UserPagination;
	search: string;
	setSearch: (v: string) => void;
	role: string | undefined;
	setRole: (v: string | undefined) => void;
	condition: string | undefined;
	setCondition: (v: string | undefined) => void;
	placeOfAssignment: string | undefined;
	setPlaceOfAssignment: (v: string | undefined) => void;
	page: number;
	setPage: (v: number) => void;
	rowsPerPage: number;
	setRowsPerPage: (v: number) => void;
	loading: boolean;
	onUnarchiveUser?: (user: User) => void;
}

export function DataTable({
	data,
	total,
	statistics,
	pagination,
	search,
	setSearch,
	condition,
	setCondition,
	page,
	setPage,
	rowsPerPage,
	setRowsPerPage,
	loading,
	onUnarchiveUser,
}: DataTableProps) {
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [tableData, setTableData] = React.useState<User[]>(data);
	const [editDialogOpen, setEditDialogOpen] = React.useState(false);
	const [editingUser, setEditingUser] = React.useState<User | null>(null);
	const [addDialogOpen, setAddDialogOpen] = React.useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
	const [deletingUser, setDeletingUser] = React.useState<User | null>(null);
	const [unarchiveDialogOpen, setUnarchiveDialogOpen] = React.useState(false);
	const [unarchivingUser, setUnarchivingUser] = React.useState<User | null>(
		null,
	);
	const [bulkArchiveDialogOpen, setBulkArchiveDialogOpen] =
		React.useState(false);
	const [bulkUnarchiveDialogOpen, setBulkUnarchiveDialogOpen] =
		React.useState(false);

	React.useEffect(() => {
		setTableData(data);
	}, [data]);

	// Listen for edit user events
	React.useEffect(() => {
		const handleEditUser = (event: CustomEvent) => {
			setEditingUser(event.detail);
			setEditDialogOpen(true);
		};

		const handleDeleteUser = (event: CustomEvent) => {
			setDeletingUser(event.detail);
			setDeleteDialogOpen(true);
		};

		const handleUnarchiveUser = (event: CustomEvent) => {
			setUnarchivingUser(event.detail);
			setUnarchiveDialogOpen(true);
		};

		window.addEventListener("editUser", handleEditUser as EventListener);
		window.addEventListener("deleteUser", handleDeleteUser as EventListener);
		window.addEventListener(
			"unarchiveUser",
			handleUnarchiveUser as EventListener,
		);
		return () => {
			window.removeEventListener("editUser", handleEditUser as EventListener);
			window.removeEventListener(
				"deleteUser",
				handleDeleteUser as EventListener,
			);
			window.removeEventListener(
				"unarchiveUser",
				handleUnarchiveUser as EventListener,
			);
		};
	}, []);

	const table = useReactTable<User>({
		data: tableData,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination: {
				pageIndex: page - 1,
				pageSize: rowsPerPage,
			},
		},
		getRowId: (row) => row.id.toString(),
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: (pagination) => {
			let pageIndex: number | undefined;
			let pageSize: number | undefined;
			if (typeof pagination === "function") {
				const result = pagination({
					pageIndex: page - 1,
					pageSize: rowsPerPage,
				});
				pageIndex = result.pageIndex;
				pageSize = result.pageSize;
			} else {
				pageIndex = pagination.pageIndex;
				pageSize = pagination.pageSize;
			}
			if (typeof pageIndex === "number") setPage(pageIndex + 1);
			if (typeof pageSize === "number") setRowsPerPage(pageSize);
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		meta: {
			onConditionChange: (id: string, newValue: string) => {
				setTableData((prev) =>
					prev.map((user) =>
						user.id === id ? { ...user, condition: newValue } : user,
					),
				);
			},
		},
	});

	const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;
	const totalRowsCount = table.getFilteredRowModel().rows.length;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-2">
				<Button size="sm" onClick={() => setAddDialogOpen(true)}>
					<UserPlus className="h-4 w-4 mr-2" />
					Add User
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-5">
				{[
					{
						title: "Total Users",
						icon: Shield,
						iconClass: "text-muted-foreground",
						value: statistics ? statistics.totalUsers : tableData.length,
						valueClass: "",
					},
					{
						title: "Admins",
						icon: UserPlus,
						iconClass: "text-purple-600",
						value: statistics
							? statistics.adminCount
							: tableData.filter((u) => u.role === "admin").length,
						valueClass: "text-purple-600",
					},
					{
						title: "Social Workers",
						icon: UserPlus,
						iconClass: "text-sky-600",
						value: statistics
							? statistics.socialWorkerCount
							: tableData.filter((u) => u.role === "social_worker").length,
						valueClass: "text-sky-600",
					},
					{
						title: "Approved",
						icon: CheckCircle,
						iconClass: "text-green-600",
						value: statistics
							? statistics.approvedCount
							: tableData.filter((u) => u.condition === "approved").length,
						valueClass: "text-green-600",
					},
					{
						title: "Pending",
						icon: Clock,
						iconClass: "text-yellow-600",
						value: statistics
							? statistics.needForApprovalCount
							: tableData.filter((u) => u.condition === "pending").length,
						valueClass: "text-yellow-600",
					},
				].map(({ title, icon: Icon, iconClass, value, valueClass }) => (
					<Card key={title}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{title}</CardTitle>
							<Icon className={"h-4 w-4 " + iconClass} />
						</CardHeader>
						<CardContent>
							<div className={"text-2xl font-bold " + valueClass}>{value}</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Toolbar */}
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex flex-1 items-center gap-2">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search users..."
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							className="pl-9"
						/>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								<Filter className="h-4 w-4 mr-2" />
								Status
								<ChevronDown className="h-4 w-4 ml-2" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-48">
							{["approved", "pending", "rejected", "blocked", "archived"].map(
								(status) => (
									<DropdownMenuCheckboxItem
										key={status}
										className="capitalize"
										checked={condition === status}
										onCheckedChange={(value) => {
											setCondition(value ? status : undefined);
										}}
									>
										{getConditionBadge(status)}
									</DropdownMenuCheckboxItem>
								),
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								<Columns className="h-4 w-4 mr-2" />
								Columns
								<ChevronDown className="h-4 w-4 ml-2" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Selection Info */}
			{selectedRowsCount > 0 && (
				<div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-2">
					<div className="flex items-center gap-2">
						<Checkbox
							checked={table.getIsAllPageRowsSelected()}
							onCheckedChange={(value) =>
								table.toggleAllPageRowsSelected(!!value)
							}
						/>
						<span className="text-sm font-medium">
							{selectedRowsCount} of {totalRowsCount} row(s) selected
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="destructive"
							size="sm"
							onClick={() => {
								const selectedUsers = table
									.getFilteredSelectedRowModel()
									.rows.map((row) => row.original);
								if (selectedUsers.length > 0) {
									// Check if any selected users are already archived
									const hasArchivedUsers = selectedUsers.some(
										(user) => user.condition === "archived",
									);

									if (hasArchivedUsers) {
										// If any are archived, show bulk unarchive dialog
										setBulkUnarchiveDialogOpen(true);
									} else {
										// If none are archived, show bulk archive dialog
										setBulkArchiveDialogOpen(true);
									}
								}
							}}
						>
							<Archive className="h-4 w-4 mr-2" />
							{(() => {
								const selectedUsers = table
									.getFilteredSelectedRowModel()
									.rows.map((row) => row.original);
								const hasArchivedUsers = selectedUsers.some(
									(user) => user.condition === "archived",
								);
								return hasArchivedUsers
									? "Unarchive Selected"
									: "Archive Selected";
							})()}
						</Button>
					</div>
				</div>
			)}

			{/* Table */}
			<div className="relative rounded-lg border bg-card">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="border-b bg-muted/50">
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className="font-semibold">
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{loading ? (
							Array.from({ length: rowsPerPage }).map((_, i) => (
								<TableRow key={`skeleton-row-${i + 1}`} className="border-none">
									{columns.map((j, colIdx) => (
										<TableCell
											key={`skeleton-cell-${i + 1}-${j.id || colIdx}`}
											className="py-3"
										></TableCell>
									))}
								</TableRow>
							))
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="py-3">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									<div className="flex flex-col items-center gap-2 text-muted-foreground">
										<Search className="h-8 w-8" />
										<p>No users found.</p>
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				{loading && <SpinnerLoading />}
			</div>

			{/* Pagination */}
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div className="text-sm text-muted-foreground">
					Showing{" "}
					{pagination
						? (pagination.currentPage - 1) * pagination.rowsPerPage + 1
						: (page - 1) * rowsPerPage + 1}{" "}
					to{" "}
					{pagination
						? Math.min(
								pagination.currentPage * pagination.rowsPerPage,
								pagination.totalCount,
							)
						: Math.min(page * rowsPerPage, total)}{" "}
					of {pagination ? pagination.totalCount : total} entries
				</div>
				<div className="flex items-center gap-6">
					<div className="flex items-center gap-2">
						<Label htmlFor="rows-per-page" className="text-sm font-medium">
							Rows per page
						</Label>
						<Select
							value={`${pagination ? pagination.rowsPerPage : rowsPerPage}`}
							onValueChange={(value) => setRowsPerPage(Number(value))}
						>
							<SelectTrigger className="w-20" id="rows-per-page">
								<SelectValue />
							</SelectTrigger>
							<SelectContent side="top">
								{[5, 10, 20, 30, 40, 50].map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage(1)}
							disabled={pagination ? pagination.currentPage === 1 : page === 1}
						>
							<ChevronsLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								setPage((pagination ? pagination.currentPage : page) - 1)
							}
							disabled={pagination ? pagination.currentPage === 1 : page === 1}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<div className="flex items-center gap-1 text-sm font-medium">
							Page {pagination ? pagination.currentPage : page} of{" "}
							{pagination
								? pagination.totalPages
								: Math.ceil(total / rowsPerPage)}
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								setPage((pagination ? pagination.currentPage : page) + 1)
							}
							disabled={
								pagination
									? pagination.currentPage >= pagination.totalPages
									: page >= Math.ceil(total / rowsPerPage)
							}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								setPage(
									pagination
										? pagination.totalPages
										: Math.ceil(total / rowsPerPage),
								)
							}
							disabled={
								pagination
									? pagination.currentPage >= pagination.totalPages
									: page >= Math.ceil(total / rowsPerPage)
							}
						>
							<ChevronsRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Edit User Dialog */}
			{editingUser && (
				<EditUserDialog
					user={editingUser}
					open={editDialogOpen}
					onOpenChange={setEditDialogOpen}
				/>
			)}

			{/* Add User Dialog */}
			<AddUserDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

			{/* Delete User Dialog */}
			{deletingUser && (
				<DeleteUserDialog
					user={deletingUser}
					open={deleteDialogOpen}
					onOpenChange={setDeleteDialogOpen}
				/>
			)}

			{/* Unarchive User Dialog */}
			{unarchivingUser && (
				<UnarchiveUserDialog
					user={unarchivingUser}
					open={unarchiveDialogOpen}
					onOpenChange={setUnarchiveDialogOpen}
					onUnarchive={onUnarchiveUser}
				/>
			)}

			{/* Bulk Archive Dialog */}
			<BulkArchiveDialog
				users={table
					.getFilteredSelectedRowModel()
					.rows.map((row) => row.original)}
				open={bulkArchiveDialogOpen}
				onOpenChange={(open) => {
					setBulkArchiveDialogOpen(open);
					if (!open) {
						table.toggleAllPageRowsSelected(false);
					}
				}}
			/>

			{/* Bulk Unarchive Dialog */}
			<BulkUnarchiveDialog
				users={table
					.getFilteredSelectedRowModel()
					.rows.map((row) => row.original)}
				open={bulkUnarchiveDialogOpen}
				onOpenChange={(open) => {
					setBulkUnarchiveDialogOpen(open);
					if (!open) {
						table.toggleAllPageRowsSelected(false);
					}
				}}
			/>
		</div>
	);
}
