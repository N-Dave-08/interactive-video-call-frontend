import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { format, isBefore, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createSession } from "@/api/sessions";
import { useAuth } from "@/hooks/useAuth";
import { useSessionStore } from "@/store/sessionStore";
import type { Session } from "@/types";

interface CreateSessionModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	onSessionCreated: (session: Session) => void;
}

export default function CreateSessionModal({
	open,
	setOpen,
	onSessionCreated,
}: CreateSessionModalProps) {
	const { user, token } = useAuth();
	const setSessionTitle = useSessionStore((state) => state.setTitle);
	const [title, setTitle] = useState("");
	const [date, setDate] = useState<Date | undefined>();
	const [time, setTime] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (open) {
			const now = new Date();
			setDate(now);
			// Format time as HH:mm
			const pad = (n: number) => n.toString().padStart(2, "0");
			setTime(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
		}
	}, [open]);

	const handleCreateSession = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) {
			setError("User not authenticated.");
			return;
		}
		if (!token) {
			setError("No token available.");
			return;
		}
		setSessionTitle(title);
		setLoading(true);
		setError(null);
		try {
			let startDateTime: string | undefined = undefined;
			if (date && time) {
				const [hours, minutes] = time.split(":");
				const dt = new Date(date);
				dt.setHours(Number(hours));
				dt.setMinutes(Number(minutes));
				startDateTime = dt.toISOString();
			}
			const payload = {
				social_worker_id: user.id,
				title,
				start_time: startDateTime,
				status:
					startDateTime && new Date(startDateTime) > new Date()
						? "scheduled"
						: "in_progress",
				child_data: {
					first_name: "",
					last_name: "",
					age: 0,
					birthday: "",
					gender: "",
				},
				avatar_data: {
					hair: "/avatar-assets/hairs/HairB1.png",
					head: "/avatar-assets/heads/default-head-clear.png",
					expression: "/avatar-assets/expressions/F1.png",
					clothes: "/avatar-assets/clothes/boy-uniform.png",
					background: "/avatar-assets/bg/bg1.jpg",
				},
				emotional_expression: {
					method: "",
					drawing_data: "",
					selected_feelings: [],
					body_map_annotations: [],
				},
				session_notes: "",
				tags: [],
				stage: "welcome",
			};
			const session = await createSession(payload, token);
			setOpen(false);
			onSessionCreated(session.data);
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
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create New Session</DialogTitle>
					<DialogDescription>
						Fill in the session details below to create a new session.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleCreateSession} className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="title" className="text-right">
							Title
						</Label>
						<Input
							id="title"
							type="text"
							placeholder="Session Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="session-date" className="text-right">
							Date
						</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={"outline"}
									className={cn(
										"col-span-3 justify-start text-left font-normal",
										!date && "text-muted-foreground",
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{date ? format(date, "PPP") : <span>Pick a date</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={date}
									onSelect={setDate}
									disabled={(date) =>
										isBefore(startOfDay(date), startOfDay(new Date()))
									}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="session-time" className="text-right">
							Time
						</Label>
						<Input
							id="session-time"
							type="time"
							placeholder="Time"
							value={time}
							onChange={(e) => setTime(e.target.value)}
							className="col-span-3"
						/>
					</div>
					{error && (
						<div className="text-red-500 text-sm text-center">{error}</div>
					)}
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
			</DialogContent>
		</Dialog>
	);
}
