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
	Calendar,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Columns,
	Search,
	User,
	Tag,
	Clock,
	CheckCircle,
	XCircle,
	AlertCircle,
	FilterX,
} from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { Session } from "@/types";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

const getStatusBadge = (status: string) => {
	const variants = {
		completed: {
			label: "Completed",
			badgeClass:
				"bg-emerald-100 text-emerald-800 border-emerald-200 ring-2 ring-emerald-200",
			iconClass: "text-emerald-600",
			icon: CheckCircle,
		},
		in_progress: {
			label: "In Progress",
			badgeClass:
				"bg-blue-100 text-blue-800 border-blue-200 ring-2 ring-blue-200",
			iconClass: "text-blue-600",
			icon: Clock,
		},
		rescheduled: {
			label: "Rescheduled",
			badgeClass:
				"bg-purple-100 text-purple-800 border-purple-200 ring-2 ring-purple-200",
			iconClass: "text-purple-600",
			icon: AlertCircle,
		},
		cancelled: {
			label: "Cancelled",
			badgeClass: "bg-red-100 text-red-800 border-red-200 ring-2 ring-red-200",
			iconClass: "text-red-600",
			icon: XCircle,
		},
		scheduled: {
			label: "Scheduled",
			badgeClass:
				"bg-yellow-100 text-yellow-800 border-yellow-200 ring-2 ring-yellow-200",
			iconClass: "text-yellow-600",
			icon: Clock,
		},
	};
	const config =
		variants[status as keyof typeof variants] || variants.scheduled;
	const Icon = config.icon;
	return (
		<Badge
			className={`text-xs font-medium rounded-full px-3 py-1.5 transition-all duration-200 hover:scale-105 flex items-center gap-1 ${config.badgeClass}`}
		>
			<Icon className="h-3 w-3" />
			{config.label}
		</Badge>
	);
};

const getDuration = (startTime: string, endTime?: string | null) => {
	if (!endTime) return "-";
	const start = new Date(startTime);
	const end = new Date(endTime);
	const diffMs = end.getTime() - start.getTime();
	const diffMins = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMins / 60);
	const remainingMins = diffMins % 60;

	if (diffHours > 0) {
		return `${diffHours}h ${remainingMins}m`;
	}
	return `${diffMins}m`;
};

const columns: ColumnDef<Session>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		header: "Title",
		accessorKey: "title",
		cell: ({ row }) => (
			<div className="flex flex-col">
				<span className="font-medium">{row.original.title}</span>
				<span className="text-xs text-muted-foreground">
					Duration:{" "}
					{getDuration(row.original.start_time, row.original.end_time)}
				</span>
			</div>
		),
	},
	{
		header: "Start Time",
		accessorKey: "start_time",
		cell: ({ row }) => {
			const date = new Date(row.original.start_time);
			return (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Calendar className="h-3 w-3" />
					<span>{date.toLocaleString()}</span>
				</div>
			);
		},
	},
	{
		header: "End Time",
		accessorKey: "end_time",
		cell: ({ row }) => {
			if (!row.original.end_time) return <span>-</span>;
			const date = new Date(row.original.end_time);
			return (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Calendar className="h-3 w-3" />
					<span>{date.toLocaleString()}</span>
				</div>
			);
		},
	},
	{
		header: "Status",
		accessorKey: "status",
		cell: ({ row }) => getStatusBadge(row.original.status),
	},
	{
		header: "Stage",
		accessorKey: "stage",
		cell: ({ row }) => (
			<Badge variant="outline" className="text-xs">
				{row.original.stage}
			</Badge>
		),
	},
	{
		header: "Child",
		accessorKey: "child_data",
		cell: ({ row }) => {
			const child = row.original.child_data;
			return (
				<div className="flex flex-col text-xs">
					<span className="font-semibold">
						{child.first_name} {child.last_name}
					</span>
					<span>Age: {child.age ?? "-"}</span>
					<span>Gender: {child.gender || "-"}</span>
				</div>
			);
		},
	},
	{
		header: "User",
		accessorKey: "user",
		cell: ({ row }) => {
			const user = row.original.user;
			return (
				<div className="flex items-center gap-2 text-xs">
					<User className="h-3 w-3" />
					<span>
						{user.first_name} {user.last_name}
					</span>
				</div>
			);
		},
	},
	{
		header: "Tags",
		accessorKey: "tags",
		cell: ({ row }) => (
			<div className="flex flex-wrap gap-1">
				{row.original.tags.length > 0 ? (
					<>
						{row.original.tags.slice(0, 2).map((tag) => (
							<Badge key={tag} variant="secondary" className="text-xs">
								<Tag className="h-3 w-3 mr-1" />
								{tag}
							</Badge>
						))}
						{row.original.tags.length > 2 && (
							<Popover>
								<PopoverTrigger asChild>
									<Badge
										variant="outline"
										className="text-xs cursor-pointer hover:bg-muted/50 transition-colors"
									>
										+{row.original.tags.length - 2} more
									</Badge>
								</PopoverTrigger>
								<PopoverContent className="w-64 p-3" align="start">
									<div className="space-y-2">
										<div className="text-sm font-medium text-muted-foreground">
											All Tags ({row.original.tags.length})
										</div>
										<div className="flex flex-wrap gap-1">
											{row.original.tags.map((tag) => (
												<Badge
													key={tag}
													variant="secondary"
													className="text-xs"
												>
													<Tag className="h-3 w-3 mr-1" />
													{tag}
												</Badge>
											))}
										</div>
									</div>
								</PopoverContent>
							</Popover>
						)}
					</>
				) : (
					<span className="text-xs text-muted-foreground">No tags</span>
				)}
			</div>
		),
	},
	{
		header: "Created",
		accessorKey: "createdAt",
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
		header: "Updated",
		accessorKey: "updatedAt",
		cell: ({ row }) => {
			const date = new Date(row.original.updatedAt);
			return (
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Calendar className="h-3 w-3" />
					<span>{date.toLocaleDateString()}</span>
				</div>
			);
		},
	},
];

interface SessionsDataTableProps {
	data: Session[];
	total: number;
	search: string;
	setSearch: (v: string) => void;
	page: number;
	setPage: (v: number) => void;
	rowsPerPage: number;
	setRowsPerPage: (v: number) => void;
	loading: boolean;
}

export function SessionsDataTable({
	data,
	total,
	search,
	setSearch,
	page,
	setPage,
	rowsPerPage,
	setRowsPerPage,
	loading,
}: SessionsDataTableProps) {
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [tableData, setTableData] = React.useState<Session[]>(data);
	const [statusFilter, setStatusFilter] = React.useState<string>("all");
	const [stageFilter, setStageFilter] = React.useState<string>("all");

	React.useEffect(() => {
		setTableData(data);
	}, [data]);

	const table = useReactTable<Session>({
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
		getRowId: (row) => row.session_id,
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
	});

	const selectedRows = table.getFilteredSelectedRowModel().rows;
	const hasSelectedRows = selectedRows.length > 0;

	const clearAllFilters = () => {
		setSearch("");
		setStatusFilter("all");
		setStageFilter("all");
		setColumnFilters([]);
	};

	const hasActiveFilters =
		search ||
		statusFilter !== "all" ||
		stageFilter !== "all" ||
		columnFilters.length > 0;

	return (
		<TooltipProvider>
			<div className="space-y-6">
				{/* Header with Actions */}
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold tracking-tight">Sessions</h2>
						<p className="text-muted-foreground">All sessions in the system.</p>
					</div>
				</div>

				{/* Bulk Actions */}
				{hasSelectedRows && (
					<div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
						<span className="text-sm font-medium">
							{selectedRows.length} session{selectedRows.length > 1 ? "s" : ""}{" "}
							selected
						</span>
						<div className="flex items-center gap-2 ml-auto">
							<Button variant="outline" size="sm">
								Export Selected
							</Button>
						</div>
					</div>
				)}

				{/* Enhanced Table Toolbar */}
				<div className="space-y-4">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
						<div className="flex flex-1 items-center gap-2">
							<div className="relative flex-1 max-w-sm">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="Search sessions..."
									value={search}
									onChange={(event) => setSearch(event.target.value)}
									className="pl-9"
								/>
							</div>

							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="w-32">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="scheduled">Scheduled</SelectItem>
									<SelectItem value="in_progress">In Progress</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
									<SelectItem value="cancelled">Cancelled</SelectItem>
									<SelectItem value="rescheduled">Rescheduled</SelectItem>
								</SelectContent>
							</Select>

							<Select value={stageFilter} onValueChange={setStageFilter}>
								<SelectTrigger className="w-32">
									<SelectValue placeholder="Stage" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Stages</SelectItem>
									<SelectItem value="Stage 1">Stage 1</SelectItem>
									<SelectItem value="Stage 2">Stage 2</SelectItem>
									<SelectItem value="Stage 3">Stage 3</SelectItem>
									<SelectItem value="Stage 4">Stage 4</SelectItem>
									<SelectItem value="Completion">Completion</SelectItem>
								</SelectContent>
							</Select>

							{hasActiveFilters && (
								<Button variant="outline" size="sm" onClick={clearAllFilters}>
									<FilterX className="h-4 w-4 mr-2" />
									Clear Filters
								</Button>
							)}
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

					{/* Quick Stats */}
					<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
						<div className="p-3 bg-blue-50 rounded-lg border">
							<div className="text-sm font-medium text-blue-600">
								Total Sessions
							</div>
							<div className="text-2xl font-bold">{total}</div>
						</div>
						<div className="p-3 bg-green-50 rounded-lg border">
							<div className="text-sm font-medium text-green-600">
								Completed
							</div>
							<div className="text-2xl font-bold">
								{data.filter((s) => s.status === "completed").length}
							</div>
						</div>
						<div className="p-3 bg-yellow-50 rounded-lg border">
							<div className="text-sm font-medium text-yellow-600">
								In Progress
							</div>
							<div className="text-2xl font-bold">
								{data.filter((s) => s.status === "in_progress").length}
							</div>
						</div>
						<div className="p-3 bg-gray-50 rounded-lg border">
							<div className="text-sm font-medium text-gray-600">Scheduled</div>
							<div className="text-2xl font-bold">
								{data.filter((s) => s.status === "scheduled").length}
							</div>
						</div>
					</div>
				</div>

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
									<TableRow
										key={`skeleton-row-${i + 1}`}
										className="border-none"
									>
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
									<TableRow
										key={row.id}
										className={row.getIsSelected() ? "bg-muted/50" : ""}
									>
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
											<p>No sessions found.</p>
											{hasActiveFilters && (
												<Button
													variant="outline"
													size="sm"
													onClick={clearAllFilters}
												>
													Clear all filters
												</Button>
											)}
										</div>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
					{loading && <SpinnerLoading />}
				</div>

				{/* Enhanced Pagination */}
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="text-sm text-muted-foreground">
						Showing {(page - 1) * rowsPerPage + 1} to{" "}
						{Math.min(page * rowsPerPage, total)} of {total} entries
						{hasSelectedRows && (
							<span className="ml-2 text-blue-600">
								• {selectedRows.length} selected
							</span>
						)}
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
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setPage(1)}
										disabled={page === 1}
									>
										<ChevronsLeft className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>First page</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setPage(page - 1)}
										disabled={page === 1}
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Previous page</TooltipContent>
							</Tooltip>
							<div className="flex items-center gap-1 text-sm font-medium">
								Page {page} of {Math.ceil(total / rowsPerPage)}
							</div>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setPage(page + 1)}
										disabled={page >= Math.ceil(total / rowsPerPage)}
									>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Next page</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setPage(Math.ceil(total / rowsPerPage))}
										disabled={page >= Math.ceil(total / rowsPerPage)}
									>
										<ChevronsRight className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Last page</TooltipContent>
							</Tooltip>
						</div>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
