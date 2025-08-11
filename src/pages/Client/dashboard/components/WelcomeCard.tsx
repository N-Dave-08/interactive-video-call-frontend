import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, TrendingUp } from "lucide-react";

interface WelcomeCardProps {
	counts: {
		scheduled: number;
		in_progress: number;
	};
	onViewSchedule: () => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
	counts,
	onViewSchedule,
}) => (
	<Card className="relative overflow-hidden shadow-xl rounded-2xl border-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 h-full">
		{/* Background decoration */}
		<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
		<div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />

		<CardHeader className="relative z-10 pb-4">
			<CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
				<Calendar className="h-6 w-6" />
				Today's Overview
			</CardTitle>
		</CardHeader>
		<CardContent className="relative z-10 space-y-6">
			<div className="space-y-4">
				<div className="flex items-center justify-between p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-white/20 rounded-lg">
							<Calendar className="h-5 w-5 text-white" />
						</div>
						<div>
							<p className="text-white/80 text-sm font-medium">
								Sessions scheduled
							</p>
							<p className="text-white text-xs">Ready to start</p>
						</div>
					</div>
					<span className="text-3xl font-bold text-white">
						{counts.scheduled}
					</span>
				</div>

				<div className="flex items-center justify-between p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-white/20 rounded-lg">
							<Clock className="h-5 w-5 text-white" />
						</div>
						<div>
							<p className="text-white/80 text-sm font-medium">
								Active sessions
							</p>
							<p className="text-white text-xs">Currently running</p>
						</div>
					</div>
					<span className="text-3xl font-bold text-white">
						{counts.in_progress}
					</span>
				</div>
			</div>

			<Button
				className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] shadow-lg"
				onClick={onViewSchedule}
			>
				<CheckCircle className="h-4 w-4 mr-2" />
				View Schedule
			</Button>

			<div className="flex items-center gap-2 text-white/70 text-sm">
				<TrendingUp className="h-4 w-4" />
				<span>Stay organized and focused</span>
			</div>
		</CardContent>
	</Card>
);

export default WelcomeCard;
