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
				const response = await fetchSessionsBySocialWorkerId(socialWorkerId, token);
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

	// New function to get filtered sessions based on the selected filter
	const getFilteredSessions = (): Session[] => {
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

	const getStatusBadgeVariant = (status: string) => {
		switch (status.toLowerCase()) {
			case "completed":
				return "default";
			case "cancelled":
				return "destructive";
			case "scheduled":
				return "secondary";
			case "in-progress":
				return "outline";
			default:
				return "secondary";
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
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* Calendar View */}
			<Card className="lg:col-span-2">
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
										"min-h-[100px] p-1 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50",
										isCurrentMonth ? "bg-background" : "bg-muted/50",
										isSelected && "ring-2 ring-primary",
										isToday(day) && "bg-primary/10 border-primary",
									)}
									onClick={() => setSelectedDate(day)}
								>
									<div
										className={cn(
											"text-sm font-medium mb-1 text-center",
											!isCurrentMonth && "text-muted-foreground",
											isToday(day) && "text-primary font-bold",
										)}
									>
										{format(day, "d")}
									</div>
									<div className="space-y-1">
										{daySessions.slice(0, 2).map((session) => (
											<div
												key={session.session_id}
												className={cn(
													"text-xs p-1 rounded truncate",
													session.status === "completed"
														? "bg-green-100 text-green-800"
														: session.status === "cancelled"
															? "bg-gray-100 text-gray-800"
															: "bg-blue-100 text-blue-800",
												)}
											>
												{session.title}
											</div>
										))}
										{daySessions.length > 2 && (
											<div className="text-xs text-muted-foreground text-center">
												+{daySessions.length - 2} more
											</div>
										)}
									</div>
								</button>
							);
						})}
					</div>
				</CardContent>
			</Card>
			{/* Side Panel */}
			<div className="space-y-6">
				{/* Selected Date Sessions */}
				<Card>
					<CardHeader>
						<CardTitle>
							{selectedDate
								? format(selectedDate, "MMMM d, yyyy")
								: "Select a date"}
						</CardTitle>
					</CardHeader>
					<CardContent className="max-h-[400px] overflow-y-auto">
						{selectedDate ? (
							<div className="space-y-3">
								{getSessionsForDate(selectedDate).length === 0 ? (
									<p className="text-muted-foreground text-sm">
										{" "}
										No sessions for this date
									</p>
								) : (
									getSessionsForDate(selectedDate)
										.sort((a, b) => a.start_time.localeCompare(b.start_time))
										.map((session) => (
											<div
												key={session.session_id}
												className="p-4 border rounded-lg shadow-sm space-y-2 bg-card text-card-foreground"
											>
												<div className="flex items-center justify-between">
													<h4 className="font-semibold text-base">
														{session.title}
													</h4>
													<Badge
														variant={getStatusBadgeVariant(session.status)}
													>
														{session.status}
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
							<p className="text-muted-foreground text-sm">
								Click on a date to view sessions
							</p>
						)}
					</CardContent>
				</Card>
				{/* Session List (formerly "This Week's Sessions") */}
				<Card>
					<CardHeader>
						<CardTitle>Session List</CardTitle>
						<div className="mt-2">
							<ToggleGroup
								type="single"
								value={sessionFilter}
								onValueChange={(value: "week" | "upcoming" | "all") => {
									if (value) setSessionFilter(value); // Only update if a valid value is selected
								}}
								className="grid grid-cols-3"
							>
								<ToggleGroupItem value="week" aria-label="Toggle week">
									This Week
								</ToggleGroupItem>
								<ToggleGroupItem value="upcoming" aria-label="Toggle upcoming">
									Upcoming
								</ToggleGroupItem>
								<ToggleGroupItem value="all" aria-label="Toggle all">
									All Sessions
								</ToggleGroupItem>
							</ToggleGroup>
						</div>
					</CardHeader>
					<CardContent className="max-h-[400px] overflow-y-auto">
						{filteredSessions.length === 0 ? (
							<p className="text-muted-foreground text-sm">
								No sessions found for this view.
							</p>
						) : (
							<div className="space-y-3">
								{filteredSessions
									.sort(
										(a, b) =>
											parseISO(a.start_time).getTime() -
											parseISO(b.start_time).getTime(),
									) // Sort by time
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
													variant={getStatusBadgeVariant(session.status)}
													className="text-xs"
												>
													{session.status}
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
									))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
