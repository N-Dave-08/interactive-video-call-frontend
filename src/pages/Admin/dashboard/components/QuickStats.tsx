import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Label, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartStyle,
} from "@/components/ui/chart";
import { Icon } from "@iconify/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserStats } from "@/api/users";
import { useAuth } from "@/hooks/useAuth";
import SpinnerLoading from "@/components/ui/spinner-loading";

export default function QuickStats() {
	const id = "quick-stats-interactive";
	const { token } = useAuth();

	// Time period options
	const timePeriods = [
		{ key: "all", label: "All Time" },
		{ key: "weekly", label: "Weekly" },
		{ key: "monthly", label: "Monthly" },
		{ key: "last3months", label: "Last 3 Months" },
	];

	const [activeTimePeriod, setActiveTimePeriod] = React.useState("all");

	// Fetch user statistics based on selected period
	const { data: periodData, isLoading } = useQuery({
		queryKey: ["user-stats", activeTimePeriod],
		queryFn: () => {
			if (!token) throw new Error("No token available");
			return fetchUserStats(activeTimePeriod, token);
		},
		enabled: !!token,
	});

	// Use period data from API
	const statsData = periodData;

	// Prepare pie chart data - representing actual user counts by status
	const chartData = [
		{
			stat: "approved",
			value: statsData?.approvedCount || 0,
			fill: "var(--color-approved)",
		},
		{
			stat: "pending",
			value: statsData?.pendingCount || 0,
			fill: "var(--color-pending)",
		},
		{
			stat: "rejected",
			value: statsData?.rejectedCount || 0,
			fill: "var(--color-rejected)",
		},
		{
			stat: "blocked",
			value: statsData?.blockedCount || 0,
			fill: "var(--color-blocked)",
		},
		// Note: needForApprovalCount is not available in the API response
		// {
		// 	stat: "needApproval",
		// 	value: statsData?.needForApprovalCount || 0,
		// 	fill: "var(--color-needApproval)",
		// },
	];

	const chartConfig = {
		approved: {
			label: "Approved Users",
			color: "var(--chart-2)",
		},
		pending: {
			label: "Pending Users",
			color: "var(--chart-3)",
		},
		rejected: {
			label: "Rejected Users",
			color: "var(--chart-1)",
		},
		blocked: {
			label: "Blocked Users",
			color: "var(--chart-4)",
		},
		// needApproval: {
		// 	label: "Need Approval",
		// 	color: "var(--chart-5)",
		// },
	};

	const [activeIndex] = React.useState(0);

	// Calculate total users
	const totalUsers = chartData.reduce((acc, curr) => acc + curr.value, 0);

	// Calculate approval rate
	const approvalRate =
		totalUsers > 0
			? (((statsData?.approvedCount || 0) / totalUsers) * 100).toFixed(2)
			: "0.00";

	return (
		<Card data-chart={id} className="flex flex-col">
			<ChartStyle id={id} config={chartConfig} />
			<CardHeader className="flex-row items-start space-y-0 pb-0">
				<div className="grid gap-1">
					<CardTitle>Quick Stats</CardTitle>
					<CardContent className="text-sm text-muted-foreground">
						System Overview
					</CardContent>
				</div>
				<Select value={activeTimePeriod} onValueChange={setActiveTimePeriod}>
					<SelectTrigger
						className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
						aria-label="Select time period"
					>
						<SelectValue placeholder="Select period" />
					</SelectTrigger>
					<SelectContent align="end" className="rounded-xl">
						{timePeriods.map((period) => (
							<SelectItem
								key={period.key}
								value={period.key}
								className="rounded-lg [&_span]:flex"
							>
								<div className="flex items-center gap-2 text-xs">
									<span className="flex h-3 w-3 shrink-0 rounded-xs bg-blue-500" />
									{period.label}
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				{isLoading ? (
					<div className="flex flex-col items-center justify-center h-[250px]">
						<SpinnerLoading />
						<span className="text-sm text-muted-foreground mt-2">
							Loading stats...
						</span>
					</div>
				) : totalUsers === 0 ? (
					<div className="flex flex-col items-center justify-center h-[250px] text-slate-400">
						<Icon
							icon="mdi:chart-pie"
							width={48}
							height={48}
							className="mb-2"
						/>
						<span className="text-lg font-medium">No data to display</span>
						<span className="text-sm">
							Stats will appear here once available.
						</span>
					</div>
				) : (
					<ChartContainer
						config={chartConfig}
						className="mx-auto aspect-square max-h-[350px]"
					>
						<PieChart>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel />}
							/>
							<Pie
								data={chartData}
								dataKey="value"
								nameKey="stat"
								innerRadius={60}
								strokeWidth={5}
								activeIndex={activeIndex}
								activeShape={({
									outerRadius = 0,
									...props
								}: PieSectorDataItem) => (
									<g>
										<Sector {...props} outerRadius={outerRadius + 10} />
										<Sector
											{...props}
											outerRadius={outerRadius + 25}
											innerRadius={outerRadius + 12}
										/>
									</g>
								)}
							>
								<Label
									content={({ viewBox }) => {
										if (viewBox && "cx" in viewBox && "cy" in viewBox) {
											return (
												<text
													x={viewBox.cx}
													y={viewBox.cy}
													textAnchor="middle"
													dominantBaseline="middle"
												>
													<tspan
														x={viewBox.cx}
														y={viewBox.cy}
														className="fill-foreground text-3xl font-bold"
													>
														{totalUsers.toLocaleString()}
													</tspan>
													<tspan
														x={viewBox.cx}
														y={(viewBox.cy || 0) + 24}
														className="fill-muted-foreground"
													>
														Total Users
													</tspan>
												</text>
											);
										}
									}}
								/>
							</Pie>
						</PieChart>
					</ChartContainer>
				)}
			</CardContent>
			<CardContent className="flex-col gap-2 text-sm text-center">
				<div className="flex items-center gap-2 leading-none font-medium justify-center">
					Approval Rate: {approvalRate}%{" "}
					{parseFloat(approvalRate) > 50 ? (
						<TrendingUp className="h-4 w-4" />
					) : (
						<TrendingDown className="h-4 w-4" />
					)}
				</div>
				<div className="text-muted-foreground leading-none">
					Showing user distribution by status
				</div>
			</CardContent>
		</Card>
	);
}
