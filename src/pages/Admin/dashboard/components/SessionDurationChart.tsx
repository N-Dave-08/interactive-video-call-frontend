import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";

interface SessionDurationChartProps {
	avgSessionDurationData: { date: string; avgDuration: number }[];
}

export default function SessionDurationChart({ avgSessionDurationData }: SessionDurationChartProps) {
	return (
		<Card className="mb-8">
			<CardHeader>
				<CardTitle>Average Session Duration Over Time</CardTitle>
				<p className="text-muted-foreground text-sm">Shows the average duration (in minutes) of completed sessions per day.</p>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={{ avgDuration: { label: "Avg. Duration", color: "#6366f1" } }}
					className="aspect-auto h-[250px] w-full"
				>
					<AreaChart data={avgSessionDurationData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
						<defs>
							<linearGradient id="fillAvgDuration" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
								<stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="dot" />}
						/>
						<Area
							dataKey="avgDuration"
							type="natural"
							fill="url(#fillAvgDuration)"
							stroke="#6366f1"
							strokeWidth={2}
							activeDot={{ r: 5 }}
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
} 