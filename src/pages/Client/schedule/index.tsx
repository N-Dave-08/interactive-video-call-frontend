import { useAuth } from "@/hooks/useAuth";
import CalendarSchedule from "@/pages/Client/schedule/CalendarSchedule";

export default function SchedulePage() {
	const { user } = useAuth();

	return <CalendarSchedule socialWorkerId={user?.id || ""} />;
}
