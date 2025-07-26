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
  Filter,
  Search,
  User,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
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

const getStatusBadge = (status: string) => {
  const variants = {
    completed: {
      variant: "default" as const,
      icon: CheckCircle,
      color: "text-green-600",
    },
    in_progress: {
      variant: "secondary" as const,
      icon: Clock,
      color: "text-yellow-600",
    },
    rescheduled: {
      variant: "outline" as const,
      icon: AlertCircle,
      color: "text-blue-600",
    },
    cancelled: {
      variant: "destructive" as const,
      icon: XCircle,
      color: "text-red-600",
    },
    scheduled: {
      variant: "secondary" as const,
      icon: Clock,
      color: "text-gray-600",
    },
  };
  const config = variants[status as keyof typeof variants] || variants.scheduled;
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} className="flex items-center gap-1 capitalize">
      <Icon className="h-3 w-3" />
      {status.replace(/_/g, " ")}
    </Badge>
  );
};

const columns: ColumnDef<Session>[] = [
  {
    header: "Title",
    accessorKey: "title",
    cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
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
    cell: ({ row }) => <span>{row.original.stage}</span>,
  },
  {
    header: "Child",
    accessorKey: "child_data",
    cell: ({ row }) => {
      const child = row.original.child_data;
      return (
        <div className="flex flex-col text-xs">
          <span className="font-semibold">{child.first_name} {child.last_name}</span>
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
          <span>{user.first_name} {user.last_name}</span>
        </div>
      );
    },
  },
  {
    header: "Tags",
    accessorKey: "tags",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs"><Tag className="h-3 w-3 mr-1" />{tag}</Badge>
        ))}
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
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [tableData, setTableData] = React.useState<Session[]>(data);

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
    enableRowSelection: false,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Sessions</h2>
        <p className="text-muted-foreground">All sessions in the system.</p>
      </div>
      {/* Table Toolbar */}
      <div className="flex flex-1 items-center gap-2 mb-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" disabled>
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
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
                    <p>No sessions found.</p>
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
          Showing {((page - 1) * rowsPerPage) + 1} to {Math.min(page * rowsPerPage, total)} of {total} entries
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
    </div>
  );
} 