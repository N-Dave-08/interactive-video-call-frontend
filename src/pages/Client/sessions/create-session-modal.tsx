import type React from "react";
import { useState } from "react";
import { createSession } from "@/api/sessions";
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
import { useSessionStore } from "@/store/sessionStore";

interface CreateSessionModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	onSessionCreated: (sessionId: string) => void;
}

export default function CreateSessionModal({
	open,
	setOpen,
	onSessionCreated,
}: CreateSessionModalProps) {
	const { user } = useAuth();
	const setSessionTitle = useSessionStore((state) => state.setTitle);
	const [title, setTitle] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleCreateSession = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;
		setSessionTitle(title);
		setLoading(true);
		setError(null);
		try {
			const payload = {
				social_worker_id: user.id,
				title,
				child_data: {
					first_name: "",
					last_name: "",
					age: 0,
					birthday: "",
				},
				avatar_data: {
					hair: "default",
					head: "default",
					expression: "default",
					clothes: "default",
					background: "default",
				},
				emotional_expression: {
					method: "",
					drawing_data: "",
					selected_feelings: [],
					body_map_annotations: [],
				},
				session_notes: "",
				tags: [],
				stage: "Stage 1",
			};
			const session = await createSession(payload);
			setOpen(false);
			onSessionCreated(session.data.session_id);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message || "Failed to create session");
			} else {
				setError("Failed to create session");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Session</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleCreateSession} className="space-y-4">
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
						<Button type="submit" disabled={loading}>
							{loading ? "Creating..." : "Create"}
						</Button>
					</DialogFooter>
				</form>
				{error && <div className="text-red-500 mt-2">{error}</div>}
			</DialogContent>
		</Dialog>
	);
}
