import { PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Icon } from "@iconify/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";


interface PieDataItem {
  name: string;
  value: number;
  key: string;
}

interface DashboardChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface SessionStatusPieChartProps {
  pieData: PieDataItem[];
  dashboardChartConfig: DashboardChartConfig;
  PIE_COLORS: string[];
}

const SessionStatusPieChart: React.FC<SessionStatusPieChartProps> = ({ pieData, dashboardChartConfig, PIE_COLORS }) => {
  return (
    <Card className="flex flex-col shadow-md rounded-xl">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-semibold text-slate-900">Session Status Overview</CardTitle>
        <CardDescription>Current distribution of session statuses</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {pieData.every((d) => d.value === 0) ? (
          <div className="flex flex-col items-center justify-center h-[250px] text-slate-400">
            <Icon icon="mdi:chart-pie" width={48} height={48} className="mb-2" />
            <span className="text-lg font-medium">No session data to display</span>
            <span className="text-sm">Session statuses will appear here once available.</span>
          </div>
        ) : (
          <ChartContainer
            config={dashboardChartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
              >
                {pieData.map((entry, idx) => (
                  <Cell
                    key={entry.name}
                    fill={PIE_COLORS[idx % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="key" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionStatusPieChart; 