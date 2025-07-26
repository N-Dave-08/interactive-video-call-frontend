import { Clock, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PendingActionsProps {
	data?: { needForApprovalCount?: number };
}

export default function PendingActions({ data }: PendingActionsProps) {
	return (
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
	);
} 