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
			) : (
				<SessionCards sessions={sessions} user={user} />
			)}
		</>
	);
}
