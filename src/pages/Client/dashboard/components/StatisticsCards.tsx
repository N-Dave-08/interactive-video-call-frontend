import { Card, CardContent } from "@/components/ui/card";
import { FileText, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import React from "react";

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
  <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card className="shadow-md rounded-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Total Sessions</p>
            <p className="text-3xl font-bold text-slate-900">{totalSessions}</p>
          </div>
          <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <TrendingUp className={`h-4 w-4 mr-1 ${monthlyChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
          <span className={`text-sm font-medium ${monthlyChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {monthlyChangeText}
          </span>
        </div>
      </CardContent>
    </Card>
    <Card className="shadow-md rounded-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">In Progress</p>
            <p className="text-3xl font-bold text-slate-900">{counts.in_progress}</p>
          </div>
          <div className="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
        </div>
        <div className="mt-4">
          <Progress value={completionRate} className="h-2" />
          <span className="text-sm text-slate-500 mt-1">{completionRate}% completion rate</span>
        </div>
      </CardContent>
    </Card>
    <Card className="shadow-md rounded-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-slate-900">{counts.completed}</p>
          </div>
          <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-sm text-slate-500">{completionRate}% success rate</span>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default StatisticsCards; 