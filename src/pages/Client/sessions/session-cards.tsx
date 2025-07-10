import { Calendar, Clock, FileText, Tag, User, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Session } from "@/types/sessions";

interface SessionCardsProps {
	sessions: Session[];
	user: { first_name: string; last_name: string };
}

export default function SessionCards({ sessions, user }: SessionCardsProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const formatTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	return (
		<div className="max-w-7xl mx-auto">
			<h1 className="text-3xl font-bold text-gray-900">Session Records</h1>
			<p className="text-gray-600">Track and review therapy session progress</p>

			<div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
				{sessions.map((session) => (
					<Card
						key={session.session_id}
						className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm"
					>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="text-lg font-semibold text-gray-900">
									Session Title
								</CardTitle>
								<Badge
									variant={session.end_time ? "secondary" : "default"}
									className={
										session.end_time
											? "bg-green-100 text-green-800"
											: "bg-blue-100 text-blue-800"
									}
								>
									{session.end_time ? "Completed" : "In Progress"}
								</Badge>
							</div>
						</CardHeader>

						<CardContent className="space-y-4">
							{/* Date and Time */}
							<div className="bg-gray-50 rounded-lg p-3 space-y-2">
								<div className="flex items-center gap-2 text-sm">
									<Calendar className="h-4 w-4 text-gray-500" />
									<span className="font-medium">Start:</span>
									<span>
										{formatDate(session.start_time)} at{" "}
										{formatTime(session.start_time)}
									</span>
								</div>
								{session.end_time ? (
									<div className="flex items-center gap-2 text-sm">
										<Clock className="h-4 w-4 text-gray-500" />
										<span className="font-medium">End:</span>
										<span>
											{formatDate(session.end_time)} at{" "}
											{formatTime(session.end_time)}
										</span>
									</div>
								) : (
									<div className="flex items-center gap-2 text-sm text-gray-400 italic">
										<Clock className="h-4 w-4 text-gray-300" />
										<span>No end time recorded yet</span>
									</div>
								)}
							</div>

							{/* Child Information */}
							<div className="flex items-center gap-2">
								<User className="h-4 w-4 text-blue-600" />
								<div>
									<span className="font-medium text-gray-900">Bata Reyes</span>
									<span className="text-sm text-gray-500 ml-2">
										(12 years old)
									</span>
								</div>
							</div>

							{/* Tags */}
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Tag className="h-4 w-4 text-gray-500" />
									<span className="font-medium text-sm">Tags:</span>
								</div>
								<div className="flex flex-wrap gap-1">
									{session.tags.map((tag) => (
										<Badge
											key={tag}
											variant="outline"
											className="text-xs bg-blue-50 text-blue-700 border-blue-200"
										>
											{tag.replace(/_/g, " ")}
										</Badge>
									))}
								</div>
							</div>

							{/* Session Notes */}
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<FileText className="h-4 w-4 text-gray-500" />
									<span className="font-medium text-sm">Session Notes:</span>
								</div>
								<p className="text-sm text-gray-700 leading-relaxed bg-white p-3 rounded border-l-4 border-blue-200">
									{session.session_notes}
								</p>
							</div>

							{/* Interviewer */}
							<div className="flex items-center gap-2 pt-2 border-t border-gray-100">
								<UserCheck className="h-4 w-4 text-green-600" />
								<span className="text-sm">
									<span className="font-medium">Conducted by:</span>
									<span className="ml-1 text-gray-700 capitalize">
										{user.first_name} {user.last_name}
									</span>
								</span>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
