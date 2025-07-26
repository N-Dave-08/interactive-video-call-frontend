import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchAllSessions } from "@/api/sessions";
import { SessionsDataTable } from "./components/sessions-data-table";
import { useAuth } from "@/hooks/useAuth";

export default function SessionsAdmin() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { token } = useAuth();

  const {
    data: queryData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["sessions", token],
    queryFn: () => token ? fetchAllSessions(token) : Promise.reject(new Error("No token")),
    enabled: !!token,
  });

  if (error) return <div>{error.message || "Failed to fetch sessions"}</div>;

  // Filter and paginate client-side for now
  const allSessions = queryData?.data || [];
  const filtered = debouncedSearch
    ? allSessions.filter((s) =>
        s.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.user.first_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.user.last_name.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : allSessions;
  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <SessionsDataTable
      data={paginated}
      total={total}
      search={search}
      setSearch={setSearch}
      page={page}
      setPage={setPage}
      rowsPerPage={rowsPerPage}
      setRowsPerPage={setRowsPerPage}
      loading={loading}
    />
  );
}
