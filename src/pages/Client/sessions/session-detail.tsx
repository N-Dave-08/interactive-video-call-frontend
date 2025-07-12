import {
	ArrowLeft,
	Cake,
	Calendar,
	Clock,
	Heart,
	MapPin,
	MessageSquare,
	Palette,
	Tag,
	Target,
	User,
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
			return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200";
		case "stage 2":
			return "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200";
		case "stage 3":
			return "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200";
		case "stage 4":
			return "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200";
		default:
			return "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200";
	}
}

function getStatusColor(hasEndTime: boolean) {
	return hasEndTime
		? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200"
		: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200";
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
			<div className="min-h-screen flex items-center justify-center">
				<div className="bg-white/80 p-8 rounded-xl shadow-lg text-center">
					<h1 className="text-2xl font-bold mb-4">Session Detail</h1>
					<p className="text-red-500">
						No session data found. Please navigate from the sessions list.
					</p>
					<Button onClick={() => navigate(-1)} className="mt-4">
						<ArrowLeft className="h-4 w-4 mr-2" /> Back to Sessions
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen ">
			<div className="max-w-4xl mx-auto p-6">
				{/* Header */}
				<div className="mb-8">
					<Button
						variant="outline"
						size="lg"
						className="mb-6 bg-white/80 hover:bg-white border-gray-200 shadow-sm transition-all hover:shadow-md"
						onClick={() => navigate(-1)}
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Sessions
					</Button>

					<div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
						<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
							<div className="space-y-3">
								<h1 className="text-3xl font-bold text-gray-900 tracking-tight">
									{session.title}
								</h1>
								<div className="flex flex-wrap items-center gap-3">
									{session.stage && (
										<div className="flex items-center gap-2">
											<Target className="h-4 w-4 text-gray-500" />
											<Badge
												className={`px-3 py-1 font-medium ${getStageColor(session.stage)}`}
											>
												{session.stage.toUpperCase()}
											</Badge>
										</div>
									)}
									<Badge
										className={`px-3 py-1 font-medium ${getStatusColor(!!session.end_time)}`}
									>
										{session.end_time ? "Completed" : "In Progress"}
									</Badge>
								</div>
							</div>

							<div className="text-right space-y-1">
								<div className="text-sm text-gray-600">Session ID</div>
								<div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
									{session.session_id}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Session Timeline */}
						<Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-lg">
									<Clock className="h-5 w-5 text-blue-600" />
									Session Timeline
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
									<div className="flex items-center gap-3 mb-2">
										<Calendar className="h-4 w-4 text-blue-600" />
										<span className="font-semibold text-blue-900">
											Start Time
										</span>
									</div>
									<div className="ml-7 space-y-1">
										<div className="text-sm font-medium">
											{formatDate(session.start_time)}
										</div>
										<div className="text-sm text-gray-600">
											{formatTime(session.start_time)}
										</div>
									</div>
								</div>

								{session.end_time ? (
									<div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
										<div className="flex items-center gap-3 mb-2">
											<Clock className="h-4 w-4 text-green-600" />
											<span className="font-semibold text-green-900">
												End Time
											</span>
										</div>
										<div className="ml-7 space-y-1">
											<div className="text-sm font-medium">
												{formatDate(session.end_time)}
											</div>
											<div className="text-sm text-gray-600">
												{formatTime(session.end_time)}
											</div>
											{calculateDuration() && (
												<div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full inline-block">
													Duration: {calculateDuration()}
												</div>
											)}
										</div>
									</div>
								) : (
									<div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
										<div className="flex items-center gap-3 text-gray-500">
											<Clock className="h-4 w-4" />
											<span className="italic">Session in progress...</span>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Emotional Expression */}
						<Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-lg">
									<Heart className="h-5 w-5 text-pink-600" />
									Emotional Expression
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-3">
										<div>
											<span className="text-sm font-medium text-gray-700 mb-2 block">
												Method
											</span>
											<div className="bg-pink-50 text-pink-800 px-3 py-2 rounded-lg text-sm border border-pink-200">
												{session.emotional_expression.method}
											</div>
										</div>

										<div>
											<span className="text-sm font-medium text-gray-700 mb-2 block">
												Drawing Data
											</span>
											<div className="flex items-center gap-2">
												<Palette className="h-4 w-4 text-purple-600" />
												<span className="text-sm text-gray-600">
													{session.emotional_expression.drawing_data
														? "Available"
														: "None"}
												</span>
											</div>
										</div>
									</div>
								</div>

								<Separator />

								<div className="space-y-3">
									<div>
										<span className="text-sm font-medium text-gray-700 mb-2 block">
											Selected Feelings
										</span>
										<div className="flex flex-wrap gap-2">
											{session.emotional_expression.selected_feelings.map(
												(feeling) => (
													<Badge
														key={feeling}
														className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 transition-colors"
														variant="outline"
													>
														{feeling}
													</Badge>
												),
											)}
										</div>
									</div>

									<div>
										<span className="text-sm font-medium text-gray-700 mb-2 block">
											Body Map Annotations
										</span>
										<div className="flex flex-wrap gap-2">
											{session.emotional_expression.body_map_annotations.map(
												(annotation) => (
													<Badge
														key={annotation}
														className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors"
														variant="outline"
													>
														{annotation.replace(/_/g, " ")}
													</Badge>
												),
											)}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Session Notes */}
						<Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-lg">
									<MessageSquare className="h-5 w-5 text-indigo-600" />
									Session Notes
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border-l-4 border-indigo-400">
									<p className="text-gray-700 leading-relaxed">
										{session.session_notes}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Child Information */}
						<Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-lg">
									<User className="h-5 w-5 text-blue-600" />
									Child Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="text-center pb-4 border-b border-gray-100">
									<div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold">
										{session.child_data.first_name[0]}
										{session.child_data.last_name[0]}
									</div>
									<h3 className="font-semibold text-lg text-gray-900">
										{session.child_data.first_name}{" "}
										{session.child_data.last_name}
									</h3>
									<p className="text-sm text-gray-600">
										Age {session.child_data.age}
									</p>
								</div>

								<div className="space-y-3">
									<div className="flex items-center gap-3">
										<Cake className="h-4 w-4 text-pink-500" />
										<div>
											<div className="text-xs text-gray-500 uppercase tracking-wide">
												Birthday
											</div>
											<div className="text-sm font-medium">
												{formatDate(session.child_data.birthday)}
											</div>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<MapPin className="h-4 w-4 text-green-500" />
										<div>
											<div className="text-xs text-gray-500 uppercase tracking-wide">
												Place of Birth
											</div>
											<div className="text-sm font-medium">
												{session.child_data.place_of_birth}
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Avatar Data */}
						<Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-lg">
									<User className="h-5 w-5 text-purple-600" />
									Avatar Description
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
									<div className="text-xs text-purple-600 uppercase tracking-wide mb-1">
										Hair
									</div>
									<div className="text-sm text-purple-800">
										{session.avatar_data.hair}
									</div>
								</div>
								<div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
									<div className="text-xs text-purple-600 uppercase tracking-wide mb-1">
										Head
									</div>
									<div className="text-sm text-purple-800">
										{session.avatar_data.head}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Tags */}
						<Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-lg">
									<Tag className="h-5 w-5 text-orange-600" />
									Tags
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-2">
									{session.tags.map((tag) => (
										<Badge
											key={tag}
											variant="outline"
											className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 transition-colors"
										>
											{tag.replace(/_/g, " ")}
										</Badge>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Interviewer */}
						<Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-lg">
									<UserCheck className="h-5 w-5 text-green-600" />
									Conducted By
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-center">
									<div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
										{session.user.first_name[0]}
										{session.user.last_name[0]}
									</div>
									<div className="font-medium text-gray-900">
										{session.user.first_name} {session.user.last_name}
									</div>
									<div className="text-xs text-gray-500 mt-1">
										Social Worker
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Footer Meta Info */}
				<Card className="mt-8 bg-white/50 backdrop-blur-sm border-white/20">
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

				{/* Bottom Back Button */}
				<div className="mt-8 text-center">
					<Button
						variant="outline"
						size="lg"
						className="bg-white/80 hover:bg-white border-gray-200 shadow-sm transition-all hover:shadow-md"
						onClick={() => navigate(-1)}
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Sessions
					</Button>
				</div>
			</div>
		</div>
	);
}
