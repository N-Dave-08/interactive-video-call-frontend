import { useEffect, useState } from "react";
import { fetchSessionsBySocialWorkerId } from "@/api/sessions";
import { useAuth } from "@/hooks/useAuth";
import type { Session } from "@/types/sessions";
import SessionCards from "./session-cards";

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

	if (loading) return <div>Loading sessions...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!user) return null;

	return <SessionCards sessions={sessions} user={user} />;
}
