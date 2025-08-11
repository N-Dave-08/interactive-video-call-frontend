import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, Clock } from "lucide-react";
import ChildAvatar from "@/components/ChildAvatar";
import React from "react";

interface UpcomingSessionsListProps {
	sessions: any[];
	navigate: (path: string, options?: any) => void;
	getDisplayName: (first?: string, last?: string) => string;
	formatDate: (dateString: string) => string;
	formatTime: (dateString: string) => string;
}

const UpcomingSessionsList: React.FC<UpcomingSessionsListProps> = ({
	sessions,
	navigate,
	getDisplayName,
	formatDate,
	formatTime,
}) => (
	<Card className="shadow-xl rounded-2xl border-0 bg-gradient-to-br from-slate-50 to-white overflow-hidden h-full py-0">
		<CardHeader className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-6">
			<div className="flex items-center justify-between">
				<div>
					<CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
						<Calendar className="h-6 w-6" />
						Upcoming Sessions
					</CardTitle>
					<CardDescription className="text-indigo-200 mt-1">
						Next appointments • {sessions.length} scheduled
					</CardDescription>
				</div>
				<Button
					variant="ghost"
					className="text-white hover:text-white hover:bg-white/10 border border-white/20"
					onClick={() => navigate("/sessions")}
				>
					View all
					<ChevronRight className="h-4 w-4 ml-1" />
				</Button>
			</div>
		</CardHeader>
		<CardContent className="p-0">
			<div className="divide-y divide-slate-100">
				{sessions.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 px-6 text-center">
						<div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
							<Calendar className="h-8 w-8 text-slate-400" />
						</div>
						<h3 className="text-lg font-semibold text-slate-900 mb-2">
							No Upcoming Sessions
						</h3>
						<p className="text-slate-500 max-w-sm">
							You don't have any upcoming sessions scheduled. Create a new
							session to get started.
						</p>
					</div>
				) : (
					sessions.slice(0, 4).map((session, index) => (
						<button
							key={session.session_id}
							type="button"
							className="w-full text-left p-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 cursor-pointer bg-transparent border-0 group"
							onClick={() =>
								navigate(`/sessions/${session.session_id}`, {
									state: { session },
								})
							}
						>
							<div className="flex items-center space-x-3">
								<div className="relative">
									<ChildAvatar
										size={56}
										avatar_data={{
											...session.avatar_data,
											first_name: session.child_data.first_name,
											last_name: session.child_data.last_name,
										}}
										className="h-12 w-12 ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all duration-200"
									/>
									{index === 0 && (
										<div className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 rounded-full border border-white flex items-center justify-center">
											<span className="text-xs text-white font-bold">1</span>
										</div>
									)}
								</div>
								<div className="flex-1 min-w-0">
									<p className="font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors duration-200">
										{getDisplayName(
											session.child_data.first_name,
											session.child_data.last_name,
										)}
									</p>
									<div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
										<span className="flex items-center gap-1">
											<Calendar className="h-3 w-3" />
											{formatDate(session.start_time)}
										</span>
										<span className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											{formatTime(session.start_time)}
										</span>
									</div>
								</div>
								<ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors duration-200" />
							</div>
						</button>
					))
				)}
			</div>
		</CardContent>
	</Card>
);

export default UpcomingSessionsList;
