import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowRight,
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
			return "bg-blue-100 text-blue-700 border-blue-300";
		case "stage 2":
			return "bg-emerald-100 text-emerald-700 border-emerald-300";
		case "stage 3":
			return "bg-amber-100 text-amber-700 border-amber-300";
		case "stage 4":
			return "bg-purple-100 text-purple-700 border-purple-300";
		case "stage 5":
			return "bg-indigo-100 text-indigo-700 border-indigo-300";
		default:
			return "bg-gray-100 text-gray-700 border-gray-300";
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

	// console.log(": sessions", sessions);

	return (
		<div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
			<AnimatePresence mode="popLayout">
				{sessions.map((session) => (
					<motion.div
						key={session.session_id}
						layout
						exit={{
							opacity: 0,
							scale: 0.8,
							y: -20,
							transition: { duration: 0.2 },
						}}
						transition={{
							duration: 0.3,
							ease: "easeOut",
						}}
						whileHover={{ y: -5, scale: 1.02 }}
						className="relative"
					>
						<Card
							className="rounded-2xl shadow-lg border-none bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
							onClick={() =>
								navigate(`/sessions/${session.session_id}`, {
									state: { session },
								})
							}
						>
							<CardHeader className="pb-2 flex flex-col items-start px-6 pt-6">
								<div className="flex items-center justify-between w-full mb-2">
									<CardTitle className="text-xl font-extrabold text-purple-700">
										{session.title}
									</CardTitle>
									<div className="flex items-center gap-2">
										<Badge
											variant={session.end_time ? "secondary" : "default"}
											className={
												session.end_time
													? "bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 text-sm font-semibold border border-emerald-200"
													: "bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold border border-blue-200"
											}
										>
											{session.end_time ? "Completed" : "In Progress"}
										</Badge>
										<Dialog>
											<DialogTrigger asChild>
												<motion.button
													onClick={(e) => e.stopPropagation()}
													title="Delete session"
													className="p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
													type="button"
													whileHover={{ scale: 1.15 }}
													whileTap={{ scale: 0.9 }}
												>
													<Trash2 className="h-5 w-5 text-red-500" />
												</motion.button>
											</DialogTrigger>
											<DialogContent onClick={(e) => e.stopPropagation()}>
												<DialogHeader>
													<DialogTitle className="text-xl font-bold text-gray-800">
														Delete Session
													</DialogTitle>
													<DialogDescription className="text-gray-600">
														Are you sure you want to delete this session? This
														action cannot be undone.
													</DialogDescription>
												</DialogHeader>
												<DialogFooter className="flex justify-end gap-2">
													<DialogClose asChild>
														<Button
															variant={"secondary"}
															className="rounded-full px-4 py-2"
														>
															Cancel
														</Button>
													</DialogClose>
													<Button
														onClick={() => onDeleteSession(session.session_id)}
														variant={"destructive"}
														className="rounded-full px-4 py-2"
													>
														Delete
													</Button>
												</DialogFooter>
											</DialogContent>
										</Dialog>
									</div>
								</div>
								{/* Only show stage if session is not completed */}
								{session.stage && session.status !== "completed" && (
									<div className="flex items-center gap-2 mb-1">
										<Target className="h-4 w-4 text-gray-500" />
										<Badge
											variant="secondary"
											className={`text-sm font-medium rounded-full px-3 py-1 border ${getStageColor(session.stage)}`}
										>
											{session.stage.toUpperCase()}
										</Badge>
									</div>
								)}
							</CardHeader>
							<CardContent className="space-y-4 flex-grow px-6">
								{/* Date and Time */}
								<div className="bg-blue-50 rounded-xl p-3 space-y-2 border border-blue-100">
									<div className="flex items-center gap-2 text-sm text-gray-700">
										<Calendar className="h-4 w-4 text-blue-500" />
										<span className="font-semibold">Start:</span>
										<span>
											{formatDate(session.start_time)} at{" "}
											{formatTime(session.start_time)}
										</span>
									</div>
									{session.end_time ? (
										<div className="flex items-center gap-2 text-sm text-gray-700">
											<Clock className="h-4 w-4 text-blue-500" />
											<span className="font-semibold">End:</span>
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
									<User className="h-5 w-5 text-pink-500" />
									<div>
										<span className="font-bold text-gray-800 text-base">
											{session.child_data.first_name}{" "}
											{session.child_data.last_name}
										</span>
										<span className="text-sm text-gray-500 ml-2">
											({session.child_data.age} years old)
										</span>
									</div>
								</div>
								{/* Tags */}
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Tag className="h-4 w-4 text-emerald-500" />
										<span className="font-semibold text-sm text-gray-700">
											Tags:
										</span>
									</div>
									<div className="flex flex-wrap gap-1">
										{session.tags.map((tag) => (
											<Badge
												key={tag}
												variant="outline"
												className="text-xs bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 font-medium border border-emerald-200"
											>
												{tag.replace(/_/g, " ")}
											</Badge>
										))}
									</div>
								</div>
								{/* Session Notes */}
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<FileText className="h-4 w-4 text-amber-500" />
										<span className="font-semibold text-sm text-gray-700">
											Session Notes:
										</span>
									</div>
									<p className="text-sm text-gray-700 leading-relaxed bg-amber-50 p-4 rounded-xl border-l-4 border-amber-200">
										{session.session_notes}
									</p>
								</div>
							</CardContent>
							<div className="flex items-center gap-2 pt-4 border-t border-gray-100 px-6 pb-6">
								<UserCheck className="h-5 w-5 text-violet-500" />
								<span className="text-sm text-gray-700">
									<span className="font-semibold">Conducted by:</span>
									<span className="ml-1 text-gray-800 capitalize font-medium">
										{user.first_name} {user.last_name}
									</span>
								</span>
								{/* Continue button for in-progress sessions */}
								{!session.end_time && (
									<Button
										size="sm"
										className="ml-auto rounded-full bg-purple-500 text-white hover:bg-purple-600 shadow-md hover:shadow-lg transition-all duration-200 px-4 py-2 flex items-center gap-1"
										onClick={(e) => {
											e.stopPropagation();
											navigate(`/room/${session.session_id}`);
										}}
									>
										Continue <ArrowRight className="h-4 w-4" />
									</Button>
								)}
							</div>
						</Card>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}
