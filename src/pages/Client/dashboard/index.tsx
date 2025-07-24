import {
	CheckCircle,
	ChevronRight,
	Clock,
	FileText,
	MoreVertical,
	TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSessionsBySocialWorkerId } from "@/api/sessions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import SpinnerLoading from "@/components/ui/spinner-loading";
import { useAuth } from "@/hooks/useAuth";
import type { Session } from "@/types";

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

	const completionRate =
		totalSessions > 0
			? Math.round((completedSessions / totalSessions) * 100)
			: 0;

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

	const getInitials = (firstName?: string, lastName?: string) => {
		const first = firstName?.[0] ?? "";
		const last = lastName?.[0] ?? "";
		return `${first}${last}` || "NA";
	};

	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good morning";
		if (hour < 18) return "Good afternoon";
		return "Good evening";
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
			<div className="mb-4">
				<h1 className="text-3xl font-bold text-slate-900 mb-2">
					{getGreeting()}, {user?.first_name} {user?.last_name}
				</h1>
				<p className="text-slate-600">
					Here's what's happening with your sessions today.
				</p>
			</div>

			{/* Grid Layout */}
			<div className="grid grid-cols-12 gap-3">
				{/* Welcome Card */}
				<div className="col-span-4">
					<Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
						<CardHeader>
							<CardTitle className="text-xl font-semibold text-slate-900">
								Today's Overview
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div>
								<div className="flex items-center justify-between">
									<span className="text-slate-600">Sessions scheduled</span>
									<span className="text-2xl font-bold text-blue-600">
										{counts.scheduled}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-slate-600">Active sessions</span>
									<span className="text-lg font-semibold text-amber-600">
										{counts.in_progress}
									</span>
								</div>
							</div>
							<Button
								className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
								onClick={() => navigate("/schedule")}
							>
								<CheckCircle className="h-4 w-4 mr-2" />
								View Schedule
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Statistics Cards */}
				<div className="col-span-8 grid grid-cols-3 gap-2">
					<Card className="border-0 shadow-sm">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-slate-600 mb-1">
										Total Sessions
									</p>
									<p className="text-3xl font-bold text-slate-900">
										{totalSessions}
									</p>
								</div>
								<div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
									<FileText className="h-6 w-6 text-blue-600" />
								</div>
							</div>
							<div className="mt-4 flex items-center">
								<TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
								<span className="text-sm text-emerald-600 font-medium">
									+12% from last month
								</span>
							</div>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-sm">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-slate-600 mb-1">
										In Progress
									</p>
									<p className="text-3xl font-bold text-slate-900">
										{counts.in_progress}
									</p>
								</div>
								<div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center">
									<Clock className="h-6 w-6 text-amber-600" />
								</div>
							</div>
							<div className="mt-4">
								<Progress value={completionRate} className="h-2" />
								<span className="text-sm text-slate-500 mt-1">
									{completionRate}% completion rate
								</span>
							</div>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-sm">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-slate-600 mb-1">
										Completed
									</p>
									<p className="text-3xl font-bold text-slate-900">
										{counts.completed}
									</p>
								</div>
								<div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center">
									<CheckCircle className="h-6 w-6 text-emerald-600" />
								</div>
							</div>
							<div className="mt-4 flex items-center">
								<span className="text-sm text-slate-500">
									{completionRate}% success rate
								</span>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Current Sessions */}
				<div className="col-span-8">
					<Card className="border-0 shadow-sm h-full">
						<CardHeader className="border-b border-slate-100 pb-4">
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="text-xl font-semibold text-slate-900">
										Active Sessions
									</CardTitle>
									<CardDescription className="text-slate-500">
										Currently in progress
									</CardDescription>
								</div>
								<Button variant="ghost" size="sm">
									<MoreVertical className="h-4 w-4" />
								</Button>
							</div>
						</CardHeader>
						<CardContent className="p-0">
							<div className="divide-y divide-slate-100">
								{sessions
									.filter((session) => session.status === "in_progress")
									.map((session) => (
										<button
											key={session.session_id}
											type="button"
											className="w-full text-left p-6 hover:bg-slate-50 transition-colors cursor-pointer bg-transparent border-0"
											onClick={() =>
												navigate(`/sessions/${session.session_id}`, {
													state: { session },
												})
											}
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-4">
													<Avatar className="h-12 w-12 ring-2 ring-slate-100">
														<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
															{getInitials(
																session.child_data.first_name,
																session.child_data.last_name,
															)}
														</AvatarFallback>
													</Avatar>
													<div>
														<h4 className="font-semibold text-slate-900">
															{session.child_data.first_name}{" "}
															{session.child_data.last_name}
														</h4>
														<p className="text-sm text-slate-500 mb-1">
															{session.title}
														</p>
														<div className="flex items-center space-x-4 text-xs text-slate-400">
															<span>Age: {session.child_data.age}</span>
															<span>•</span>
															<span>
																Gender: {session.child_data.gender || "N/A"}
															</span>
															<span>•</span>
															<span>{session.stage}</span>
															<span>•</span>
															<span>{formatTime(session.start_time)}</span>
														</div>
													</div>
												</div>
												<div className="flex items-center space-x-3">
													{session.tags.map((tag) => (
														<Badge
															key={tag}
															variant="secondary"
															className="bg-slate-100 text-slate-600"
														>
															{tag}
														</Badge>
													))}
													<Badge
														className={getStatusColor(session.status)}
														variant="outline"
													>
														{session.status.replace("_", " ")}
													</Badge>
												</div>
											</div>
										</button>
									))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Upcoming Sessions */}
				<div className="col-span-4">
					<Card className="border-0 shadow-sm h-full">
						<CardHeader className="border-b border-slate-100 pb-4">
							<CardTitle className="text-xl font-semibold text-slate-900">
								Upcoming Sessions
							</CardTitle>
							<CardDescription className="text-slate-500">
								Next appointments
							</CardDescription>
						</CardHeader>
						<CardContent className="p-0">
							<div className="divide-y divide-slate-100">
								{sessions.slice(0, 4).map((session) => (
									<button
										key={session.session_id}
										type="button"
										className="w-full text-left p-4 hover:bg-slate-50 transition-colors cursor-pointer bg-transparent border-0"
										onClick={() =>
											navigate(`/sessions/${session.session_id}`, {
												state: { session },
											})
										}
									>
										<div className="flex items-center space-x-3">
											<Avatar className="h-10 w-10">
												<AvatarFallback className="bg-slate-100 text-slate-600 text-sm font-medium">
													{getInitials(
														session.child_data.first_name,
														session.child_data.last_name,
													)}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<p className="font-medium text-slate-900 truncate">
													{session.child_data.first_name}{" "}
													{session.child_data.last_name}
												</p>
												<div className="flex items-center space-x-2 text-sm text-slate-500">
													<span>{formatDate(session.start_time)}</span>
													<span>•</span>
													<span>{formatTime(session.start_time)}</span>
												</div>
											</div>
											<ChevronRight className="h-4 w-4 text-slate-400" />
										</div>
									</button>
								))}
							</div>
							<div className="p-4 border-t border-slate-100">
								<Button
									variant="ghost"
									className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
									onClick={() => navigate("/sessions")}
								>
									View all sessions
									<ChevronRight className="h-4 w-4 ml-1" />
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
}
