import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowRight,
	Calendar as CalendarIcon,
	Clock,
	FileText,
	Tag,
	Target,
	Trash2,
	User,
	UserCheck,
	Ban,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { deleteSession, updateSession } from "@/api/sessions";
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
import type { Session } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SessionCardsProps {
	sessions: Session[];
	user: { first_name: string; last_name: string };
	onSessionDeleted?: (sessionId: string) => void;
    onSessionUpdated?: () => void;
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

// Helper to get badge style and label for status
function getStatusBadgeStyle(status: string) {
	switch (status) {
		case "scheduled":
			return {
				label: "Scheduled",
				className:
					"bg-yellow-100 text-yellow-800 border-yellow-200 ring-2 ring-yellow-200",
			};
		case "in_progress":
			return {
				label: "In Progress",
				className:
					"bg-blue-100 text-blue-800 border-blue-200 ring-2 ring-blue-200",
			};
		case "rescheduled":
			return {
				label: "Rescheduled",
				className:
					"bg-purple-100 text-purple-800 border-purple-200 ring-2 ring-purple-200",
			};
		case "completed":
			return {
				label: "Completed",
				className:
					"bg-emerald-100 text-emerald-800 border-emerald-200 ring-2 ring-emerald-200",
			};
		case "cancelled":
			return {
				label: "Cancelled",
				className:
					"bg-red-100 text-red-800 border-red-200 ring-2 ring-red-200",
			};
		default:
			return {
				label: status,
				className: "bg-gray-100 text-gray-700 border-gray-200",
			};
	}
}

export default function SessionCards({
	sessions,
	user,
	onSessionDeleted,
    onSessionUpdated,
}: SessionCardsProps) {
	const navigate = useNavigate();
	const [now, setNow] = useState(new Date());
	useEffect(() => {
		const interval = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(interval);
	}, []);
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

	const [rescheduleOpen, setRescheduleOpen] = useState<string | null>(null);
	const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
	const [rescheduleTime, setRescheduleTime] = useState<string>("");
	const [rescheduleLoading, setRescheduleLoading] = useState(false);
	const [rescheduleError, setRescheduleError] = useState<string | null>(null);

	// Add state for cancel dialog
	const [cancelOpen, setCancelOpen] = useState<string | null>(null);
	const [cancelLoading, setCancelLoading] = useState(false);
	const [cancelError, setCancelError] = useState<string | null>(null);

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
											className={getStatusBadgeStyle(session.status).className + " rounded-full px-3 py-1 text-sm font-semibold border capitalize"}
										>
											{getStatusBadgeStyle(session.status).label}
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
										{/* Cancel button: only show if not completed or cancelled */}
										{session.status !== "completed" && session.status !== "cancelled" && (
											<Dialog open={cancelOpen === session.session_id} onOpenChange={open => { if (!open) setCancelOpen(null); }}>
												<DialogTrigger asChild>
													<motion.button
														onClick={e => { e.stopPropagation(); setCancelOpen(session.session_id); setCancelError(null); }}
														title="Cancel session"
														className="p-2 rounded-full hover:bg-orange-100 transition-colors duration-200"
														type="button"
														whileHover={{ scale: 1.15 }}
														whileTap={{ scale: 0.9 }}
													>
														<Ban className="h-5 w-5 text-orange-500" />
													</motion.button>
												</DialogTrigger>
												<DialogContent onClick={e => e.stopPropagation()}>
													<DialogHeader>
														<DialogTitle className="text-xl font-bold text-gray-800">
															Cancel Session
														</DialogTitle>
														<DialogDescription className="text-gray-600">
															Are you sure you want to cancel this session? This action cannot be undone.
														</DialogDescription>
													</DialogHeader>
													{cancelError && <div className="text-red-500 text-sm text-center mb-2">{cancelError}</div>}
													<DialogFooter className="flex justify-end gap-2">
														<Button type="button" variant="outline" onClick={() => setCancelOpen(null)}>
															Back
														</Button>
														<Button
															disabled={cancelLoading}
															variant="destructive"
															onClick={async () => {
																setCancelLoading(true);
																setCancelError(null);
																try {
																	await updateSession(session.session_id, { status: "cancelled" });
																	setCancelOpen(null);
																	onSessionUpdated?.();
																} catch {
																	setCancelError("Failed to cancel session. Please try again.");
																}
																setCancelLoading(false);
															}}
														>
															{cancelLoading ? "Cancelling..." : "Confirm Cancel"}
														</Button>
													</DialogFooter>
												</DialogContent>
											</Dialog>
										)}
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
										<CalendarIcon className="h-4 w-4 text-blue-500" />
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
											{(session.child_data.first_name || session.child_data.last_name)
												? `${session.child_data.first_name} ${session.child_data.last_name}`.trim()
												: <span className="italic text-gray-400">No name</span>}
										</span>
										<span className="text-sm text-gray-500 ml-2">
											{session.child_data.age
												? `(${session.child_data.age} years old)`
												: <span className="italic text-gray-400">(Age not set)</span>}
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
										{session.tags.length > 0 ? (
											session.tags.map((tag) => (
												<Badge
													key={tag}
													variant="outline"
													className="text-xs bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 font-medium border border-emerald-200"
												>
													{tag.replace(/_/g, " ")}
												</Badge>
											))
										) : (
											<span className="italic text-gray-400">No tags</span>
										)}
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
										{session.session_notes
											? session.session_notes
											: <span className="italic text-gray-400">No notes</span>}
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
								{/* Start button for scheduled sessions when time is reached */}
								{session.status === "scheduled" && (() => {
									const start = new Date(session.start_time);
									const canStart = start <= now && !session.end_time;
									if (!canStart) return null;
									return (
										<Button
											size="sm"
											className="ml-auto rounded-full bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg transition-all duration-200 px-4 py-2 flex items-center gap-1"
											onClick={async (e) => {
												e.stopPropagation();
												try {
													await updateSession(session.session_id, { status: "in_progress" });
													navigate(`/room/${session.session_id}`);
												} catch {
													alert("Failed to start session. Please try again.");
												}
											}}
										>
											Start <ArrowRight className="h-4 w-4" />
										</Button>
									);
								})()}
								{/* Reschedule button for scheduled or rescheduled sessions */}
								{(session.status === "scheduled" || session.status === "rescheduled") && (
									<>
										<Button
											size="sm"
											variant="outline"
											className="rounded-full border-blue-400 text-blue-700 hover:bg-blue-50 ml-2"
											onClick={e => {
												e.stopPropagation();
												setRescheduleOpen(session.session_id);
												const start = new Date(session.start_time);
												setRescheduleDate(Number.isNaN(start.getTime()) ? undefined : start);
												const pad = (n: number) => n.toString().padStart(2, "0");
												setRescheduleTime(Number.isNaN(start.getTime()) ? "" : `${pad(start.getHours())}:${pad(start.getMinutes())}`);
												setRescheduleError(null);
											}}
										>
											Reschedule
										</Button>
										<Dialog open={rescheduleOpen === session.session_id} onOpenChange={open => { if (!open) setRescheduleOpen(null); }}>
											<DialogContent onClick={e => e.stopPropagation()}>
												<DialogHeader>
													<DialogTitle>Reschedule Session</DialogTitle>
													<DialogDescription>Pick a new date and time for this session.</DialogDescription>
												</DialogHeader>
												<form
													onSubmit={async e => {
														e.preventDefault();
														if (!rescheduleDate || !rescheduleTime) {
															setRescheduleError("Please select both date and time.");
															return;
														}
														setRescheduleLoading(true);
														setRescheduleError(null);
														try {
															const [hours, minutes] = rescheduleTime.split(":");
															if (!rescheduleDate) return;
															const dt = new Date(rescheduleDate);
															dt.setHours(Number(hours));
															dt.setMinutes(Number(minutes));
															dt.setSeconds(0);
															await updateSession(session.session_id, { start_time: dt.toISOString(), status: "rescheduled" });
															setRescheduleOpen(null);
											onSessionUpdated?.();
														} catch  {
															setRescheduleError("Failed to reschedule session. Please try again.");
														}
														setRescheduleLoading(false);
													}}
												>
													<div className="grid gap-4 py-2">
														<div className="grid grid-cols-4 items-center gap-4">
															<Label htmlFor="reschedule-date" className="text-right">Date</Label>
															<Popover>
																<PopoverTrigger asChild>
																	<Button
																		variant="outline"
																		className={cn("col-span-3 justify-start text-left font-normal", !rescheduleDate && "text-muted-foreground")}
																	>
																		<CalendarIcon className="mr-2 h-4 w-4" />
																		{rescheduleDate ? format(rescheduleDate, "PPP") : <span>Pick a date</span>}
																	</Button>
																</PopoverTrigger>
																<PopoverContent className="w-auto p-0">
																	<Calendar mode="single" selected={rescheduleDate} onSelect={date => setRescheduleDate(date ?? undefined)} initialFocus />
																</PopoverContent>
															</Popover>
														</div>
														<div className="grid grid-cols-4 items-center gap-4">
															<Label htmlFor="reschedule-time" className="text-right">Time</Label>
															<Input
																id="reschedule-time"
																type="time"
																placeholder="Time"
																value={rescheduleTime}
																onChange={e => setRescheduleTime(e.target.value)}
																className="col-span-3"
															/>
														</div>
														{rescheduleError && <div className="text-red-500 text-sm text-center">{rescheduleError}</div>}
													</div>
													<DialogFooter>
														<Button type="button" variant="outline" onClick={() => setRescheduleOpen(null)}>
															Cancel
														</Button>
														<Button type="submit" disabled={rescheduleLoading}>
															{rescheduleLoading ? "Rescheduling..." : "Reschedule"}
														</Button>
													</DialogFooter>
												</form>
											</DialogContent>
										</Dialog>
									</>
								)}
								{/* Continue button for in-progress sessions */}
								{session.status === "in_progress" && !session.end_time && (
									(() => {
										const start = new Date(session.start_time);
										const notStartedYet = start > now;
										return (
											<div className="ml-auto flex flex-col items-end">
												<Button
													size="sm"
													className="rounded-full bg-purple-500 text-white hover:bg-purple-600 shadow-md hover:shadow-lg transition-all duration-200 px-4 py-2 flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
													onClick={(e) => {
														e.stopPropagation();
														navigate(`/room/${session.session_id}`);
													}}
													disabled={notStartedYet}
													title={notStartedYet ? `Available at ${formatDate(session.start_time)} ${formatTime(session.start_time)}` : undefined}
												>
													Continue <ArrowRight className="h-4 w-4" />
												</Button>
												{notStartedYet && (
													<span className="text-xs text-gray-500 mt-1">Available at {formatDate(session.start_time)} {formatTime(session.start_time)}</span>
												)}
											</div>
										);
									})()
								)}
							</div>
						</Card>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}
