import { Card, CardContent } from "@/components/ui/card";
import { FileText, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StatisticsCardsProps {
	totalSessions: number;
	counts: {
		in_progress: number;
		completed: number;
	};
	completionRate: number;
	monthlyChange: number;
	monthlyChangeText: string;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
	totalSessions,
	counts,
	completionRate,
	monthlyChange,
	monthlyChangeText,
}) => (
	<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
		<Card className="group relative overflow-hidden shadow-lg rounded-2xl border-0 bg-gradient-to-br from-slate-50 to-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
			{/* Background decoration */}
			<div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full blur-xl" />

			<CardContent className="relative z-10 p-6">
				<div className="flex items-center justify-between mb-4">
					<div>
						<p className="text-sm font-semibold text-slate-600 mb-1 uppercase tracking-wide">
							Total Sessions
						</p>
						<p className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
							{totalSessions}
						</p>
					</div>
					<div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
						<FileText className="h-7 w-7 text-white" />
					</div>
				</div>
				<div className="flex items-center gap-2">
					<TrendingUp
						className={`h-4 w-4 ${monthlyChange >= 0 ? "text-emerald-500" : "text-red-500"}`}
					/>
					<span
						className={`text-sm font-medium ${monthlyChange >= 0 ? "text-emerald-600" : "text-red-600"}`}
					>
						{monthlyChangeText}
					</span>
				</div>
			</CardContent>
		</Card>

		<Card className="group relative overflow-hidden shadow-lg rounded-2xl border-0 bg-gradient-to-br from-slate-50 to-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
			{/* Background decoration */}
			<div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/10 to-amber-600/10 rounded-full blur-xl" />

			<CardContent className="relative z-10 p-6">
				<div className="flex items-center justify-between mb-4">
					<div>
						<p className="text-sm font-semibold text-slate-600 mb-1 uppercase tracking-wide">
							In Progress
						</p>
						<p className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
							{counts.in_progress}
						</p>
					</div>
					<div className="h-14 w-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
						<Clock className="h-7 w-7 text-white" />
					</div>
				</div>
				<div className="space-y-2">
					<Progress value={completionRate} className="h-3 bg-slate-200" />
					<span className="text-sm text-slate-500 font-medium">
						{completionRate}% completion rate
					</span>
				</div>
			</CardContent>
		</Card>

		<Card className="group relative overflow-hidden shadow-lg rounded-2xl border-0 bg-gradient-to-br from-slate-50 to-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
			{/* Background decoration */}
			<div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/10 to-emerald-600/10 rounded-full blur-xl" />

			<CardContent className="relative z-10 p-6">
				<div className="flex items-center justify-between mb-4">
					<div>
						<p className="text-sm font-semibold text-slate-600 mb-1 uppercase tracking-wide">
							Completed
						</p>
						<p className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
							{counts.completed}
						</p>
					</div>
					<div className="h-14 w-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
						<CheckCircle className="h-7 w-7 text-white" />
					</div>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm text-slate-500 font-medium">
						{completionRate}% success rate
					</span>
				</div>
			</CardContent>
		</Card>
	</div>
);

export default StatisticsCards;
