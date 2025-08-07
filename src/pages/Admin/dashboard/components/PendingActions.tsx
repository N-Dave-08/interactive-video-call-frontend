import { Clock, CheckCircle, User as UserIcon, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { queryUsers } from "@/api/users";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types";

interface PendingActionsProps {
	data?: {
		needForApprovalCount?: number;
		totalUsers?: number;
		approvedCount?: number;
		socialWorkerCount?: number;
		adminCount?: number;
	};
}

export default function PendingActions({ data }: PendingActionsProps) {
	const { token } = useAuth();
	const pendingApprovals = data?.needForApprovalCount ?? 0;
	const hasPendingActions = pendingApprovals > 0;

	// Fetch pending users
	const { data: pendingUsers, isLoading } = useQuery({
		queryKey: ["pending-users"],
		queryFn: () =>
			token
				? queryUsers({ condition: "pending", rowsPerPage: 5 }, token)
				: Promise.reject(new Error("No token")),
		enabled: !!token && hasPendingActions,
	});

	const getRoleBadge = (role: string) => {
		if (role === "admin") {
			return (
				<Badge className="bg-gradient-to-r from-purple-600 to-purple-800 text-white border-none px-2 py-0.5 text-xs font-semibold rounded-full shadow-sm">
					Admin
				</Badge>
			);
		}
		if (role === "social_worker") {
			return (
				<Badge className="bg-gradient-to-r from-sky-500 to-teal-500 text-white border-none px-2 py-0.5 text-xs font-semibold rounded-full shadow-sm">
					Social Worker
				</Badge>
			);
		}
		return (
			<Badge className="bg-gray-200 text-gray-800 border-gray-300 px-2 py-0.5 text-xs font-semibold rounded-full">
				{role}
			</Badge>
		);
	};

	return (
		<Card>
			<CardHeader className="border-b border-gray-200">
				<CardTitle className="text-lg font-semibold text-gray-900">
					Pending Actions
				</CardTitle>
			</CardHeader>
			<CardContent className="p-6">
				<div className="space-y-4">
					{/* Pending Actions Section */}
					{hasPendingActions ? (
						<div className="space-y-3">
							{/* Header with count */}
							<div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
								<div className="flex items-center space-x-2">
									<Clock className="h-4 w-4 text-yellow-600" />
									<span className="text-sm font-medium text-yellow-800">
										{pendingApprovals} user approval
										{pendingApprovals !== 1 ? "s" : ""} needed
									</span>
								</div>
								<Button
									size="sm"
									variant="outline"
									className="text-yellow-700 border-yellow-300 bg-transparent hover:bg-yellow-100"
									asChild
								>
									<Link to="/users">View All</Link>
								</Button>
							</div>

							{/* Individual pending users */}
							{isLoading ? (
								<div className="space-y-2">
									{[1, 2, 3].map((i) => (
										<div
											key={i}
											className="p-3 bg-gray-50 rounded-lg border border-gray-200 animate-pulse"
										>
											<div className="flex items-center space-x-3">
												<div className="w-8 h-8 bg-gray-200 rounded-full"></div>
												<div className="flex-1 space-y-1">
													<div className="h-3 bg-gray-200 rounded w-24"></div>
													<div className="h-2 bg-gray-200 rounded w-32"></div>
												</div>
											</div>
										</div>
									))}
								</div>
							) : pendingUsers?.data && pendingUsers.data.length > 0 ? (
								<div className="space-y-2">
									{pendingUsers.data.map((user: User) => (
										<div
											key={user.id}
											className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-3">
													<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
														<UserIcon className="h-4 w-4 text-white" />
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium text-gray-900 truncate">
															{user.first_name} {user.last_name}
														</p>
														<div className="flex items-center space-x-2 mt-1">
															{getRoleBadge(user.role)}
															{user.place_of_assignment && (
																<div className="flex items-center space-x-1 text-xs text-gray-500">
																	<MapPin className="h-3 w-3" />
																	<span className="truncate max-w-[120px]">
																		{user.place_of_assignment}
																	</span>
																</div>
															)}
														</div>
													</div>
												</div>
												<Button
													size="sm"
													variant="outline"
													className="text-blue-700 border-blue-300 bg-transparent hover:bg-blue-50"
													asChild
												>
													<Link
														to={`/users?condition=pending&search=${user.first_name} ${user.last_name}`}
													>
														Review
													</Link>
												</Button>
											</div>
										</div>
									))}
									{pendingUsers.data.length < pendingApprovals && (
										<div className="text-center py-2">
											<Button
												size="sm"
												variant="ghost"
												className="text-blue-600 hover:text-blue-700"
												asChild
											>
												<Link to="/users?condition=pending">
													View {pendingApprovals - pendingUsers.data.length}{" "}
													more...
												</Link>
											</Button>
										</div>
									)}
								</div>
							) : null}
						</div>
					) : (
						/* Empty State */
						<div className="flex items-center justify-center p-6 bg-green-50 rounded-lg border border-green-200">
							<div className="text-center">
								<CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
								<p className="text-sm font-medium text-green-800 mb-1">
									All caught up!
								</p>
								<p className="text-xs text-green-600">
									No pending actions at the moment.
								</p>
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
