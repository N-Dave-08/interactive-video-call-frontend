import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ChildAvatar from "@/components/ChildAvatar";
import type { Session } from "@/types";

interface ActiveSessionsListProps {
	sessions: Session[];
	navigate: (path: string, options?: Record<string, unknown>) => void;
	getDisplayName: (first?: string, last?: string) => string;
	formatTime: (dateString: string) => string;
	getStatusColor: (status: string) => string;
}

const ActiveSessionsList: React.FC<ActiveSessionsListProps> = ({
	sessions,
	navigate,
	getDisplayName,
	formatTime,
	getStatusColor,
}) => {
	const activeSessions = sessions.filter(
		(session) => session.status === "in_progress",
	);

	return (
		<Card className="shadow-xl rounded-2xl border-0 bg-gradient-to-br from-slate-50 to-white overflow-hidden py-0 gap-0">
			<CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-6">
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-2xl font-bold text-white">
							Active Sessions
						</CardTitle>
						<CardDescription className="text-slate-300 mt-1">
							Currently in progress • {activeSessions.length} active
						</CardDescription>
					</div>
					<div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center">
						<div className="h-3 w-3 bg-emerald-400 rounded-full animate-pulse" />
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<div className="divide-y divide-slate-100">
					{activeSessions.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-16 px-6 text-center">
							<div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
								<div className="h-8 w-8 bg-slate-400 rounded-full" />
							</div>
							<h3 className="text-lg font-semibold text-slate-900 mb-2">
								No Active Sessions
							</h3>
							<p className="text-slate-500 max-w-sm">
								There are currently no sessions in progress. Check your schedule
								for upcoming sessions.
							</p>
						</div>
					) : (
						activeSessions.map((session) => (
							<button
								key={session.session_id}
								type="button"
								className="w-full text-left p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer bg-transparent border-0 group"
								onClick={() =>
									navigate(`/sessions/${session.session_id}`, {
										state: { session },
									})
								}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<div className="relative">
											<ChildAvatar
												size={90}
												avatar_data={{
													...session.avatar_data,
													first_name: session.child_data.first_name,
													last_name: session.child_data.last_name,
												}}
												className="h-16 w-16 ring-4 ring-slate-100 group-hover:ring-blue-200 transition-all duration-200"
											/>
											<div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
												<div className="h-2 w-2 bg-white rounded-full animate-pulse" />
											</div>
										</div>
										<div>
											<h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors duration-200">
												{getDisplayName(
													session.child_data.first_name,
													session.child_data.last_name,
												)}
											</h4>
											<p className="text-slate-600 font-medium mb-2">
												{session.title}
											</p>
											<div className="flex items-center space-x-4 text-sm text-slate-500">
												<span className="flex items-center gap-1">
													<span className="h-2 w-2 bg-slate-300 rounded-full" />
													Age: {session.child_data.age}
												</span>
												<span className="flex items-center gap-1">
													<span className="h-2 w-2 bg-slate-300 rounded-full" />
													{session.child_data.gender || "N/A"}
												</span>
												<span className="flex items-center gap-1">
													<span className="h-2 w-2 bg-slate-300 rounded-full" />
													{session.stage}
												</span>
												<span className="flex items-center gap-1">
													<span className="h-2 w-2 bg-slate-300 rounded-full" />
													{formatTime(session.start_time)}
												</span>
											</div>
										</div>
									</div>
									<div className="flex items-center space-x-3">
										<div className="flex flex-wrap gap-2 max-w-32">
											{session.tags.slice(0, 2).map((tag: string) => (
												<Badge
													key={tag}
													variant="secondary"
													className="bg-slate-100 text-slate-700 text-xs px-2 py-1"
												>
													{tag}
												</Badge>
											))}
											{session.tags.length > 2 && (
												<Badge
													variant="secondary"
													className="bg-slate-100 text-slate-700 text-xs px-2 py-1"
												>
													+{session.tags.length - 2}
												</Badge>
											)}
										</div>
										<Badge
											className={`${getStatusColor(session.status)} font-semibold`}
											variant="outline"
										>
											{session.status.replace("_", " ")}
										</Badge>
									</div>
								</div>
							</button>
						))
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default ActiveSessionsList;
