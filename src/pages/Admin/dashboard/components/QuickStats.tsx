import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickStatsProps {
	data: any;
}

export default function QuickStats({ data }: QuickStatsProps) {
	return (
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
	);
} 