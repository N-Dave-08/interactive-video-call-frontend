import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSessionsBySocialWorkerId } from "@/api/sessions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import type { Session } from "@/types/sessions";
import SessionCards from "./session-cards";
import SessionCardsSkeleton from "./session-cards-skeleton";

export default function SessionsPage() {
	const { user } = useAuth();
	const [sessions, setSessions] = useState<Session[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
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

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Session</DialogTitle>
					</DialogHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							setOpen(false);
							navigate("/room");
						}}
						className="space-y-4"
					>
						<Input
							type="text"
							placeholder="Session Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit">Create</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{loading ? (
				<SessionCardsSkeleton />
			) : (
				<SessionCards sessions={sessions} user={user} />
			)}
		</>
	);
}
