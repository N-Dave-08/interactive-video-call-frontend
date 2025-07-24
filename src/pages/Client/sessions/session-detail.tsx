import { motion } from "framer-motion";
import {
	ArrowLeft,
	Cake,
	Calendar,
	Clock,
	Heart,
	MessageSquare,
	Palette,
	Tag,
	Target,
	UserCheck,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Session } from "@/types/sessions";

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

function getStatusColor(hasEndTime: boolean) {
	return hasEndTime
		? "bg-green-100 text-green-700 border-green-300"
		: "bg-blue-100 text-blue-700 border-blue-300";
}

function formatBodyMapAnnotation(annotation: string) {
	const [part, type] = annotation.split(":");
	const partLabel = part
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, (str) => str.toUpperCase());
	const typeLabel = type ? type.charAt(0).toUpperCase() + type.slice(1) : "";
	return `${partLabel.trim()}${typeLabel ? ` (${typeLabel})` : ""}`;
}

export default function SessionDetailPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const session = (location.state as { session?: Session })?.session;

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
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

	const calculateDuration = () => {
		if (!session?.end_time) return null;
		const start = new Date(session.start_time);
		const end = new Date(session.end_time);
		const diffMs = end.getTime() - start.getTime();
		const diffMins = Math.round(diffMs / (1000 * 60));
		const hours = Math.floor(diffMins / 60);
		const minutes = diffMins % 60;
		return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
	};

	if (!session) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-gray-100">
				<div className="bg-white/10 p-8 rounded-3xl shadow-lg text-center border border-white/20">
					<h1 className="text-2xl font-bold mb-4">Session Detail</h1>
					<p className="text-red-400">
						No session data found. Please navigate from the sessions list.
					</p>
					<Button
						onClick={() => navigate(-1)}
						className="mt-4 bg-white/10 border-gray-600 text-white"
					>
						<ArrowLeft className="h-4 w-4 mr-2" /> Back to Sessions
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen text-gray-900 p-6 md:p-12 flex flex-col items-center">
			<div className="w-full max-w-6xl mx-auto space-y-8">
				{/* Top Back Button */}
				<Button
					variant="outline"
					size="lg"
					className="bg-white hover:bg-blue-50 border-gray-200 text-blue-700 shadow-lg transition-all hover:shadow-xl"
					onClick={() => navigate(-1)}
				>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to Sessions
				</Button>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column: Avatar and Child Info */}
					<div className="lg:col-span-1 flex flex-col items-center space-y-6">
						{/* Avatar Card */}
						<Card className="w-full bg-white/90 backdrop-blur-md border border-blue-100 shadow-xl p-6 flex flex-col items-center relative overflow-hidden rounded-3xl">
							<div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-purple-100/40 animate-pulse rounded-3xl" />
							<CardContent className="space-y-4 w-full z-10">
								<div className="flex items-center justify-center mb-4">
									<div className="relative bg-white/40 backdrop-blur-sm rounded-2xl p-4 shadow-inner border border-white/30 w-full max-w-xs">
										<div className="relative w-full aspect-square mx-auto">
											{session.avatar_data?.background &&
												session.avatar_data?.background !== "default" && (
													<img
														src={session.avatar_data.background}
														className="absolute inset-0 object-cover h-full w-full brightness-75 rounded-lg"
														alt="Avatar background"
													/>
												)}
											{session.avatar_data?.clothes &&
												session.avatar_data?.clothes !== "default" && (
													<motion.img
														src={session.avatar_data.clothes}
														className="absolute inset-0 w-full h-full object-contain top-[-10px]"
														alt="Avatar clothes"
														animate={{ scale: [1, 1.02, 1] }}
														transition={{
															duration: 3,
															repeat: Infinity,
															ease: "easeInOut",
														}}
													/>
												)}
											{session.avatar_data?.head &&
												session.avatar_data?.head !== "default" && (
													<motion.div
														className="absolute inset-0 w-full h-full"
														style={{ transformOrigin: "bottom center" }}
														animate={{ y: [0, -3, 0] }}
														transition={{
															duration: 2,
															repeat: Infinity,
															ease: "easeInOut",
														}}
													>
														<img
															src={session.avatar_data.head}
															className="w-full h-full object-contain"
															alt="Avatar head"
														/>
													</motion.div>
												)}
											{session.avatar_data?.hair &&
												session.avatar_data?.hair !== "default" && (
													<motion.div
														className="absolute inset-0 w-full h-full"
														style={{ transformOrigin: "bottom center" }}
														animate={{ y: [0, -3, 0] }}
														transition={{
															duration: 2,
															repeat: Infinity,
															ease: "easeInOut",
														}}
													>
														<img
															src={session.avatar_data.hair}
															className="w-full h-full object-contain"
															alt="Avatar hair"
														/>
													</motion.div>
												)}
											{session.avatar_data?.expression &&
												session.avatar_data?.expression !== "default" && (
													<motion.div
														className="absolute inset-0 w-full h-full"
														style={{ transformOrigin: "bottom center" }}
														animate={{ y: [0, -3, 0] }}
														transition={{
															duration: 2,
															repeat: Infinity,
															ease: "easeInOut",
														}}
													>
														<img
															src={session.avatar_data.expression}
															className="w-full h-full object-contain"
															alt="Avatar expression"
														/>
													</motion.div>
												)}
											{(!session.avatar_data?.background ||
												session.avatar_data?.background === "default") &&
												(!session.avatar_data?.clothes ||
													session.avatar_data?.clothes === "default") &&
												(!session.avatar_data?.head ||
													session.avatar_data?.head === "default") &&
												(!session.avatar_data?.hair ||
													session.avatar_data?.hair === "default") &&
												(!session.avatar_data?.expression ||
													session.avatar_data?.expression === "default") && (
													<div className="flex items-center justify-center w-full h-full text-gray-400 text-lg font-medium">
														No avatar yet
													</div>
												)}
										</div>
									</div>
								</div>
								<div className="text-center">
									<h3 className="font-bold text-2xl text-blue-900">
										{session.child_data.first_name}{" "}
										{session.child_data.last_name}
									</h3>
									<p className="text-blue-700 text-lg">
										Age {session.child_data.age}
									</p>
									<p className="text-blue-500 text-base">
										Gender: {session.child_data.gender || "N/A"}
									</p>
									<div className="flex items-center justify-center gap-2 text-blue-400 mt-2">
										<Cake className="h-5 w-5 text-pink-400" />
										<span className="text-sm">
											{formatDate(session.child_data.birthday)}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Interviewer Card */}
						<Card className="w-full bg-white/90 backdrop-blur-md border border-green-100 shadow-xl p-6 rounded-3xl">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-lg text-green-700">
									<UserCheck className="h-5 w-5 text-green-400" />
									Conducted By
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-center">
									<div className="w-16 h-16 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full mx-auto mb-2 flex items-center justify-center text-green-800 text-xl font-bold">
										{session.user.first_name[0]}
										{session.user.last_name[0]}
									</div>
									<div className="font-medium text-green-900 text-lg">
										{session.user.first_name} {session.user.last_name}
									</div>
									<div className="text-sm text-green-600 mt-1">
										Social Worker
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Column: Session Details */}
					<div className="lg:col-span-2 space-y-6">
						{/* Session Title, ID, Status */}
						<Card className="bg-white/90 backdrop-blur-md border border-blue-100 shadow-xl p-6 rounded-3xl">
							<CardHeader className="pb-4">
								<CardTitle className="text-2xl font-bold text-blue-900">
									{session.title}
								</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-wrap items-center gap-3">
								{session.end_time ? (
									<Badge
										className={`px-3 py-1 font-medium ${getStatusColor(!!session.end_time)}`}
									>
										Completed
									</Badge>
								) : (
									session.stage && (
										<Badge
											className={`px-3 py-1 font-medium ${getStageColor(session.stage)}`}
										>
											<Target className="h-4 w-4 mr-2" />
											{session.stage.toUpperCase()}
										</Badge>
									)
								)}
								<div className="ml-auto text-sm text-blue-400">
									Session ID:{" "}
									<span className="font-mono bg-blue-50 px-2 py-1 rounded">
										{session.session_id}
									</span>
								</div>
							</CardContent>
						</Card>

						{/* Session Timeline */}
						<Card className="bg-white/90 backdrop-blur-md border border-blue-100 shadow-xl p-6 rounded-3xl">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-lg text-blue-700">
									<Clock className="h-5 w-5 text-blue-400" />
									Session Timeline
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
									<div className="flex items-center gap-3 mb-2 text-blue-700">
										<Calendar className="h-4 w-4" />
										<span className="font-semibold">Start Time</span>
									</div>
									<div className="ml-7 space-y-1 text-blue-900">
										<div className="text-sm font-medium">
											{formatDate(session.start_time)}
										</div>
										<div className="text-sm text-blue-400">
											{formatTime(session.start_time)}
										</div>
									</div>
								</div>
								{session.end_time ? (
									<div className="bg-green-50 rounded-xl p-4 border border-green-100">
										<div className="flex items-center gap-3 mb-2 text-green-700">
											<Clock className="h-4 w-4" />
											<span className="font-semibold">End Time</span>
										</div>
										<div className="ml-7 space-y-1 text-green-900">
											<div className="text-sm font-medium">
												{formatDate(session.end_time)}
											</div>
											<div className="text-sm text-green-400">
												{formatTime(session.end_time)}
											</div>
											{calculateDuration() && (
												<div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full inline-block mt-2">
													Duration: {calculateDuration()}
												</div>
											)}
										</div>
									</div>
								) : (
									<div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
										<div className="flex items-center gap-3 text-gray-400">
											<Clock className="h-4 w-4" />
											<span className="italic">Session in progress...</span>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Emotional Expression */}
						<Card className="bg-white/90 backdrop-blur-md border border-pink-100 shadow-xl p-6 rounded-3xl">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-lg text-pink-700">
									<Heart className="h-5 w-5 text-pink-400" />
									Emotional Expression
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<div>
										<span className="text-sm font-medium text-pink-700 mb-2 block">
											Drawing Data
										</span>
										<div className="flex items-center gap-2 text-pink-400">
											<Palette className="h-4 w-4 text-purple-400" />
											<span className="text-sm">
												{session.emotional_expression.drawing_data
													? "Available"
													: "None"}
											</span>
										</div>
									</div>
									{session.emotional_expression.drawing_data && (
										<div className="mt-2 bg-pink-50 p-4 rounded-xl border border-pink-100">
											<img
												src={session.emotional_expression.drawing_data}
												alt="User Drawing"
												className="max-w-full rounded-lg border border-pink-200"
											/>
										</div>
									)}
								</div>
								<Separator className="bg-pink-100" />
								<div className="space-y-3">
									<div>
										<span className="text-sm font-medium text-pink-700 mb-2 block">
											Selected Feelings
										</span>
										<div className="flex flex-wrap gap-2">
											{session.emotional_expression.selected_feelings.length >
											0 ? (
												session.emotional_expression.selected_feelings.map(
													(feeling) => (
														<Badge
															key={feeling}
															className="bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200 transition-colors"
															variant="outline"
														>
															{feeling}
														</Badge>
													),
												)
											) : (
												<span className="text-pink-300 italic">
													None selected
												</span>
											)}
										</div>
									</div>
									<div>
										<span className="text-sm font-medium text-pink-700 mb-2 block">
											Body Map Annotations
										</span>
										<div className="flex flex-wrap gap-2">
											{session.emotional_expression.body_map_annotations
												.length > 0 ? (
												session.emotional_expression.body_map_annotations.map(
													(annotation) => (
														<Badge
															key={annotation}
															className="bg-green-100 text-green-700 border-green-300 hover:bg-green-200 transition-colors"
															variant="outline"
														>
															{formatBodyMapAnnotation(annotation)}
														</Badge>
													),
												)
											) : (
												<span className="text-pink-300 italic">
													No annotations
												</span>
											)}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Session Notes */}
						<Card className="bg-white/90 backdrop-blur-md border border-indigo-100 shadow-xl p-6 rounded-3xl">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-lg text-indigo-700">
									<MessageSquare className="h-5 w-5 text-indigo-400" />
									Session Notes
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="bg-indigo-50 rounded-xl p-6 border-l-4 border-indigo-300 text-indigo-900">
									<p className="leading-relaxed">
										{session.session_notes?.trim() ? (
											session.session_notes
										) : (
											<span className="text-indigo-300 italic">
												No notes yet
											</span>
										)}
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Tags */}
						<Card className="bg-white/90 backdrop-blur-md border border-orange-100 shadow-xl p-6 rounded-3xl">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-lg text-orange-700">
									<Tag className="h-5 w-5 text-orange-400" />
									Tags
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-2">
									{session.tags.length > 0 ? (
										session.tags.map((tag) => (
											<Badge
												key={tag}
												variant="outline"
												className="bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200 transition-colors"
											>
												{tag.replace(/_/g, " ")}
											</Badge>
										))
									) : (
										<span className="text-orange-300 italic">No tags</span>
									)}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Footer Meta Info */}
				<Card className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl p-6 rounded-3xl">
					<CardContent className="pt-6">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
							<div>
								<div className="font-medium text-gray-700">
									Social Worker ID
								</div>
								<div className="font-mono">{session.social_worker_id}</div>
							</div>
							<div>
								<div className="font-medium text-gray-700">Status</div>
								<div className="capitalize">{session.status}</div>
							</div>
							<div>
								<div className="font-medium text-gray-700">Created</div>
								<div>{formatDate(session.createdAt)}</div>
							</div>
							<div>
								<div className="font-medium text-gray-700">Updated</div>
								<div>{formatDate(session.updatedAt)}</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
