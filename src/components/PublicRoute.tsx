import type React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function PublicRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, token } = useAuth();

	// If user is authenticated, redirect to dashboard
	if (token && user) {
		return <Navigate to="/dashboard" replace />;
	}

	return <>{children}</>;
}
