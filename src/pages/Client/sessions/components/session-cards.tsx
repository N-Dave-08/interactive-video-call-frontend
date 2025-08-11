import { AnimatePresence, motion } from "framer-motion";
import {
	Calendar as CalendarIcon,
	Clock,
	FileText,
	Tag,
	Target,
	User,
	UserCheck,
	CheckCircle,
	XCircle,
	PlayCircle,
	Calendar,
	AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { deleteSession, updateSession } from "@/api/sessions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Session } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { Suspense, lazy } from "react";

const ActionMenu = lazy(() => import("./action-menu"));

interface SessionCardsProps {
	sessions: Session[];
	user: { first_name: string; last_name: string };
	onSessionDeleted?: (sessionId: string) => void;
	onSessionUpdated?: () => void;
}

// Helper to get color class for stage
function getStageColor(stage: string) {
	switch (stage.toLowerCase()) {
		case "welcome":
			return "bg-orange-100 text-orange-700 border-orange-300";
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
		case "stage 6":
			return "bg-pink-100 text-pink-700 border-pink-300";
		case "completion":
			return "bg-emerald-100 text-emerald-700 border-emerald-300";
		default:
			return "bg-gray-100 text-gray-700 border-gray-300";
	}
}

// Helper to calculate session progress
function calculateSessionProgress(session: Session): {
	percentage: number;
	stage: number;
	totalStages: number;
} {
	const stageMap: Record<string, number> = {
		welcome: 0,
		"stage 1": 1,
		"stage 2": 2,
		"stage 3": 3,
		"stage 4": 4,
		"stage 5": 5,
		"stage 6": 6,
		completion: 7,
	};

	const currentStage = stageMap[session.stage?.toLowerCase() || "welcome"] || 0;
	const totalStages = 7;
	const percentage = (currentStage / totalStages) * 100;

	return { percentage, stage: currentStage, totalStages };
}

// Helper to get status-specific styling and icon
function getStatusStyle(status: string) {
	switch (status) {
		case "scheduled":
			return {
				label: "Scheduled",
				icon: Calendar,
				badgeClass:
					"bg-yellow-100 text-yellow-800 border-yellow-200 ring-2 ring-yellow-200",
				cardClass: "border-l-4 border-l-yellow-400 bg-white",
				titleClass: "text-yellow-800",
				iconClass: "text-yellow-600",
				blurColor: "bg-yellow-400",
				statusColor: "text-yellow-600",
				statusBg: "bg-yellow-50",
				statusBorder: "border-yellow-200",
			};
		case "in_progress":
			return {
				label: "In Progress",
				icon: PlayCircle,
				badgeClass:
					"bg-blue-100 text-blue-800 border-blue-200 ring-2 ring-blue-200",
				cardClass: "border-l-4 border-l-blue-400 bg-white",
				titleClass: "text-blue-800",
				iconClass: "text-blue-600",
				blurColor: "bg-blue-400",
				statusColor: "text-blue-600",
				statusBg: "bg-blue-50",
				statusBorder: "border-blue-200",
			};
		case "rescheduled":
			return {
				label: "Rescheduled",
				icon: AlertCircle,
				badgeClass:
					"bg-purple-100 text-purple-800 border-purple-200 ring-2 ring-purple-200",
				cardClass: "border-l-4 border-l-purple-400 bg-white",
				titleClass: "text-purple-800",
				iconClass: "text-purple-600",
				blurColor: "bg-purple-400",
				statusColor: "text-purple-600",
				statusBg: "bg-purple-50",
				statusBorder: "border-purple-200",
			};
		case "completed":
			return {
				label: "Completed",
				icon: CheckCircle,
				badgeClass:
					"bg-emerald-100 text-emerald-800 border-emerald-200 ring-2 ring-emerald-200",
				cardClass: "border-l-4 border-l-emerald-400 bg-white",
				titleClass: "text-emerald-800",
				iconClass: "text-emerald-600",
				blurColor: "bg-emerald-400",
				statusColor: "text-emerald-600",
				statusBg: "bg-emerald-50",
				statusBorder: "border-emerald-200",
			};
		case "cancelled":
			return {
				label: "Cancelled",
				icon: XCircle,
				badgeClass:
					"bg-red-100 text-red-800 border-red-200 ring-2 ring-red-200",
				cardClass: "border-l-4 border-l-red-400 bg-white opacity-75",
				titleClass: "text-red-800",
				iconClass: "text-red-600",
				blurColor: "bg-red-400",
				statusColor: "text-red-600",
				statusBg: "bg-red-50",
				statusBorder: "border-red-200",
			};
		default:
			return {
				label: status,
				icon: Calendar,
				badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
				cardClass: "border-l-4 border-l-gray-400 bg-white",
				titleClass: "text-gray-800",
				iconClass: "text-gray-600",
				blurColor: "bg-gray-400",
				statusColor: "text-gray-600",
				statusBg: "bg-gray-50",
				statusBorder: "border-gray-200",
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
	const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
		{},
	);

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

	const { token } = useAuth();

	const setLoading = (sessionId: string, loading: boolean) => {
		setLoadingStates((prev) => ({ ...prev, [sessionId]: loading }));
	};

	const onDeleteSession = async (session_id: string) => {
		if (!token) return alert("No token");
		setLoading(session_id, true);
		try {
			await deleteSession(session_id, token);
			onSessionDeleted?.(session_id);
		} catch (_) {
			alert("Failed to delete session. Please try again.");
		} finally {
			setLoading(session_id, false);
		}
	};

	// console.log(": sessions", sessions);

	return (
		<div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
			<AnimatePresence mode="popLayout">
				{sessions.map((session) => {
					const statusStyle = getStatusStyle(session.status);
					const StatusIcon = statusStyle.icon;
					const isLoading = loadingStates[session.session_id] || false;

					return (
						<motion.div
							key={session.session_id}
							layout
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
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
							whileHover={{
								y: -5,
								scale: 1.02,
								transition: { duration: 0.2 },
							}}
							className="relative"
						>
							<Card
								className={`py-0 relative rounded-2xl shadow-lg border-none ${statusStyle.cardClass} hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col relative overflow-hidden ${
									isLoading ? "pointer-events-none" : ""
								}`}
								onClick={() =>
									!isLoading &&
									navigate(`/sessions/${session.session_id}`, {
										state: { session },
									})
								}
							>
								{/* Loading Overlay */}
								{isLoading && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl"
									>
										<div className="flex flex-col items-center gap-2">
											<div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
											<span className="text-sm text-gray-600 font-medium">
												Processing...
											</span>
										</div>
									</motion.div>
								)}

								{/* Enhanced Status Header */}
								<div
									className={`${statusStyle.statusBg} ${statusStyle.statusBorder} border-b px-6 py-3 relative overflow-hidden`}
								>
									{/* Status Background Pattern */}
									<div
										className={`absolute inset-0 opacity-5 ${statusStyle.statusColor.replace("text-", "bg-")}`}
									>
										<div
											className="absolute inset-0"
											style={{
												backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23currentColor' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
												backgroundSize: "20px 20px",
											}}
										/>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div
												className={`p-2 rounded-full ${statusStyle.statusBg} border ${statusStyle.statusBorder}`}
											>
												<StatusIcon
													className={`h-5 w-5 ${statusStyle.statusColor}`}
												/>
											</div>
											<div>
												<h2
													className={`text-lg font-bold ${statusStyle.statusColor}`}
												>
													{statusStyle.label}
												</h2>
												<p className="text-sm text-gray-600">
													{(() => {
														if (session.stage === "welcome") {
															if (session.status === "scheduled") {
																return "Session is scheduled and ready to start";
															} else if (session.status === "in_progress") {
																return "Session is ready to begin";
															}
															return "Click to start your session";
														}
														switch (session.status) {
															case "scheduled":
																return "Session is scheduled and ready";
															case "in_progress":
																return "Session is currently active";
															case "rescheduled":
																return "Session has been rescheduled";
															case "completed":
																return "Session has been completed";
															case "cancelled":
																return "Session has been cancelled";
															default:
																return "Session status unknown";
														}
													})()}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											{/* Status indicators or additional info can go here */}
										</div>
									</div>
								</div>

								<CardHeader className="pb-2 flex flex-col items-start px-6 pt-6">
									<div className="flex items-center justify-between w-full mb-2">
										<CardTitle
											className={`text-xl font-extrabold ${statusStyle.titleClass}`}
										>
											{session.title}
										</CardTitle>
									</div>
									{/* Session Progress - Show for in-progress sessions */}
									{session.status === "in_progress" && session.stage && (
										<div className="space-y-2 mb-3 w-full">
											<div className="flex items-center justify-between text-xs text-gray-600">
												<span className="font-medium">Session Progress</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<motion.div
													className={`h-2 rounded-full ${statusStyle.iconClass.replace("text-", "bg-").replace("-600", "-500")}`}
													initial={{ width: 0 }}
													animate={{
														width: `${calculateSessionProgress(session).percentage}%`,
													}}
													transition={{ duration: 0.8, ease: "easeOut" }}
												/>
											</div>
											<div className="flex items-center gap-2">
												<Target className="h-3 w-3 text-gray-500" />
												<Badge
													variant="secondary"
													className={`text-xs font-medium rounded-full px-2 py-0.5 border ${getStageColor(session.stage)}`}
												>
													{session.stage.toUpperCase()}
												</Badge>
											</div>
										</div>
									)}

									{/* Only show stage badge for non-completed sessions without progress bar */}
									{session.stage &&
										session.status !== "completed" &&
										session.status !== "in_progress" &&
										session.stage !== "welcome" && (
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

									{/* Show welcome message for sessions in welcome stage */}
									{session.stage === "welcome" &&
										session.status !== "in_progress" && (
											<div className="space-y-2 mb-3 w-full">
												<div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
													<div className="flex items-center gap-3">
														<div className="p-2 bg-orange-100 rounded-full">
															<PlayCircle className="h-5 w-5 text-orange-600" />
														</div>
														<div>
															<h3 className="font-bold text-orange-900 text-sm">
																Ready to Begin
															</h3>
															<p className="text-xs text-orange-700">
																Click "Start Session" to begin your interactive
																session
															</p>
														</div>
													</div>
												</div>
											</div>
										)}

									{/* Show message for sessions in welcome stage that are in progress */}
									{session.stage === "welcome" &&
										session.status === "in_progress" && (
											<div className="space-y-2 mb-3 w-full">
												<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
													<div className="flex items-center gap-3">
														<div className="p-2 bg-blue-100 rounded-full">
															<PlayCircle className="h-5 w-5 text-blue-600" />
														</div>
														<div>
															<h3 className="font-bold text-blue-900 text-sm">
																Session Started
															</h3>
															<p className="text-xs text-blue-700">
																Click "Continue Session" to proceed with the
																interactive session
															</p>
														</div>
													</div>
												</div>
											</div>
										)}

									{/* Completion indicator for completed sessions */}
									{session.status === "completed" && (
										<div className="flex items-center gap-2 mb-3">
											<CheckCircle className="h-4 w-4 text-emerald-500" />
											<div className="flex items-center gap-2">
												<span className="text-sm font-medium text-emerald-700">
													Session Completed
												</span>
												<Badge
													variant="secondary"
													className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-medium rounded-full px-2 py-0.5"
												>
													100% Complete
												</Badge>
											</div>
										</div>
									)}
								</CardHeader>
								<CardContent className="space-y-4 flex-grow px-6">
									{/* Primary Information Section */}
									<div className="space-y-3">
										{/* Child Information - Most Important */}
										<div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100">
											<div className="flex items-center gap-3">
												<div className="p-2 bg-pink-100 rounded-full">
													<User className="h-5 w-5 text-pink-600" />
												</div>
												<div className="flex-1">
													<h3 className="font-bold text-gray-900 text-lg">
														{session.child_data.first_name ||
														session.child_data.last_name ? (
															`${session.child_data.first_name} ${session.child_data.last_name}`.trim()
														) : (
															<span className="italic text-gray-500">
																No name
															</span>
														)}
													</h3>
													<p className="text-sm text-gray-600">
														{session.child_data.age ? (
															`${session.child_data.age} years old`
														) : (
															<span className="italic text-gray-400">
																Age not set
															</span>
														)}
													</p>
												</div>
											</div>
										</div>

										{/* Date and Time - Secondary Importance */}
										<div
											className={`rounded-xl p-3 space-y-2 border ${statusStyle.iconClass.replace("text-", "border-").replace("-600", "-200")} ${statusStyle.iconClass.replace("text-", "bg-").replace("-600", "-50")}`}
										>
											<div className="flex items-center gap-2 text-sm text-gray-700">
												<CalendarIcon
													className={`h-4 w-4 ${statusStyle.iconClass}`}
												/>
												<span className="font-semibold">Start:</span>
												<span>
													{formatDate(session.start_time)} at{" "}
													{formatTime(session.start_time)}
												</span>
											</div>
											{session.end_time ? (
												<div className="flex items-center gap-2 text-sm text-gray-700">
													<Clock
														className={`h-4 w-4 ${statusStyle.iconClass}`}
													/>
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

											{/* Time remaining for scheduled sessions */}
											{session.status === "scheduled" && (
												<div className="flex items-center gap-2 text-xs text-yellow-600 font-medium mt-2 pt-2 border-t border-yellow-200">
													<Clock className="h-3 w-3" />
													<span>
														{(() => {
															const start = new Date(session.start_time);
															const timeDiff = start.getTime() - now.getTime();
															const hours = Math.floor(
																timeDiff / (1000 * 60 * 60),
															);
															const minutes = Math.floor(
																(timeDiff % (1000 * 60 * 60)) / (1000 * 60),
															);

															if (timeDiff <= 0) {
																return "Ready to start";
															} else if (hours > 24) {
																const days = Math.floor(hours / 24);
																return `Starts in ${days} day${days > 1 ? "s" : ""}`;
															} else if (hours > 0) {
																return `Starts in ${hours}h ${minutes}m`;
															} else {
																return `Starts in ${minutes}m`;
															}
														})()}
													</span>
												</div>
											)}
										</div>
									</div>

									{/* Secondary Information Section */}
									<div className="space-y-3">
										{/* Tags - Quick Reference */}
										{session.tags.length > 0 && (
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
										)}

										{/* Session Notes - Detailed Information */}
										{session.session_notes && (
											<div className="space-y-2">
												<div className="flex items-center gap-2">
													<FileText
														className={`h-4 w-4 ${statusStyle.iconClass}`}
													/>
													<span className="font-semibold text-sm text-gray-700">
														Session Notes:
													</span>
												</div>
												<p
													className={`text-sm text-gray-700 leading-relaxed p-4 rounded-xl border-l-4 ${statusStyle.iconClass.replace("text-", "bg-").replace("-600", "-50")} ${statusStyle.iconClass.replace("text-", "border-").replace("-600", "-200")}`}
												>
													{session.session_notes}
												</p>
											</div>
										)}
									</div>
								</CardContent>
								<div className="flex items-center justify-between pt-4 border-t border-gray-100 px-6 pb-6">
									<div className="flex items-center gap-2">
										<UserCheck className="h-5 w-5 text-violet-500" />
										<span className="text-sm text-gray-700">
											<span className="font-semibold">Conducted by:</span>
											<span className="ml-1 text-gray-800 capitalize font-medium">
												{user.first_name} {user.last_name}
											</span>
										</span>
									</div>

									{/* Unified Action Menu */}
									<Suspense fallback={<div>Loading...</div>}>
										<ActionMenu
											session={session}
											onStart={async () => {
												setLoading(session.session_id, true);
												try {
													if (!session.session_id) return;
													if (!token) {
														alert("No token");
														return;
													}
													await updateSession(
														session.session_id as string,
														{
															status: "in_progress",
															stage: "Stage 1",
														},
														token,
													);
													navigate(`/room/${session.session_id}`);
												} catch {
													alert("Failed to start session. Please try again.");
												} finally {
													setLoading(session.session_id, false);
												}
											}}
											onContinue={() => {
												navigate(`/room/${session.session_id}`);
											}}
											onReschedule={async (newStartTime: string) => {
												setLoading(session.session_id, true);
												try {
													if (!session.session_id) return;
													if (!token) {
														alert("No token");
														return;
													}
													await updateSession(
														session.session_id as string,
														{
															start_time: newStartTime,
															status: "rescheduled",
														},
														token,
													);
													onSessionUpdated?.();
												} catch {
													alert(
														"Failed to reschedule session. Please try again.",
													);
												} finally {
													setLoading(session.session_id, false);
												}
											}}
											onCancel={async () => {
												setLoading(session.session_id, true);
												try {
													if (!session.session_id) return;
													if (!token) {
														alert("No token");
														return;
													}
													await updateSession(
														session.session_id as string,
														{ status: "cancelled" },
														token,
													);
													onSessionUpdated?.();
												} catch {
													alert("Failed to cancel session. Please try again.");
												} finally {
													setLoading(session.session_id, false);
												}
											}}
											onDelete={async () => {
												setLoading(session.session_id, true);
												try {
													await onDeleteSession(session.session_id);
												} catch {
													alert("Failed to delete session. Please try again.");
												} finally {
													setLoading(session.session_id, false);
												}
											}}
											onEnd={async () => {
												setLoading(session.session_id, true);
												try {
													if (!session.session_id) return;
													if (!token) {
														alert("No token");
														return;
													}
													await updateSession(
														session.session_id as string,
														{
															status: "completed",
															end_time: new Date().toISOString(),
														},
														token,
													);
													onSessionUpdated?.();
												} catch {
													alert("Failed to end session. Please try again.");
												} finally {
													setLoading(session.session_id, false);
												}
											}}
											isLoading={isLoading}
											canStart={(() => {
												const start = new Date(session.start_time);
												return start <= now && !session.end_time;
											})()}
											canContinue={(() => {
												const start = new Date(session.start_time);
												return start <= now && !session.end_time;
											})()}
										/>
									</Suspense>
								</div>

								{/* blur */}
								{/* <div
								// className={`absolute ${statusStyle.blurColor} size-1/2 rounded-full bottom-0 right-0 blur-3xl z-0 opacity-10`}
								/> */}
							</Card>
						</motion.div>
					);
				})}
			</AnimatePresence>
		</div>
	);
}
