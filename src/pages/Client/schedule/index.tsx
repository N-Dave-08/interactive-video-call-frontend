import CalendarSchedule from "@/features/CalendarSchedule";
import { useAuth } from "@/hooks/useAuth";

export default function SchedulePage() {
	const { user } = useAuth();

	return (
		<div>
			Schedule
			<CalendarSchedule socialWorkerId={user?.id || ""} />
		</div>
	);
}
