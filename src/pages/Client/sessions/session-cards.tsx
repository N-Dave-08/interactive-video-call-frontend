import {
	Calendar,
	Clock,
	FileText,
	Tag,
	Target,
	Trash2,
	User,
	UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteSession } from "@/api/sessions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { Session } from "@/types/sessions";

interface SessionCardsProps {
	sessions: Session[];
	user: { first_name: string; last_name: string };
	onSessionDeleted?: (sessionId: string) => void;
}

// Helper to get color class for stage
function getStageColor(stage: string) {
	switch (stage.toLowerCase()) {
		case "stage 1":
			return "bg-blue-100 text-blue-800 border-blue-200";
		case "stage 2":
			return "bg-green-100 text-green-800 border-green-200";
		case "stage 3":
			return "bg-yellow-100 text-yellow-800 border-yellow-200";
		case "stage 4":
			return "bg-purple-100 text-purple-800 border-purple-200";
		default:
			return "bg-gray-100 text-gray-800 border-gray-200";
	}
}

export default function SessionCards({
	sessions,
	user,
	onSessionDeleted,
}: SessionCardsProps) {
	const navigate = useNavigate();
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

	const onDeleteSession = async (session_id: string) => {
		try {
			await deleteSession(session_id);
			onSessionDeleted?.(session_id);
		} catch (_) {
			alert("Failed to delete session. Please try again.");
		}
	};

	return (
		<div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
			{sessions.map((session) => (
				<Card
					key={session.session_id}
					className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm cursor-pointer"
					onClick={() =>
						navigate(`/sessions/${session.session_id}`, { state: { session } })
					}
				>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-lg font-semibold text-gray-900">
									{session.title}
								</CardTitle>
								{session.stage && (
									<div className="flex items-center gap-2 mb-1">
										<Target className="h-4 w-4 text-gray-500" />
										<Badge
											variant="secondary"
											className={`text-sm font-medium ${getStageColor(session.stage)}`}
										>
											{session.stage.toUpperCase()}
										</Badge>
									</div>
								)}
							</div>
							<div className="flex items-center gap-2">
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
								{/* Delete button with confirmation dialog */}
								<Dialog>
									<DialogTrigger asChild>
										<button
											onClick={(e) => e.stopPropagation()}
											title="Delete session"
											className="p-1 rounded hover:bg-red-100"
											type="button"
										>
											<Trash2 className="h-4 w-4 text-red-500" />
										</button>
									</DialogTrigger>
									<DialogContent onClick={(e) => e.stopPropagation()}>
										<DialogHeader>
											<DialogTitle>Delete Session</DialogTitle>
											<DialogDescription>
												Are you sure you want to delete this session? This
												action cannot be undone.
											</DialogDescription>
										</DialogHeader>
										<DialogFooter>
											<DialogClose asChild>
												<Button variant={"secondary"}>Cancel</Button>
											</DialogClose>
											<Button
												onClick={() => onDeleteSession(session.session_id)}
												variant={"destructive"}
											>
												Delete
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</div>
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
								<span className="font-medium text-gray-900">
									{session.child_data.first_name} {session.child_data.last_name}
								</span>
								<span className="text-sm text-gray-500 ml-2">
									({session.child_data.age} years old)
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
	);
}
