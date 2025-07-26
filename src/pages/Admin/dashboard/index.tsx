import { useQuery } from "@tanstack/react-query";
import { fetchActivities } from "@/api/activities";
import { queryUsers } from "@/api/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import SpinnerLoading from "@/components/ui/spinner-loading";
import { fetchAllSessions } from "@/api/sessions";
import { Suspense, lazy } from "react";

// Lazy load dashboard components
const StatsCards = lazy(() => import("./components/StatsCards.tsx"));
const SessionDurationChart = lazy(() => import("./components/SessionDurationChart.tsx"));
const QuickStats = lazy(() => import("./components/QuickStats.tsx"));
const RecentActivity = lazy(() => import("./components/RecentActivity.tsx"));
const PendingActions = lazy(() => import("./components/PendingActions.tsx"));

// Loading fallback component
const ChartLoadingFallback = () => (
	<div className="flex items-center justify-center h-[250px] w-full bg-gray-50 rounded-lg">
		<div className="text-center">
			<SpinnerLoading />
			<p className="text-sm text-gray-500 mt-2">Loading chart...</p>
		</div>
	</div>
);

// Loading cards fallback
const LoadingCardsFallback = () => (
	<div className="grid w-full gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-6 mb-8">
		{["users", "social-workers", "admins", "approved", "duration", "upcoming"].map((cardType) => (
			<Card key={`loading-${cardType}`}>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Loading...</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">...</div>
				</CardContent>
			</Card>
		))}
	</div>
);

export default function AdminDashboard() {
	// Fetch user statistics from the backend
	const { token } = useAuth();
	const { data, isLoading, error } = useQuery({
		queryKey: ["users-dashboard-stats"],
		queryFn: () => token ? queryUsers({ page: 1, rowsPerPage: 1 }, token) : Promise.reject(new Error("No token")),
		select: (res) => res.statistics,
	});

	// Fetch activities
	const {
		data: activities,
		isLoading: isLoadingActivities,
		error: activitiesError,
	} = useQuery({
		queryKey: ["recent-activities"],
		queryFn: fetchActivities,
	});

	// Fetch session statistics for admin
	const {
		data: sessionsData,
		isLoading: isLoadingSessions,
	} = useQuery({
		queryKey: ["admin-all-sessions"],
		queryFn: () => token ? fetchAllSessions(token) : Promise.reject(new Error("No token")),
		select: (res) => res.data,
	});

	// Calculate average session duration (in minutes) for completed sessions
	let averageSessionDuration = 0;
	let upcomingSessionsCount = 0;
	if (sessionsData && Array.isArray(sessionsData)) {
		const completedSessions = sessionsData.filter(
			s => s.status === "completed" && s.start_time && s.end_time
		);
		if (completedSessions.length > 0) {
			const totalDuration = completedSessions.reduce((sum, s) => {
				if (!s.start_time || !s.end_time) return sum;
				const start = new Date(s.start_time).getTime();
				const end = new Date(s.end_time).getTime();
				return sum + (end - start);
			}, 0);
			averageSessionDuration = Math.round(totalDuration / completedSessions.length / 60000); // in minutes
		}
		const now = new Date();
		upcomingSessionsCount = sessionsData.filter(s => {
			if (!s.start_time) return false;
			const start = new Date(s.start_time);
			return start > now && s.status !== "cancelled";
		}).length;
	}

	// Prepare data for Average Session Duration Over Time chart
	let avgSessionDurationData: { date: string; avgDuration: number }[] = [];
	if (sessionsData && Array.isArray(sessionsData)) {
		const completedSessions = sessionsData.filter(
			s => s.status === "completed" && s.start_time && s.end_time
		);
		const durationByDate: Record<string, number[]> = {};
		completedSessions.forEach(s => {
			if (!s.start_time || !s.end_time) return;
			const date = new Date(s.start_time).toISOString().slice(0, 10); // YYYY-MM-DD
			const start = new Date(s.start_time).getTime();
			const end = new Date(s.end_time).getTime();
			const duration = (end - start) / 60000; // in minutes
			if (!durationByDate[date]) durationByDate[date] = [];
			durationByDate[date].push(duration);
		});
		avgSessionDurationData = Object.entries(durationByDate)
			.map(([date, durations]) => ({
				date,
				avgDuration: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
			}))
			.sort((a, b) => a.date.localeCompare(b.date));
	}

	if (isLoading) {
		return <SpinnerLoading />;
	}
	if (error) {
		return (
			<div className="p-6 text-red-600">
				Failed to load statistics: {error.message}
			</div>
		);
	}

	return (
		<>
			<div className="mb-4">
				<h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
				<p className="text-muted-foreground">
					Overview of your system, users, and recent activity.
				</p>
			</div>
			
			{/* Stats Cards */}
			<Suspense fallback={<LoadingCardsFallback />}>
				<StatsCards 
					data={data}
					isLoadingSessions={isLoadingSessions}
					averageSessionDuration={averageSessionDuration}
					upcomingSessionsCount={upcomingSessionsCount}
				/>
			</Suspense>

			{/* Average Session Duration Over Time Chart */}
			<Suspense fallback={<ChartLoadingFallback />}>
				<SessionDurationChart avgSessionDurationData={avgSessionDurationData} />
			</Suspense>

			{/* Quick Stats, Recent Activity, Pending Actions */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Quick Stats */}
				<Suspense fallback={<Card><CardContent className="p-6"><SpinnerLoading /></CardContent></Card>}>
					<QuickStats data={data} />
				</Suspense>

				{/* Recent Activity */}
				<Suspense fallback={<Card><CardContent className="p-6"><SpinnerLoading /></CardContent></Card>}>
					<RecentActivity 
						activities={activities}
						isLoadingActivities={isLoadingActivities}
						activitiesError={activitiesError}
					/>
				</Suspense>

				{/* Pending Actions */}
				<Suspense fallback={<Card><CardContent className="p-6"><SpinnerLoading /></CardContent></Card>}>
					<PendingActions data={data} />
				</Suspense>
			</div>
		</>
	);
}
