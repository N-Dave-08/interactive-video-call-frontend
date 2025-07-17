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
	Calendar,
	CheckCircle,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Clock,
	Columns,
	Download,
	Edit,
	Eye,
	Filter,
	GripVertical,
	Mail,
	MapPin,
	MoreVertical,
	Phone,
	Search,
	Shield,
	Trash2,
	UserPlus,
	XCircle,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { updateUserCondition } from "@/api/users";
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
	DropdownMenuSeparator,
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { AddUserData, EditUserData } from "@/schemas";
import type { User } from "@/types";
import { AddUserDialog } from "./add-user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";

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
		id: "drag",
		header: "",
		cell: () => (
			<div className="cursor-grab active:cursor-grabbing">
				<GripVertical className="h-4 w-4 text-muted-foreground" />
			</div>
		),
		enableSorting: false,
		enableHiding: false,
		size: 40,
	},
	{
		header: "User",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex items-center gap-3">
					<Avatar className="h-8 w-8">
						<AvatarImage
							src={user.avatar || "/placeholder.svg"}
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

			const handleChange = async (newCondition: string) => {
				try {
					await updateUserCondition(id, newCondition); // Call backend API
					(
						table.options.meta as {
							onConditionChange?: (id: string, condition: string) => void;
						}
					)?.onConditionChange?.(id, newCondition);
					toast.success(`User status updated to ${newCondition}`);
				} catch (err) {
					toast.error(
						`Failed to update user status: ${err instanceof Error ? err.message : "Unknown error"}`,
					);
				}
			};

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
							{getConditionBadge(value)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						<DropdownMenuItem onClick={() => handleChange("approved")}>
							{" "}
							<CheckCircle className="h-4 w-4 mr-2 text-green-600" /> Approve{" "}
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleChange("pending")}>
							{" "}
							<Clock className="h-4 w-4 mr-2 text-yellow-600" /> Pending{" "}
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleChange("rejected")}>
							{" "}
							<XCircle className="h-4 w-4 mr-2 text-red-600" /> Reject{" "}
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleChange("blocked")}>
							{" "}
							<AlertCircle className="h-4 w-4 mr-2 text-gray-600" /> Block{" "}
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
						<DropdownMenuItem>
							<Eye className="h-4 w-4 mr-2" />
							View Details
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleEdit}>
							<Edit className="h-4 w-4 mr-2" />
							Edit User
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Mail className="h-4 w-4 mr-2" />
							Send Email
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive focus:text-destructive"
							onClick={handleDelete}
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Delete User
						</DropdownMenuItem>
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
}

export function DataTable({
	data,
	total,
	search,
	setSearch,
	condition,
	setCondition,
	page,
	setPage,
	rowsPerPage,
	setRowsPerPage,
	loading,
}: DataTableProps) {
	// Debug: log the data prop
	// console.log("[DataTable] data:", data);
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

		window.addEventListener("editUser", handleEditUser as EventListener);
		window.addEventListener("deleteUser", handleDeleteUser as EventListener);
		return () => {
			window.removeEventListener("editUser", handleEditUser as EventListener);
			window.removeEventListener(
				"deleteUser",
				handleDeleteUser as EventListener,
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
			// Removed globalFilter
		},
		getRowId: (row) => row.id.toString(),
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: (pagination) => {
			// Handle both direct object and updater function
			let pageIndex: number | undefined;
			let pageSize: number | undefined;
			if (typeof pagination === "function") {
				// Not expected in our usage, but handle for type safety
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
		// Removed onGlobalFilterChange
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		// Removed getFilteredRowModel and globalFilterFn
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

	const handleSaveUser = async (id: string, data: EditUserData) => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Update the table data
		setTableData((prev) =>
			prev.map((user) => (user.id === id ? { ...user, ...data } : user)),
		);
	};

	const handleAddUser = async (data: AddUserData) => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Create new user with generated ID and timestamps
		const newUser: User = {
			id: `user_${Date.now()}`, // Generate a unique ID
			...data,
			phone_number: data.phone_number || null,
			password: data.password || "defaultPassword123", // Default password
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		// Add to table data
		setTableData((prev) => [newUser, ...prev]);
	};

	const handleDeleteUser = async (id: string) => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Remove user from table data
		setTableData((prev) => prev.filter((user) => user.id !== id));
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-2">
				<Button variant="outline" size="sm">
					<Download className="h-4 w-4 mr-2" />
					Export
				</Button>
				<Button size="sm" onClick={() => setAddDialogOpen(true)}>
					<UserPlus className="h-4 w-4 mr-2" />
					Add User
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Shield className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{tableData.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Approved</CardTitle>
						<CheckCircle className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{tableData.filter((u) => u.condition === "approved").length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Pending</CardTitle>
						<Clock className="h-4 w-4 text-yellow-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-yellow-600">
							{tableData.filter((u) => u.condition === "pending").length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Issues</CardTitle>
						<AlertCircle className="h-4 w-4 text-red-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">
							{
								tableData.filter(
									(u) =>
										u.condition === "rejected" || u.condition === "blocked",
								).length
							}
						</div>
					</CardContent>
				</Card>
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
							{["approved", "pending", "rejected", "blocked"].map((status) => (
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
							))}
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
						<Button variant="outline" size="sm">
							<Mail className="h-4 w-4 mr-2" />
							Email Selected
						</Button>
						<Button variant="outline" size="sm">
							<Download className="h-4 w-4 mr-2" />
							Export Selected
						</Button>
						<Button
							variant="destructive"
							size="sm"
							onClick={() => {
								const selectedUsers = table
									.getFilteredSelectedRowModel()
									.rows.map((row) => row.original);
								// For bulk delete, we'll just delete the first selected user as an example
								// In a real app, you might want a bulk delete confirmation dialog
								if (selectedUsers.length > 0) {
									const event = new CustomEvent("deleteUser", {
										detail: selectedUsers[0],
									});
									window.dispatchEvent(event);
									// Clear selection after delete
									table.toggleAllPageRowsSelected(false);
								}
							}}
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Delete Selected
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
									{columns.map((j) => (
										<TableCell
											key={`skeleton-cell-${i}-${j}`}
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
				{/* Optional: overlay spinner */}
				{loading && (
					<div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
						<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
					</div>
				)}
			</div>

			{/* Pagination */}
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div className="text-sm text-muted-foreground">
					Showing {(page - 1) * rowsPerPage + 1} to{" "}
					{Math.min(page * rowsPerPage, total)} of {total} entries
				</div>
				<div className="flex items-center gap-6">
					<div className="flex items-center gap-2">
						<Label htmlFor="rows-per-page" className="text-sm font-medium">
							Rows per page
						</Label>
						<Select
							value={`${rowsPerPage}`}
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
							disabled={page === 1}
						>
							<ChevronsLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage(page - 1)}
							disabled={page === 1}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<div className="flex items-center gap-1 text-sm font-medium">
							Page {page} of {Math.ceil(total / rowsPerPage)}
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage(page + 1)}
							disabled={page >= Math.ceil(total / rowsPerPage)}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage(Math.ceil(total / rowsPerPage))}
							disabled={page >= Math.ceil(total / rowsPerPage)}
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
					onSave={handleSaveUser}
				/>
			)}

			{/* Add User Dialog */}
			<AddUserDialog
				open={addDialogOpen}
				onOpenChange={setAddDialogOpen}
				onSave={handleAddUser}
			/>

			{/* Delete User Dialog */}
			{deletingUser && (
				<DeleteUserDialog
					user={deletingUser}
					open={deleteDialogOpen}
					onOpenChange={setDeleteDialogOpen}
					onDelete={handleDeleteUser}
				/>
			)}
		</div>
	);
}
