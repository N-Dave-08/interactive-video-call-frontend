import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Tooltip,
} from "recharts";

interface SessionDurationChartProps {
	avgSessionDurationData: { date: string; avgDuration: number }[];
}

// Fill in missing days with zero values
const fillMissingDays = (realData: { date: string; avgDuration: number }[]) => {
	if (realData.length === 0) return [];

	const today = new Date();
	const dataMap = new Map(
		realData.map((item) => [item.date, item.avgDuration]),
	);
	const filledData = [];

	// Generate data for the past 7 days
	for (let i = 6; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(date.getDate() - i);
		const dateStr = date.toISOString().slice(0, 10);

		filledData.push({
			date: dateStr,
			avgDuration: dataMap.get(dateStr) || 0,
		});
	}

	return filledData;
};

// Custom tooltip formatter
const CustomTooltip = ({
	active,
	payload,
	label,
}: {
	active?: boolean;
	payload?: Array<{ value: number }>;
	label?: string;
}) => {
	if (active && payload && payload.length && label) {
		const date = new Date(label);
		const formattedDate = date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
			year: "numeric",
		});

		const value = payload[0].value;

		return (
			<div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
				<p className="font-medium text-gray-900">{formattedDate}</p>
				<p
					className={`font-semibold ${value === 0 ? "text-gray-500" : "text-indigo-600"}`}
				>
					{value === 0 ? "No sessions" : `${value} minutes`}
				</p>
			</div>
		);
	}
	return null;
};

export default function SessionDurationChart({
	avgSessionDurationData,
}: SessionDurationChartProps) {
	const chartData = fillMissingDays(avgSessionDurationData);

	return (
		<Card className="mb-8">
			<CardHeader>
				<CardTitle>Average Session Duration Over Time</CardTitle>
				<p className="text-muted-foreground text-sm">
					Shows the average duration (in minutes) of completed sessions per day.
					Days with no sessions show as zero.
				</p>
			</CardHeader>
			<CardContent>
				{chartData.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground text-sm">
						No session data available.
					</div>
				) : (
					<ResponsiveContainer width="100%" height={250}>
						<LineChart
							data={chartData}
							margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
						>
							<CartesianGrid strokeDasharray="3 3" vertical={false} />
							<XAxis
								dataKey="date"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={(value) => {
									const date = new Date(value);
									return date.toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
									});
								}}
								style={{ fontSize: "12px" }}
							/>
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								style={{ fontSize: "12px" }}
								tickFormatter={(value) => `${value}m`}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Line
								type="monotone"
								dataKey="avgDuration"
								stroke="#6366f1"
								strokeWidth={3}
								dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
								activeDot={{ r: 6, stroke: "#6366f1", strokeWidth: 2 }}
								connectNulls={false}
							/>
						</LineChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	);
}
