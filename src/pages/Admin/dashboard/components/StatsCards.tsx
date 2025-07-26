import { Users, UserCheck, Settings, CheckCircle, Clock, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
	data: any;
	isLoadingSessions: boolean;
	averageSessionDuration: number;
	upcomingSessionsCount: number;
}

export default function StatsCards({ 
	data, 
	isLoadingSessions, 
	averageSessionDuration, 
	upcomingSessionsCount 
}: StatsCardsProps) {
	// Stats Cards
	const statsCards = [
		{
			title: "Total Users",
			value: data?.totalUsers ?? 0,
			icon: <Users className="h-4 w-4 text-muted-foreground" />, 
			valueClass: "text-2xl font-bold",
		},
		{
			title: "Social Workers",
			value: data?.socialWorkerCount ?? 0,
			icon: <UserCheck className="h-4 w-4 text-blue-600" />, 
			valueClass: "text-2xl font-bold text-blue-600",
		},
		{
			title: "Admins",
			value: data?.adminCount ?? 0,
			icon: <Settings className="h-4 w-4 text-purple-600" />, 
			valueClass: "text-2xl font-bold text-purple-600",
		},
		{
			title: "Approved Users",
			value: data?.approvedCount ?? 0,
			icon: <CheckCircle className="h-4 w-4 text-green-600" />, 
			valueClass: "text-2xl font-bold text-green-600",
		},
	];

	// Add session stats cards
	const sessionStatsCards = [
		{
			title: "Avg. Session Duration",
			value: isLoadingSessions ? "..." : `${averageSessionDuration} min` ,
			icon: <Clock className="h-4 w-4 text-yellow-600" />, 
			valueClass: "text-2xl font-bold text-yellow-600",
		},
		{
			title: "Upcoming Sessions",
			value: isLoadingSessions ? "..." : upcomingSessionsCount,
			icon: <Bell className="h-4 w-4 text-blue-600" />, 
			valueClass: "text-2xl font-bold text-blue-600",
		},
	];

	// Merge user and session stats cards
	const allStatsCards = [...statsCards, ...sessionStatsCards];

	return (
		<div className="grid w-full gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-6 mb-8">
			{allStatsCards.map((card) => (
				<Card key={card.title}>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{card.title}</CardTitle>
						{card.icon}
					</CardHeader>
					<CardContent>
						<div className={card.valueClass}>{card.value}</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
} 