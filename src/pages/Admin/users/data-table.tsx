"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	type UniqueIdentifier,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	IconChevronDown,
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
	IconCircleCheckFilled,
	IconDotsVertical,
	IconGripVertical,
	IconLayoutColumns,
	IconLoader,
	IconPlus,
	IconTrendingUp,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type Row,
	type SortingState,
	type TableMeta,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";
import { deleteUser, updateUserCondition, updateUserInfo } from "@/api/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
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
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import type { User } from "@/types/user";

export const schema = z.object({
	id: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	username: z.string(),
	place_of_assignment: z.string(),
	phone_number: z.string().nullable(),
	email: z.string(),
	role: z.string(),
	condition: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
	const { attributes, listeners } = useSortable({
		id,
	});

	return (
		<Button
			{...attributes}
			{...listeners}
			variant="ghost"
			size="icon"
			className="text-muted-foreground size-7 hover:bg-transparent"
		>
			<IconGripVertical className="text-muted-foreground size-3" />
			<span className="sr-only">Drag to reorder</span>
		</Button>
	);
}

const columns: ColumnDef<User>[] = [
	{ accessorKey: "id", header: "ID" },
	{ accessorKey: "first_name", header: "First Name" },
	{ accessorKey: "last_name", header: "Last Name" },
	{ accessorKey: "username", header: "Username" },
	{ accessorKey: "place_of_assignment", header: "Assignment" },
	{ accessorKey: "phone_number", header: "Phone" },
	{ accessorKey: "email", header: "Email" },
	{ accessorKey: "role", header: "Role" },
	{
		accessorKey: "condition",
		header: "Condition",
		cell: ({ row, table }) => {
			const value = row.original.condition;
			const id = row.original.id;
			const handleChange = async (newCondition: string) => {
				try {
					await updateUserCondition(id, newCondition);
					(table.options.meta as any)?.onConditionChange?.(id, newCondition);
				} catch (err) {
					alert("Failed to update user condition");
				}
			};
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className="w-32 px-2 py-1 border rounded bg-background text-left"
						>
							{value}
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={() => handleChange("approved")}>
							approve
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleChange("reject")}>
							reject
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleChange("block")}>
							block
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
	{ accessorKey: "createdAt", header: "Created At" },
	{ accessorKey: "updatedAt", header: "Updated At" },
	{
		id: "actions",
		cell: () => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
						size="icon"
					>
						<IconDotsVertical />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-32">
					<DropdownMenuItem>Edit</DropdownMenuItem>
					<DropdownMenuItem>Make a copy</DropdownMenuItem>
					<DropdownMenuItem>Favorite</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];

function DraggableRow({ row }: { row: Row<User> }) {
	const { transform, transition, setNodeRef, isDragging } = useSortable({
		id: row.original.id,
	});

	return (
		<TableRow
			data-state={row.getIsSelected() && "selected"}
			data-dragging={isDragging}
			ref={setNodeRef}
			className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
			style={{
				transform: CSS.Transform.toString(transform),
				transition: transition,
			}}
		>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</TableRow>
	);
}

export function DataTable({ data }: { data: User[] }) {
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({
			id: false,
			createdAt: false,
			updatedAt: false,
		});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const sortableId = React.useId();
	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {}),
	);

	const dataIds = React.useMemo<UniqueIdentifier[]>(
		() => data?.map(({ id }) => id) || [],
		[data],
	);

	const [tableData, setTableData] = React.useState<User[]>(data);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);

	const table = useReactTable<User>({
		data: tableData,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
		},
		getRowId: (row) => row.id.toString(),
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
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

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			// Dragging is not supported for API data, so do nothing or implement if needed
		}
	}

	const handleEdit = (user: User) => {
		setEditingUser(user);
		setEditDialogOpen(true);
	};

	return (
		<>
			<Tabs
				defaultValue="outline"
				className="w-full flex-col justify-start gap-6"
			>
				<div className="flex items-center justify-between px-4 lg:px-6">
					<Label htmlFor="view-selector" className="sr-only">
						View
					</Label>
					<Select defaultValue="outline">
						<SelectTrigger
							className="flex w-fit @4xl/main:hidden"
							size="sm"
							id="view-selector"
						>
							<SelectValue placeholder="Select a view" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="outline">Outline</SelectItem>
							<SelectItem value="past-performance">Past Performance</SelectItem>
							<SelectItem value="key-personnel">Key Personnel</SelectItem>
							<SelectItem value="focus-documents">Focus Documents</SelectItem>
						</SelectContent>
					</Select>
					<TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
						<TabsTrigger value="outline">Outline</TabsTrigger>
						<TabsTrigger value="past-performance">
							Past Performance <Badge variant="secondary">3</Badge>
						</TabsTrigger>
						<TabsTrigger value="key-personnel">
							Key Personnel <Badge variant="secondary">2</Badge>
						</TabsTrigger>
						<TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
					</TabsList>
					<div className="flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm">
									<IconLayoutColumns />
									<span className="hidden lg:inline">Customize Columns</span>
									<span className="lg:hidden">Columns</span>
									<IconChevronDown />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								{table
									.getAllColumns()
									.filter(
										(column) =>
											typeof column.accessorFn !== "undefined" &&
											column.getCanHide(),
									)
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
						<Button variant="outline" size="sm">
							<IconPlus />
							<span className="hidden lg:inline">Add Section</span>
						</Button>
					</div>
				</div>
				<TabsContent
					value="outline"
					className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
				>
					<div className="overflow-hidden rounded-lg border">
						<DndContext
							collisionDetection={closestCenter}
							modifiers={[restrictToVerticalAxis]}
							onDragEnd={handleDragEnd}
							sensors={sensors}
							id={sortableId}
						>
							<Table>
								<TableHeader className="bg-muted sticky top-0 z-10">
									{table.getHeaderGroups().map((headerGroup) => (
										<TableRow key={headerGroup.id}>
											{headerGroup.headers.map((header) => {
												return (
													<TableHead key={header.id} colSpan={header.colSpan}>
														{header.isPlaceholder
															? null
															: flexRender(
																	header.column.columnDef.header,
																	header.getContext(),
																)}
													</TableHead>
												);
											})}
										</TableRow>
									))}
								</TableHeader>
								<TableBody className="**:data-[slot=table-cell]:first:w-8">
									{table.getRowModel().rows?.length ? (
										<SortableContext
											items={dataIds}
											strategy={verticalListSortingStrategy}
										>
											{table.getRowModel().rows.map((row) => (
												<TableRow
													key={row.id}
													onClick={() => setSelectedUser(row.original)}
													className="cursor-pointer"
												>
													{row.getVisibleCells().map((cell) => (
														<TableCell key={cell.id}>
															{cell.column.id === "actions" ? (
																<DropdownMenu>
																	<DropdownMenuTrigger asChild>
																		<Button
																			variant="ghost"
																			className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
																			size="icon"
																			onClick={(e) => e.stopPropagation()}
																		>
																			<IconDotsVertical />
																			<span className="sr-only">Open menu</span>
																		</Button>
																	</DropdownMenuTrigger>
																	<DropdownMenuContent
																		align="end"
																		className="w-32"
																	>
																		<DropdownMenuItem
																			onClick={(e) => {
																				e.stopPropagation();
																				handleEdit(row.original);
																			}}
																		>
																			Edit
																		</DropdownMenuItem>
																		<DropdownMenuItem>
																			Make a copy
																		</DropdownMenuItem>
																		<DropdownMenuItem>
																			Favorite
																		</DropdownMenuItem>
																		<DropdownMenuSeparator />
																		<DropdownMenuItem
																			variant="destructive"
																			onClick={async (e) => {
																				e.stopPropagation();
																				try {
																					await deleteUser(row.original.id);
																					setTableData((prev) =>
																						prev.filter(
																							(user) =>
																								user.id !== row.original.id,
																						),
																					);
																					toast.success(
																						"User deleted successfully",
																					);
																				} catch (err) {
																					toast.error("Failed to delete user");
																				}
																			}}
																		>
																			Delete
																		</DropdownMenuItem>
																	</DropdownMenuContent>
																</DropdownMenu>
															) : (
																flexRender(
																	cell.column.columnDef.cell,
																	cell.getContext(),
																)
															)}
														</TableCell>
													))}
												</TableRow>
											))}
										</SortableContext>
									) : (
										<TableRow>
											<TableCell
												colSpan={columns.length}
												className="h-24 text-center"
											>
												No results.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</DndContext>
					</div>
					<div className="flex items-center justify-between px-4">
						<div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
							{table.getFilteredSelectedRowModel().rows.length} of{" "}
							{table.getFilteredRowModel().rows.length} row(s) selected.
						</div>
						<div className="flex w-full items-center gap-8 lg:w-fit">
							<div className="hidden items-center gap-2 lg:flex">
								<Label htmlFor="rows-per-page" className="text-sm font-medium">
									Rows per page
								</Label>
								<Select
									value={`${table.getState().pagination.pageSize}`}
									onValueChange={(value) => {
										table.setPageSize(Number(value));
									}}
								>
									<SelectTrigger size="sm" className="w-20" id="rows-per-page">
										<SelectValue
											placeholder={table.getState().pagination.pageSize}
										/>
									</SelectTrigger>
									<SelectContent side="top">
										{[10, 20, 30, 40, 50].map((pageSize) => (
											<SelectItem key={pageSize} value={`${pageSize}`}>
												{pageSize}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="flex w-fit items-center justify-center text-sm font-medium">
								Page {table.getState().pagination.pageIndex + 1} of{" "}
								{table.getPageCount()}
							</div>
							<div className="ml-auto flex items-center gap-2 lg:ml-0">
								<Button
									variant="outline"
									className="hidden h-8 w-8 p-0 lg:flex"
									onClick={() => table.setPageIndex(0)}
									disabled={!table.getCanPreviousPage()}
								>
									<span className="sr-only">Go to first page</span>
									<IconChevronsLeft />
								</Button>
								<Button
									variant="outline"
									className="size-8"
									size="icon"
									onClick={() => table.previousPage()}
									disabled={!table.getCanPreviousPage()}
								>
									<span className="sr-only">Go to previous page</span>
									<IconChevronLeft />
								</Button>
								<Button
									variant="outline"
									className="size-8"
									size="icon"
									onClick={() => table.nextPage()}
									disabled={!table.getCanNextPage()}
								>
									<span className="sr-only">Go to next page</span>
									<IconChevronRight />
								</Button>
								<Button
									variant="outline"
									className="hidden size-8 lg:flex"
									size="icon"
									onClick={() => table.setPageIndex(table.getPageCount() - 1)}
									disabled={!table.getCanNextPage()}
								>
									<span className="sr-only">Go to last page</span>
									<IconChevronsRight />
								</Button>
							</div>
						</div>
					</div>
				</TabsContent>
				<TabsContent
					value="past-performance"
					className="flex flex-col px-4 lg:px-6"
				>
					<div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
				</TabsContent>
				<TabsContent
					value="key-personnel"
					className="flex flex-col px-4 lg:px-6"
				>
					<div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
				</TabsContent>
				<TabsContent
					value="focus-documents"
					className="flex flex-col px-4 lg:px-6"
				>
					<div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
				</TabsContent>
			</Tabs>
			{selectedUser && (
				<TableCellViewer
					item={selectedUser}
					open={!!selectedUser}
					onOpenChange={(open) => {
						if (!open) setSelectedUser(null);
					}}
				/>
			)}
			<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit User</DialogTitle>
						<DialogDescription>Edit the user details below.</DialogDescription>
					</DialogHeader>
					{editingUser && (
						<form
							className="flex flex-col gap-4"
							onSubmit={async (e) => {
								e.preventDefault();
								const form = e.currentTarget;
								const formData = new FormData(form);
								const updated = {
									first_name: formData.get("edit_first_name") as string,
									last_name: formData.get("edit_last_name") as string,
									email: formData.get("edit_email") as string,
									role: formData.get("edit_role") as string,
									condition: formData.get("edit_condition") as string,
								};
								try {
									await updateUserInfo(editingUser.id, updated);
									setTableData((prev) =>
										prev.map((user) =>
											user.id === editingUser.id
												? { ...user, ...updated }
												: user,
										),
									);
									setEditDialogOpen(false);
									toast.success("User updated successfully");
								} catch (err) {
									toast.error("Failed to update user");
								}
							}}
						>
							<div className="flex flex-col gap-3">
								<Label htmlFor="edit_first_name">First Name</Label>
								<Input
									id="edit_first_name"
									name="edit_first_name"
									defaultValue={editingUser.first_name}
								/>
							</div>
							<div className="flex flex-col gap-3">
								<Label htmlFor="edit_last_name">Last Name</Label>
								<Input
									id="edit_last_name"
									name="edit_last_name"
									defaultValue={editingUser.last_name}
								/>
							</div>
							<div className="flex flex-col gap-3">
								<Label htmlFor="edit_email">Email</Label>
								<Input
									id="edit_email"
									name="edit_email"
									defaultValue={editingUser.email}
								/>
							</div>
							<div className="flex flex-col gap-3">
								<Label htmlFor="edit_role">Role</Label>
								<Input
									id="edit_role"
									name="edit_role"
									defaultValue={editingUser.role}
								/>
							</div>
							<div className="flex flex-col gap-3">
								<Label htmlFor="edit_condition">Condition</Label>
								<Input
									id="edit_condition"
									name="edit_condition"
									defaultValue={editingUser.condition}
								/>
							</div>
							<DialogFooter>
								<Button type="submit">Save</Button>
								<DialogClose asChild>
									<Button variant="outline" type="button">
										Cancel
									</Button>
								</DialogClose>
							</DialogFooter>
						</form>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}

function TableCellViewer({
	item,
	open,
	onOpenChange,
}: {
	item: User;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const isMobile = useIsMobile();

	return (
		<Drawer
			direction={isMobile ? "bottom" : "right"}
			open={open}
			onOpenChange={onOpenChange}
		>
			<DrawerContent>
				<DrawerHeader className="gap-1">
					<DrawerTitle>
						{item.first_name} {item.last_name}
					</DrawerTitle>
					<DrawerDescription>User details</DrawerDescription>
				</DrawerHeader>
				<div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
					<form className="flex flex-col gap-4">
						<div className="flex flex-col gap-3">
							<Label htmlFor="first_name">First Name</Label>
							<Input id="first_name" defaultValue={item.first_name} readOnly />
						</div>
						<div className="flex flex-col gap-3">
							<Label htmlFor="last_name">Last Name</Label>
							<Input id="last_name" defaultValue={item.last_name} readOnly />
						</div>
						<div className="flex flex-col gap-3">
							<Label htmlFor="email">Email</Label>
							<Input id="email" defaultValue={item.email} readOnly />
						</div>
						<div className="flex flex-col gap-3">
							<Label htmlFor="role">Role</Label>
							<Input id="role" defaultValue={item.role} readOnly />
						</div>
						<div className="flex flex-col gap-3">
							<Label htmlFor="condition">Condition</Label>
							<Input id="condition" defaultValue={item.condition} readOnly />
						</div>
					</form>
				</div>
				<DrawerFooter>
					<Button onClick={() => onOpenChange(false)}>Done</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
