import { Calendar, Heart, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSessionsBySocialWorkerId } from "@/api/sessions";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { Session } from "@/types/sessions";
import CreateSessionModal from "./create-session-modal";
import SessionCards from "./session-cards";
import SessionCardsSkeleton from "./session-cards-skeleton";

export default function SessionsPage() {
	const { user } = useAuth();
	const [sessions, setSessions] = useState<Session[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	const handleSessionDeleted = (sessionId: string) => {
		setSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
	};

	useEffect(() => {
		if (!user) return;
		if (user.role !== "social_worker") {
			setError("Only social workers can view their sessions list.");
			setLoading(false);
			return;
		}
		fetchSessionsBySocialWorkerId(user.id)
			.then((res) => {
				setSessions(res.data);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [user]);

	if (error) return <div>Error: {error}</div>;
	if (!user) return null;

	// Empty State Component
	function SessionsEmptyState({
		onCreateSession,
	}: {
		onCreateSession: () => void;
	}) {
		return (
			<div className="flex flex-col items-center justify-center py-16 px-4">
				<div className="relative mb-8">
					{/* Floating decorative elements */}
					<div className="absolute -top-4 -left-4 text-yellow-400 animate-bounce">
						<Star className="w-6 h-6 fill-current" />
					</div>
					<div className="absolute -top-2 -right-6 text-pink-400 animate-pulse">
						<Heart className="w-5 h-5 fill-current" />
					</div>
					<div className="absolute -bottom-2 -left-6 text-blue-400 animate-bounce delay-300">
						<Sparkles className="w-5 h-5" />
					</div>
					{/* Main illustration */}
					<div className="w-32 h-32 bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 rounded-full flex items-center justify-center shadow-lg">
						<Calendar className="w-16 h-16 text-purple-600" />
					</div>
				</div>
				<div className="text-center max-w-md">
					<h3 className="text-2xl font-bold text-gray-800 mb-3">
						No Sessions Yet! 🌟
					</h3>
					<p className="text-gray-600 mb-6 leading-relaxed">
						Ready to start your first therapy session? Create one now and begin
						tracking amazing progress with your young clients!
					</p>
					<Button
						onClick={onCreateSession}
						className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
					>
						<Sparkles className="w-5 h-5 mr-2" />
						Create Your First Session
					</Button>
				</div>
				{/* Decorative bottom elements */}
				<div className="flex gap-4 mt-12 opacity-60">
					<div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
					<div className="w-3 h-3 bg-pink-300 rounded-full animate-pulse delay-150"></div>
					<div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse delay-300"></div>
					<div className="w-3 h-3 bg-green-300 rounded-full animate-pulse delay-450"></div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="pb-4 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Session Records</h1>
					<p className="text-gray-600">
						Track and review therapy session progress
					</p>
				</div>
				<Button onClick={() => setOpen(true)} variant="default">
					+ Create Session
				</Button>
			</div>

			<CreateSessionModal
				open={open}
				setOpen={setOpen}
				onSessionCreated={(sessionId) => navigate(`/room/${sessionId}`)}
			/>

			{loading ? (
				<SessionCardsSkeleton />
			) : sessions.length === 0 ? (
				<SessionsEmptyState onCreateSession={() => setOpen(true)} />
			) : (
				<SessionCards
					sessions={sessions}
					user={{ first_name: user.first_name, last_name: user.last_name }}
					onSessionDeleted={handleSessionDeleted}
				/>
			)}
		</>
	);
}
