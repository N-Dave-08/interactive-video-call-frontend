import { Activity, Bell, CheckCircle, Settings, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Activity as ActivityType } from "@/types";

interface RecentActivityProps {
	activities: ActivityType[] | undefined;
	isLoadingActivities: boolean;
	activitiesError: any;
}

export default function RecentActivity({ 
	activities, 
	isLoadingActivities, 
	activitiesError 
}: RecentActivityProps) {
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

	return (
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
	);
} 