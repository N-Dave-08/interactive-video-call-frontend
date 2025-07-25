import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";


interface WelcomeCardProps {
  counts: {
    scheduled: number;
    in_progress: number;
  };
  onViewSchedule: () => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ counts, onViewSchedule }) => (
  <Card className="shadow-md rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 h-full flex flex-col justify-between">
    <CardHeader>
      <CardTitle className="text-xl font-semibold text-slate-900">Today's Overview</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-600">Sessions scheduled</span>
          <span className="text-2xl font-bold text-blue-600">{counts.scheduled}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Active sessions</span>
          <span className="text-lg font-semibold text-amber-600">{counts.in_progress}</span>
        </div>
      </div>
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm"
        onClick={onViewSchedule}
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        View Schedule
      </Button>
    </CardContent>
  </Card>
);

export default WelcomeCard; 