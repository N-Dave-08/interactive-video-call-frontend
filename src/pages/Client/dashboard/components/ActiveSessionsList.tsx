import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ChildAvatar from "@/components/ChildAvatar";
import React from "react";

interface ActiveSessionsListProps {
  sessions: any[];
  navigate: (path: string, options?: any) => void;
  getDisplayName: (first?: string, last?: string) => string;
  formatTime: (dateString: string) => string;
  getStatusColor: (status: string) => string;
}

const ActiveSessionsList: React.FC<ActiveSessionsListProps> = ({
  sessions,
  navigate,
  getDisplayName,
  formatTime,
  getStatusColor,
}) => (
  <Card className="shadow-md rounded-xl">
    <CardHeader>
      <CardTitle className="text-xl font-semibold text-slate-900">Active Sessions</CardTitle>
      <CardDescription className="text-slate-500">Currently in progress</CardDescription>
    </CardHeader>
    <CardContent className="px-0">
      <div className="divide-y divide-slate-100 h-full overflow-y-auto">
        {sessions
          .filter((session) => session.status === "in_progress")
          .map((session) => (
            <button
              key={session.session_id}
              type="button"
              className="w-full text-left p-6 hover:bg-slate-50 transition-colors cursor-pointer bg-transparent border-0"
              onClick={() =>
                navigate(`/sessions/${session.session_id}`, {
                  state: { session },
                })
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <ChildAvatar
                    size={90}
                    avatar_data={{
                      ...session.avatar_data,
                      first_name: session.child_data.first_name,
                      last_name: session.child_data.last_name,
                    }}
                    className="h-16 w-16 ring-2 ring-slate-100"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {getDisplayName(session.child_data.first_name, session.child_data.last_name)}
                    </h4>
                    <p className="text-sm text-slate-500 mb-1">{session.title}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span>Age: {session.child_data.age}</span>
                      <span>•</span>
                      <span>Gender: {session.child_data.gender || "N/A"}</span>
                      <span>•</span>
                      <span>{session.stage}</span>
                      <span>•</span>
                      <span>{formatTime(session.start_time)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {session.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600">
                      {tag}
                    </Badge>
                  ))}
                  <Badge className={getStatusColor(session.status)} variant="outline">
                    {session.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </button>
          ))}
      </div>
    </CardContent>
  </Card>
);

export default ActiveSessionsList; 