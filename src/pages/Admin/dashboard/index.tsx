import { useQuery } from "@tanstack/react-query";
import {
	Activity,
	Bell,
	CheckCircle,
	Clock,
	Settings,
	TrendingUp,
	UserCheck,
	Users,
} from "lucide-react";
import { fetchActivities } from "@/api/activities";
import { queryUsers } from "@/api/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Activity as ActivityType } from "@/types/activity";

export default function AdminDashboard() {
	// Fetch user statistics from the backend
	const { data, isLoading, error } = useQuery({
		queryKey: ["users-dashboard-stats"],
		queryFn: () => queryUsers({ page: 1, rowsPerPage: 1 }),
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

	const getActivityIcon = (type: string) => {
		switch (type) {
			case "approval":
			case "registered":
				return <Users className="h-4 w-4 text-blue-600" />;
			case "create":
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			case "update":
				return <Settings className="h-4 w-4 text-orange-600" />;
			case "delete":
				return <Bell className="h-4 w-4 text-red-600" />;
			default:
				return <Activity className="h-4 w-4 text-gray-600" />;
		}
	};

	if (isLoading) {
		return <div className="p-6">Loading dashboard statistics...</div>;
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
			<div className="grid gap-4 md:grid-cols-5 mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{data?.totalUsers ?? 0}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Social Workers
						</CardTitle>
						<UserCheck className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">
							{data?.socialWorkerCount ?? 0}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Admins</CardTitle>
						<Settings className="h-4 w-4 text-purple-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-600">
							{data?.adminCount ?? 0}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Approved Users
						</CardTitle>
						<CheckCircle className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{data?.approvedCount ?? 0}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Today</CardTitle>
						<TrendingUp className="h-4 w-4 text-blue-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-500">N/A</div>
					</CardContent>
				</Card>
			</div>

			{/* Quick Stats, Recent Activity, Pending Actions */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Quick Stats */}
				<Card>
					<CardHeader className="border-b border-gray-200">
						<CardTitle className="text-lg font-semibold text-gray-900">
							Quick Stats
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">Approval Rate</span>
								<span className="text-sm font-medium text-gray-900">
									{data ? `${data.approvalRate}%` : "0%"}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">New This Week</span>
								<span className="text-sm font-medium text-gray-900">
									{data?.newThisWeek ?? 0}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">Rejected</span>
								<span className="text-sm font-medium text-gray-900">
									{data?.rejectedCount ?? 0}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">Blocked</span>
								<span className="text-sm font-medium text-gray-900">
									{data?.blockedCount ?? 0}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">Need Approval</span>
								<span className="text-sm font-medium text-gray-900">
									{data?.needForApprovalCount ?? 0}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Recent Activity */}
				<Card className="lg:col-span-1 bg-white">
					<CardHeader className="border-b border-gray-200">
						<CardTitle className="text-lg font-semibold text-gray-900">
							Recent Activity
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						<div className="space-y-4 max-h-96 overflow-y-auto pr-2">
							{isLoadingActivities ? (
								<div>Loading activities...</div>
							) : activitiesError ? (
								<div className="text-red-600">Failed to load activities</div>
							) : (
								activities?.map((activity: ActivityType) => (
									<div key={activity.id} className="flex items-start space-x-3">
										<div className="flex-shrink-0 mt-1">
											{getActivityIcon(activity.type)}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-900">
												{activity.user}
											</p>
											<p className="text-sm text-gray-600">{activity.action}</p>
											<p className="text-xs text-gray-400 mt-1">
												{new Date(activity.createdAt).toLocaleString()}
											</p>
										</div>
									</div>
								))
							)}
						</div>
						<Button variant="ghost" size="sm" className="w-full mt-4">
							View all activity
						</Button>
					</CardContent>
				</Card>

				{/* Pending Actions */}
				<Card>
					<CardHeader className="border-b border-gray-200">
						<CardTitle className="text-lg font-semibold text-gray-900">
							Pending Actions
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						<div className="space-y-3">
							<div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
								<div className="flex items-center space-x-2">
									<Clock className="h-4 w-4 text-yellow-600" />
									<span className="text-sm font-medium text-yellow-800">
										{data?.needForApprovalCount ?? 0} approvals needed
									</span>
								</div>
								<Button
									size="sm"
									variant="outline"
									className="text-yellow-700 border-yellow-300 bg-transparent"
								>
									Review
								</Button>
							</div>
							<div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
								<div className="flex items-center space-x-2">
									<Bell className="h-4 w-4 text-blue-600" />
									<span className="text-sm font-medium text-blue-800">
										3 notifications
									</span>
								</div>
								<Button
									size="sm"
									variant="outline"
									className="text-blue-700 border-blue-300 bg-transparent"
								>
									View
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
