import {
	addMonths,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isFuture,
	isSameDay,
	isSameMonth,
	isToday,
	isWithinInterval,
	parseISO,
	startOfMonth,
	startOfWeek,
	subMonths,
} from "date-fns";
import {
	CalendarIcon,
	ChevronLeft,
	ChevronRight,
	Clock,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchSessionsBySocialWorkerId } from "@/api/sessions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SpinnerLoading from "@/components/ui/spinner-loading";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { Session } from "@/types";

interface SessionCalendarProps {
	socialWorkerId: string;
	token: string;
}

export default function SessionCalendar({
	socialWorkerId,
	token,
}: SessionCalendarProps) {
	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [sessions, setSessions] = useState<Session[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [sessionFilter, setSessionFilter] = useState<
		"week" | "upcoming" | "all"
	>("week");

	useEffect(() => {
		const loadSessions = async () => {
			try {
				setLoading(true);
				const response = await fetchSessionsBySocialWorkerId(
					socialWorkerId,
					token,
				);
				setSessions(response.data);
				setError(null);
			} catch (err) {
				setError("Failed to load sessions");
				console.error("Error loading sessions:", err);
			} finally {
				setLoading(false);
			}
		};
		loadSessions();
	}, [socialWorkerId, token]);

	const getCalendarDays = (): Date[] => {
		const start = startOfWeek(startOfMonth(currentDate));
		const end = endOfWeek(endOfMonth(currentDate));
		return eachDayOfInterval({ start, end });
	};

	const getSessionsForDate = (date: Date): Session[] => {
		return sessions.filter((session) => {
			try {
				return isSameDay(parseISO(session.start_time), date);
			} catch {
				console.error("Invalid date format for session:", session.start_time);
				return false;
			}
		});
	};

	const getSessionsForWeek = (date: Date): Session[] => {
		const start = startOfWeek(date);
		const end = endOfWeek(date);
		return sessions.filter((session) => {
			try {
				return isWithinInterval(parseISO(session.start_time), { start, end });
			} catch {
				console.error("Invalid date format for session:", session.start_time);
				return false;
			}
		});
	};

	// New function to get upcoming sessions
	const getUpcomingSessions = (): Session[] => {
		return sessions.filter((session) => {
			try {
				return isFuture(parseISO(session.start_time));
			} catch {
				console.error("Invalid date format for session:", session.start_time);
				return false;
			}
		});
	};

	// Enhanced function to get filtered sessions with better UX logic
	const getFilteredSessions = (): Session[] => {
		// If a date is selected, prioritize showing sessions for that date
		if (selectedDate) {
			const selectedDateSessions = getSessionsForDate(selectedDate);
			if (selectedDateSessions.length > 0) {
				return selectedDateSessions;
			}
		}

		// Otherwise, use the filter logic
		switch (sessionFilter) {
			case "week":
				return getSessionsForWeek(currentDate);
			case "upcoming":
				return getUpcomingSessions();
			case "all":
				return sessions;
			default:
				return [];
		}
	};

	const formatSessionTime = (dateString: string): string => {
		try {
			return format(parseISO(dateString), "h:mm a");
		} catch {
			console.error("Invalid date format:", dateString);
			return "";
		}
	};

	const getSessionDuration = (start: string, end: string | null): string => {
		if (!end) return "";
		try {
			const startDate = parseISO(start);
			const endDate = parseISO(end);
			const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
			return `${Math.floor(duration)} min`;
		} catch (e) {
			console.error("Error calculating duration:", e);
			return "";
		}
	};

	// Enhanced status styling function based on session cards design
	const getStatusStyle = (status: string) => {
		switch (status.toLowerCase()) {
			case "scheduled":
				return {
					label: "Scheduled",
					badgeClass:
						"bg-yellow-100 text-yellow-800 border-yellow-200 ring-2 ring-yellow-200",
					iconClass: "text-yellow-600",
				};
			case "in_progress":
			case "in-progress":
				return {
					label: "In Progress",
					badgeClass:
						"bg-blue-100 text-blue-800 border-blue-200 ring-2 ring-blue-200",
					iconClass: "text-blue-600",
				};
			case "rescheduled":
				return {
					label: "Rescheduled",
					badgeClass:
						"bg-purple-100 text-purple-800 border-purple-200 ring-2 ring-purple-200",
					iconClass: "text-purple-600",
				};
			case "completed":
				return {
					label: "Completed",
					badgeClass:
						"bg-emerald-100 text-emerald-800 border-emerald-200 ring-2 ring-emerald-200",
					iconClass: "text-emerald-600",
				};
			case "cancelled":
				return {
					label: "Cancelled",
					badgeClass:
						"bg-red-100 text-red-800 border-red-200 ring-2 ring-red-200",
					iconClass: "text-red-600",
				};
			default:
				return {
					label: status,
					badgeClass:
						"bg-gray-100 text-gray-700 border-gray-200 ring-2 ring-gray-200",
					iconClass: "text-gray-600",
				};
		}
	};

	if (loading) {
		return <SpinnerLoading />;
	}

	if (error) {
		return (
			<div className="p-6 text-center text-destructive">
				<p>{error}</p>
				<Button
					variant="outline"
					className="mt-4 bg-transparent"
					onClick={() => window.location.reload()}
				>
					Retry
				</Button>
			</div>
		);
	}

	const calendarDays = getCalendarDays();
	const filteredSessions = getFilteredSessions(); // Get filtered sessions for the list

	return (
		<div className="space-y-6">
			{/* Enhanced Header with Quick Stats */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
					<p className="text-gray-600">Manage and view your therapy sessions</p>
				</div>
				<div className="flex items-center gap-4">
					{/* Quick Stats */}
					<div className="flex items-center gap-6 text-sm">
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
							<span className="text-gray-600">
								{
									filteredSessions.filter((s) => s.status === "completed")
										.length
								}{" "}
								Completed
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-blue-500 rounded-full"></div>
							<span className="text-gray-600">
								{
									filteredSessions.filter((s) => s.status === "in_progress")
										.length
								}{" "}
								Active
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
							<span className="text-gray-600">
								{
									filteredSessions.filter((s) => s.status === "scheduled")
										.length
								}{" "}
								Scheduled
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
				{/* Calendar View - Takes more space */}
				<Card className="xl:col-span-3">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<CalendarIcon className="w-5 h-5" />
								{format(currentDate, "MMMM yyyy")}
							</CardTitle>
							<div className="flex items-center space-x-2">
								<Button
									variant="outline"
									size="icon"
									onClick={() => setCurrentDate(subMonths(currentDate, 1))}
								>
									<ChevronLeft className="w-4 h-4" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									onClick={() => setCurrentDate(addMonths(currentDate, 1))}
								>
									<ChevronRight className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-7 gap-1 mb-4">
							{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
								<div
									key={day}
									className="p-2 text-center text-sm font-medium text-muted-foreground"
								>
									{day}
								</div>
							))}
						</div>
						<div className="grid grid-cols-7 gap-1">
							{calendarDays.map((day) => {
								const daySessions = getSessionsForDate(day);
								const isSelected = selectedDate && isSameDay(day, selectedDate);
								const isCurrentMonth = isSameMonth(day, currentDate);
								return (
									<button
										type="button"
										key={day.toISOString()}
										className={cn(
											"min-h-[120px] p-2 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/50 hover:shadow-md",
											isCurrentMonth ? "bg-background" : "bg-muted/50",
											isSelected && "ring-2 ring-primary shadow-lg",
											isToday(day) && "bg-primary/10 border-primary",
										)}
										onClick={() => setSelectedDate(day)}
									>
										<div
											className={cn(
												"text-sm font-medium mb-2 text-center",
												!isCurrentMonth && "text-muted-foreground",
												isToday(day) && "text-primary font-bold",
											)}
										>
											{format(day, "d")}
										</div>
										<div className="space-y-1">
											{daySessions.slice(0, 3).map((session) => (
												<div
													key={session.session_id}
													className={cn(
														"text-xs p-1.5 rounded-md truncate font-medium shadow-sm transition-all duration-200 hover:scale-105",
														getStatusStyle(session.status)
															.badgeClass.replace("ring-2", "")
															.replace("border", ""),
													)}
												>
													{session.title}
												</div>
											))}
											{daySessions.length > 3 && (
												<div className="text-xs text-muted-foreground text-center bg-gray-100 rounded px-1 py-0.5">
													+{daySessions.length - 3} more
												</div>
											)}
										</div>
									</button>
								);
							})}
						</div>
					</CardContent>
				</Card>

				{/* Unified Session Panel */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							{selectedDate ? (
								<>
									<CalendarIcon className="w-4 h-4" />
									{format(selectedDate, "MMMM d, yyyy")}
								</>
							) : (
								<>
									<Clock className="w-4 h-4" />
									Session List
								</>
							)}
						</CardTitle>
						{/* Context Controls */}
						<div className="mt-3">
							{selectedDate ? (
								<div className="flex items-center justify-between">
									<span className="text-xs text-muted-foreground">
										Showing sessions for selected date
									</span>
									<Button
										variant="ghost"
										size="sm"
										className="text-xs h-6 px-2"
										onClick={() => setSelectedDate(null)}
									>
										Clear Selection
									</Button>
								</div>
							) : (
								<ToggleGroup
									type="single"
									value={sessionFilter}
									onValueChange={(value: "week" | "upcoming" | "all") => {
										if (value) setSessionFilter(value);
									}}
									className="grid grid-cols-3 w-full"
								>
									<ToggleGroupItem
										value="week"
										aria-label="Toggle week"
										className="flex-1 py-2 text-xs font-medium"
									>
										This Week
									</ToggleGroupItem>
									<ToggleGroupItem
										value="upcoming"
										aria-label="Toggle upcoming"
										className="flex-1 py-2 text-xs font-medium"
									>
										Upcoming
									</ToggleGroupItem>
									<ToggleGroupItem
										value="all"
										aria-label="Toggle all"
										className="flex-1 py-2 text-xs font-medium"
									>
										All Sessions
									</ToggleGroupItem>
								</ToggleGroup>
							)}
						</div>
					</CardHeader>
					<CardContent className="max-h-[600px] overflow-y-auto">
						{selectedDate ? (
							// Detailed view for selected date
							<div className="space-y-3">
								{getSessionsForDate(selectedDate).length === 0 ? (
									<div className="text-center py-8">
										<CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
										<p className="text-muted-foreground text-sm">
											No sessions for this date
										</p>
									</div>
								) : (
									getSessionsForDate(selectedDate)
										.sort((a, b) => a.start_time.localeCompare(b.start_time))
										.map((session) => (
											<div
												key={session.session_id}
												className="p-4 border rounded-lg shadow-sm space-y-3 bg-card text-card-foreground hover:shadow-md transition-shadow"
											>
												<div className="flex items-center justify-between">
													<h4 className="font-semibold text-base">
														{session.title}
													</h4>
													<Badge
														className={`text-xs font-medium rounded-full px-3 py-1.5 transition-all duration-200 hover:scale-105 ${getStatusStyle(session.status).badgeClass}`}
													>
														{getStatusStyle(session.status).label}
													</Badge>
												</div>
												{session.user && (
													<div className="flex items-center gap-2 text-sm text-muted-foreground">
														<User className="w-4 h-4" />
														<span>
															{session.user.first_name} {session.user.last_name}
														</span>
													</div>
												)}
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<Clock className="w-4 h-4" />
													<span>
														{formatSessionTime(session.start_time)}
														{session.end_time && (
															<>
																{" - "}
																{formatSessionTime(session.end_time)}{" "}
																<span className="text-xs">
																	(
																	{getSessionDuration(
																		session.start_time,
																		session.end_time,
																	)}
																	)
																</span>
															</>
														)}
													</span>
												</div>
												{session.session_notes && (
													<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
														{session.session_notes}
													</p>
												)}
												{session.tags && session.tags.length > 0 && (
													<div className="flex flex-wrap gap-1 mt-2">
														{session.tags.map((tag) => (
															<Badge
																key={tag}
																variant="secondary"
																className="text-xs"
															>
																{tag}
															</Badge>
														))}
													</div>
												)}
												<div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-2 border-t">
													<span>
														Created:{" "}
														{format(parseISO(session.createdAt), "MMM d, yyyy")}
													</span>
													<span>
														Updated:{" "}
														{format(parseISO(session.updatedAt), "MMM d, yyyy")}
													</span>
												</div>
											</div>
										))
								)}
							</div>
						) : (
							// Compact list view for filtered sessions
							<div className="space-y-3">
								{filteredSessions.length === 0 ? (
									<div className="text-center py-8">
										<Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
										<p className="text-muted-foreground text-sm">
											No sessions found for this view.
										</p>
									</div>
								) : (
									filteredSessions
										.sort(
											(a, b) =>
												parseISO(a.start_time).getTime() -
												parseISO(b.start_time).getTime(),
										)
										.map((session) => (
											<div
												key={session.session_id}
												className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm hover:bg-accent/50 transition-colors bg-card text-card-foreground"
											>
												<div className="flex items-center justify-between">
													<p className="font-semibold text-base">
														{session.title}
													</p>
													<Badge
														className={`text-xs font-medium rounded-full px-3 py-1.5 transition-all duration-200 hover:scale-105 ${getStatusStyle(session.status).badgeClass}`}
													>
														{getStatusStyle(session.status).label}
													</Badge>
												</div>
												<p className="text-xs text-muted-foreground">
													{format(
														parseISO(session.start_time),
														"EEE, MMM d 'at' h:mm a",
													)}
												</p>
												{session.user && (
													<p className="text-xs text-muted-foreground">
														With: {session.user.first_name}{" "}
														{session.user.last_name}
													</p>
												)}
											</div>
										))
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
