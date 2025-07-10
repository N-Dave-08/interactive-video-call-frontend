import { useEffect, useState } from "react";
import { fetchSessionsBySocialWorkerId } from "@/api/sessions";
import { useAuth } from "@/hooks/useAuth";
import type { Session } from "@/types/sessions";
import SessionCards from "./session-cards";
import SessionCardsSkeleton from "./session-cards-skeleton";

export default function SessionsPage() {
	const { user } = useAuth();
	const [sessions, setSessions] = useState<Session[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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
			<div className="pb-4">
				<h1 className="text-3xl font-bold text-gray-900">Session Records</h1>
				<p className="text-gray-600">
					Track and review therapy session progress
				</p>
			</div>
			{loading ? (
				<SessionCardsSkeleton />
			) : (
				<SessionCards sessions={sessions} user={user} />
			)}
		</>
	);
}
