import type React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	const { token } = useAuth();
	if (!token) {
		return <Navigate to="/login" replace />;
	}
	return <>{children}</>;
}
