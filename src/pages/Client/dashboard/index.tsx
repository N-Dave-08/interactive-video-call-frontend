
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
	const { user } = useAuth();
	const navigate = useNavigate();
	const [sessions, setSessions] = useState<Session[]>([]);
	const [counts, setCounts] = useState<{
		scheduled: number;
		in_progress: number;
		completed: number;
		archived: number;
		rescheduled: number;
	}>({
		scheduled: 0,
		in_progress: 0,
		completed: 0,
		archived: 0,
		rescheduled: 0,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!user) {
			setLoading(false);
			return;
		}
		const fetchData = async () => {
			try {
				const response = await fetchSessionsBySocialWorkerId(user.id);
				setSessions(response.data);
				setCounts(response.counts);
			} catch {
				setError("Failed to load sessions.");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [user]);

	const totalSessions = sessions.length;
	const completedSessions = counts.completed;
	const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

	// Calculate percentage change from last month
	const calculateMonthlyChange = () => {
		const now = new Date();
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();
		
		// Get sessions from current month
		const currentMonthSessions = sessions.filter(session => {
			const sessionDate = new Date(session.createdAt);
			return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear;
		});
		
		// Get sessions from previous month
		const previousMonthSessions = sessions.filter(session => {
			const sessionDate = new Date(session.createdAt);
			const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
			const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
			return sessionDate.getMonth() === previousMonth && sessionDate.getFullYear() === previousYear;
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
	const monthlyChangeText = monthlyChange > 0 
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

	const pieData = [
		{ name: "Scheduled", value: counts.scheduled, key: "scheduled" },
		{ name: "In Progress", value: counts.in_progress, key: "in_progress" },
		{ name: "Completed", value: counts.completed, key: "completed" },
	];

	const PIE_COLORS = ["#60A5FA", "#FBBF24", "#34D399"];

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
		<>
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 mb-2">
					{getGreeting()}, {user?.first_name} {user?.last_name}
				</h1>
				<p className="text-slate-600">Here's what's happening with your sessions today.</p>
			</div>

			{/* Grid Layout */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
				{/* Pie Chart for Session Statuses */}
				<div className="md:col-span-2 lg:col-span-7">
					<SessionStatusPieChart
						pieData={pieData}
						dashboardChartConfig={dashboardChartConfig}
						PIE_COLORS={PIE_COLORS}
					/>
				</div>

				{/* Welcome Card */}
				<div className="md:col-span-2 lg:col-span-5">
					<WelcomeCard
						counts={counts}
						onViewSchedule={() => navigate("/schedule")}
					/>
				</div>

				{/* Statistics Cards */}
				<StatisticsCards
					totalSessions={totalSessions}
					counts={counts}
					completionRate={completionRate}
					monthlyChange={monthlyChange}
					monthlyChangeText={monthlyChangeText}
				/>

				{/* Current Sessions */}
				<div className="md:col-span-2 lg:col-span-8">
					<ActiveSessionsList
						sessions={sessions}
						navigate={navigate}
						getDisplayName={getDisplayName}
						formatTime={formatTime}
						getStatusColor={getStatusColor}
					/>
				</div>

				{/* Upcoming Sessions */}
				<div className="md:col-span-2 lg:col-span-4">
					<UpcomingSessionsList
						sessions={sessions}
						navigate={navigate}
						getDisplayName={getDisplayName}
						formatDate={formatDate}
						formatTime={formatTime}
					/>
				</div>
			</div>
		</>
	);
}
