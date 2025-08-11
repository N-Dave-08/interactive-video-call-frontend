import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSessionsBySocialWorkerId } from "@/api/sessions";

import SpinnerLoading from "@/components/ui/spinner-loading";
import { useAuth } from "@/hooks/useAuth";
import type { Session } from "@/types";

import SessionStatusPieChart from "./components/SessionStatusPieChart";
import WelcomeCard from "./components/WelcomeCard";
import StatisticsCards from "./components/StatisticsCards";
import ActiveSessionsList from "./components/ActiveSessionsList";
import UpcomingSessionsList from "./components/UpcomingSessionsList";

export default function Dashboard() {
	const { user, token } = useAuth();
	const navigate = useNavigate();
	const [sessions, setSessions] = useState<Session[]>([]);
	const [counts, setCounts] = useState<{
		scheduled: number;
		in_progress: number;
		completed: number;
		archived: number;
		rescheduled: number;
		cancelled: number;
	}>({
		scheduled: 0,
		in_progress: 0,
		completed: 0,
		archived: 0,
		rescheduled: 0,
		cancelled: 0,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!user || !token) {
			setLoading(false);
			setError("No token");
			return;
		}
		const fetchData = async () => {
			try {
				const response = await fetchSessionsBySocialWorkerId(user.id, token);
				setSessions(response.data);

				// Calculate cancelled count manually from sessions data
				const cancelledCount = response.data.filter(
					(session) => session.status === "cancelled",
				).length;

				setCounts({
					...response.counts,
					cancelled: cancelledCount,
				});
			} catch {
				setError("Failed to load sessions.");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [user, token]);

	const totalSessions = sessions.length;
	const completedSessions = counts.completed;
	const completionRate =
		totalSessions > 0
			? Math.round((completedSessions / totalSessions) * 100)
			: 0;

	// Calculate percentage change from last month
	const calculateMonthlyChange = () => {
		const now = new Date();
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();

		// Get sessions from current month
		const currentMonthSessions = sessions.filter((session) => {
			const sessionDate = new Date(session.createdAt);
			return (
				sessionDate.getMonth() === currentMonth &&
				sessionDate.getFullYear() === currentYear
			);
		});

		// Get sessions from previous month
		const previousMonthSessions = sessions.filter((session) => {
			const sessionDate = new Date(session.createdAt);
			const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
			const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
			return (
				sessionDate.getMonth() === previousMonth &&
				sessionDate.getFullYear() === previousYear
			);
		});

		const currentCount = currentMonthSessions.length;
		const previousCount = previousMonthSessions.length;

		if (previousCount === 0) {
			return currentCount > 0 ? 100 : 0; // If no previous month data, show 100% if current month has data
		}

		const change = ((currentCount - previousCount) / previousCount) * 100;
		return Math.round(change);
	};

	const monthlyChange = calculateMonthlyChange();
	const monthlyChangeText =
		monthlyChange > 0
			? `+${monthlyChange}% from last month`
			: monthlyChange < 0
				? `${monthlyChange}% from last month`
				: "No change from last month";

	const formatTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "in_progress":
				return "bg-amber-50 text-amber-700 border-amber-200";
			case "completed":
				return "bg-emerald-50 text-emerald-700 border-emerald-200";
			default:
				return "bg-gray-50 text-gray-700 border-gray-200";
		}
	};

	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good morning";
		if (hour < 18) return "Good afternoon";
		return "Good evening";
	};

	const getDisplayName = (first?: string, last?: string) => {
		const name = [first, last].filter(Boolean).join(" ").trim();
		return name || "No Name";
	};

	// Filter upcoming sessions (sessions with future start times)
	const upcomingSessions = sessions
		.filter((session) => {
			const sessionStartTime = new Date(session.start_time);
			const now = new Date();
			return sessionStartTime > now && session.status !== "cancelled";
		})
		.sort(
			(a, b) =>
				new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
		);

	const pieData = [
		{ name: "Scheduled", value: counts.scheduled, key: "scheduled" },
		{ name: "In Progress", value: counts.in_progress, key: "in_progress" },
		{ name: "Completed", value: counts.completed, key: "completed" },
		{ name: "Rescheduled", value: counts.rescheduled, key: "rescheduled" },
		{ name: "Cancelled", value: counts.cancelled || 0, key: "cancelled" },
	];

	const PIE_COLORS = ["#60A5FA", "#FBBF24", "#34D399", "#A78BFA", "#F87171"];

	const dashboardChartConfig = {
		scheduled: {
			label: "Scheduled",
			color: PIE_COLORS[0],
		},
		in_progress: {
			label: "In Progress",
			color: PIE_COLORS[1],
		},
		completed: {
			label: "Completed",
			color: PIE_COLORS[2],
		},
		rescheduled: {
			label: "Rescheduled",
			color: PIE_COLORS[3],
		},
		cancelled: {
			label: "Cancelled",
			color: PIE_COLORS[4],
		},
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-96">
				<SpinnerLoading />
			</div>
		);
	}

	if (error) {
		return <div className="text-center text-red-500 py-10">{error}</div>;
	}

	if (!user) {
		return (
			<div className="text-center text-slate-500 py-10">
				Please log in to view your dashboard.
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
			{/* Enhanced Header Section */}
			<div className="relative mb-6">
				{/* Background decoration */}
				<div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 rounded-2xl" />
				<div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-2xl" />
				<div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-xl" />

				{/* Header content */}
				<div className="relative z-10 pt-4 pb-3 px-3">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
						<h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
							{getGreeting()}, {user?.first_name}
						</h1>
						<div className="flex items-center gap-3">
							<div className="hidden lg:block w-px h-8 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
							<div className="text-right">
								<p className="text-xs font-medium text-slate-500">
									Today's Date
								</p>
								<p className="text-sm font-semibold text-slate-700">
									{new Date().toLocaleDateString("en-US", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Dashboard Content */}
			<div className="space-y-8">
				{/* Top Row - Chart and Welcome Card */}
				<div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
					{/* Welcome Card */}
					<div className="xl:col-span-8">
						<div className="h-full">
							<WelcomeCard
								counts={counts}
								onViewSchedule={() => navigate("/schedule")}
							/>
						</div>
					</div>

					{/* Pie Chart for Session Statuses */}
					<div className="xl:col-span-4">
						<div className="h-full">
							<SessionStatusPieChart
								pieData={pieData}
								dashboardChartConfig={dashboardChartConfig}
								PIE_COLORS={PIE_COLORS}
							/>
						</div>
					</div>
				</div>

				{/* Statistics Cards Row */}
				<div className="w-full">
					<StatisticsCards
						totalSessions={totalSessions}
						counts={counts}
						completionRate={completionRate}
						monthlyChange={monthlyChange}
						monthlyChangeText={monthlyChangeText}
					/>
				</div>

				{/* Bottom Row - Sessions Lists */}
				<div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
					{/* Current Sessions */}
					<div className="xl:col-span-8">
						<ActiveSessionsList
							sessions={sessions}
							navigate={navigate}
							getDisplayName={getDisplayName}
							formatTime={formatTime}
							getStatusColor={getStatusColor}
						/>
					</div>

					{/* Upcoming Sessions */}
					<div className="xl:col-span-4">
						<UpcomingSessionsList
							sessions={upcomingSessions}
							navigate={navigate}
							getDisplayName={getDisplayName}
							formatDate={formatDate}
							formatTime={formatTime}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
