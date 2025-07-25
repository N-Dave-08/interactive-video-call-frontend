import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import ChildAvatar from "@/components/ChildAvatar";
import React from "react";

interface UpcomingSessionsListProps {
  sessions: any[];
  navigate: (path: string, options?: any) => void;
  getDisplayName: (first?: string, last?: string) => string;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
}

const UpcomingSessionsList: React.FC<UpcomingSessionsListProps> = ({
  sessions,
  navigate,
  getDisplayName,
  formatDate,
  formatTime,
}) => (
  <Card className="shadow-md rounded-xl h-full">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold text-slate-900">Upcoming Sessions</CardTitle>
          <CardDescription className="text-slate-500">Next appointments</CardDescription>
        </div>
        <Button
          variant="ghost"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={() => navigate("/sessions")}
        >
          View all sessions
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </CardHeader>
    <CardContent className="px-0">
      <div className="divide-y divide-slate-100">
        {sessions.slice(0, 4).map((session) => (
          <button
            key={session.session_id}
            type="button"
            className="w-full text-left p-4 hover:bg-slate-50 transition-colors cursor-pointer bg-transparent border-0"
            onClick={() =>
              navigate(`/sessions/${session.session_id}`, {
                state: { session },
              })
            }
          >
            <div className="flex items-center space-x-3">
              <ChildAvatar
                size={56}
                avatar_data={{
                  ...session.avatar_data,
                  first_name: session.child_data.first_name,
                  last_name: session.child_data.last_name,
                }}
                className="h-12 w-12"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">
                  {getDisplayName(session.child_data.first_name, session.child_data.last_name)}
                </p>
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <span>{formatDate(session.start_time)}</span>
                  <span>•</span>
                  <span>{formatTime(session.start_time)}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          </button>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default UpcomingSessionsList; 