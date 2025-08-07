import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface RescheduleSessionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onReschedule: (e: React.FormEvent) => void;
	loading?: boolean;
	error?: string | null;
	date: Date | undefined;
	time: string;
	setDate: (date: Date | undefined) => void;
	setTime: (time: string) => void;
	clearError?: () => void;
}

export const RescheduleSessionDialog: React.FC<
	RescheduleSessionDialogProps
> = ({
	open,
	onOpenChange,
	onReschedule,
	loading = false,
	error,
	date,
	time,
	setDate,
	setTime,
}) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent onClick={(e) => e.stopPropagation()}>
			<DialogHeader>
				<DialogTitle>Reschedule Session</DialogTitle>
				<DialogDescription>
					Pick a new date and time for this session.
				</DialogDescription>
			</DialogHeader>
			<form onSubmit={onReschedule}>
				<div className="grid gap-4 py-2">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="reschedule-date" className="text-right">
							Date
						</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
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
									onSelect={(date) => setDate(date ?? undefined)}
									disabled={(date) =>
										isBefore(startOfDay(date), startOfDay(new Date()))
									}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="reschedule-time" className="text-right">
							Time
						</Label>
						<Input
							id="reschedule-time"
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
				</div>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={loading}>
						{loading ? "Rescheduling..." : "Reschedule"}
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
);

export default RescheduleSessionDialog;
