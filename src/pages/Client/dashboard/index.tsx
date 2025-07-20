import {
	Activity,
	Calendar,
	CheckCircle,
	ChevronRight,
	Clock,
	FileText,
	MoreVertical,
	TrendingUp,
	Users,
} from "lucide-react";
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

// Sample data based on your JSON
const sessionsData = [
	{
		session_id: "99e9263f-d865-4ade-b0d1-556598ecdc68",
		title: "Behavioral Assessment Session",
		start_time: "2025-07-20T14:00:00.000Z",
		end_time: null,
		child_data: {
			age: 12,
			birthday: "07/03/2025",
			last_name: "Johnson",
			first_name: "Emma",
		},
		emotional_expression: {
			selected_feelings: ["anxious", "hopeful"],
			body_map_annotations: [],
		},
		session_notes: "",
		tags: ["Assessment", "Behavioral"],
		status: "in_progress",
		stage: "Stage 4",
		user: {
			first_name: "Dr. Sarah",
			last_name: "Wilson",
		},
	},
	{
		session_id: "4b06db4d-d963-4563-8a3a-f77c29602f6d",
		title: "Play Therapy Session",
		start_time: "2025-07-20T10:30:00.000Z",
		end_time: null,
		child_data: {
			age: 6,
			birthday: "07/08/2019",
			last_name: "Martinez",
			first_name: "Lucas",
		},
		emotional_expression: {
			selected_feelings: ["happy", "excited"],
			body_map_annotations: [],
		},
		session_notes: "",
		tags: ["Play Therapy", "Development"],
		status: "in_progress",
		stage: "Stage 3",
		user: {
			first_name: "Dr. Sarah",
			last_name: "Wilson",
		},
	},
	{
		session_id: "baf78bb5-d313-4ca6-b904-39322c480718",
		title: "Family Counseling Session",
		start_time: "2025-07-19T15:30:00.000Z",
		end_time: "2025-07-19T16:30:00.000Z",
		child_data: {
			age: 14,
			birthday: "07/01/2011",
			last_name: "Thompson",
			first_name: "Alex",
		},
		emotional_expression: {
			selected_feelings: ["nervous", "relieved"],
			body_map_annotations: ["upperBack:tension"],
		},
		session_notes:
			"Significant progress in communication skills. Family dynamics showing improvement with structured activities.",
		tags: ["Family Therapy", "Communication"],
		status: "completed",
		stage: "Completion",
		user: {
			first_name: "Dr. Sarah",
			last_name: "Wilson",
		},
	},
	{
		session_id: "affe5541-4e66-4080-9310-597bd0ac3858",
		title: "Individual Therapy Session",
		start_time: "2025-07-18T13:00:00.000Z",
		end_time: "2025-07-18T14:00:00.000Z",
		child_data: {
			age: 10,
			birthday: "07/01/2015",
			last_name: "Davis",
			first_name: "Maya",
		},
		emotional_expression: {
			selected_feelings: ["confident", "calm"],
			body_map_annotations: [],
		},
		session_notes:
			"Excellent session with breakthrough in self-expression techniques.",
		tags: ["Individual", "Cognitive"],
		status: "completed",
		stage: "Completion",
		user: {
			first_name: "Dr. Sarah",
			last_name: "Wilson",
		},
	},
];

export default function Dashboard() {
	const totalSessions = sessionsData.length;
	const activeSessions = sessionsData.filter(
		(s) => s.status === "in_progress",
	).length;
	const completedSessions = sessionsData.filter(
		(s) => s.status === "completed",
	).length;
	const todaySessions = sessionsData.filter((s) => {
		const today = new Date().toDateString();
		return new Date(s.start_time).toDateString() === today;
	}).length;

	const completionRate = Math.round((completedSessions / totalSessions) * 100);

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

	const getInitials = (firstName: string, lastName: string) => {
		return `${firstName[0]}${lastName[0]}`;
	};

	return (
		<>
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 mb-2">
					Good afternoon, Dr. Wilson
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
						<CardHeader className="pb-4">
							<CardTitle className="text-xl font-semibold text-slate-900">
								Today's Overview
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-slate-600">Sessions scheduled</span>
									<span className="text-2xl font-bold text-blue-600">
										{todaySessions}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-slate-600">Active sessions</span>
									<span className="text-lg font-semibold text-amber-600">
										{activeSessions}
									</span>
								</div>
							</div>
							<Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm">
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
										{activeSessions}
									</p>
								</div>
								<div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center">
									<Clock className="h-6 w-6 text-amber-600" />
								</div>
							</div>
							<div className="mt-4">
								<Progress value={60} className="h-2" />
								<span className="text-sm text-slate-500 mt-1">
									60% completion rate
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
										{completedSessions}
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
								{sessionsData
									.filter((session) => session.status === "in_progress")
									.map((session, index) => (
										<div
											key={session.session_id}
											className="p-6 hover:bg-slate-50 transition-colors"
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
															<span>{session.stage}</span>
															<span>•</span>
															<span>{formatTime(session.start_time)}</span>
														</div>
													</div>
												</div>
												<div className="flex items-center space-x-3">
													{session.tags.map((tag, tagIndex) => (
														<Badge
															key={tagIndex}
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
										</div>
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
								{sessionsData.slice(0, 4).map((session, index) => (
									<div
										key={session.session_id}
										className="p-4 hover:bg-slate-50 transition-colors"
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
									</div>
								))}
							</div>
							<div className="p-4 border-t border-slate-100">
								<Button
									variant="ghost"
									className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
