"use client";

import { CheckCircle2, RefreshCw, AlertCircle, Send } from "lucide-react";
import type { User, UserRecentActivityItem } from "../types/users.types";
import { cn } from "@/lib/utils";

interface UserRecentActivityCardProps {
  user: User;
  onViewFullActivity?: () => void;
}

const defaultActivities: UserRecentActivityItem[] = [
  {
    id: "1",
    title: "Approved Hosté Profile",
    description: "Amaka Okafor's profile was approved.",
    timestamp: "Today • 10:20 AM",
    type: "approved",
  },
  {
    id: "2",
    title: "Updated Booking",
    description: "Booking #BK-10482 was updated.",
    timestamp: "Yesterday • 4:15 PM",
    type: "updated",
  },
  {
    id: "3",
    title: "Suspended User",
    description: "Blessing Eze's account was suspended.",
    timestamp: "August 19, 2026 • 2:30 PM",
    type: "suspended",
  },
  {
    id: "4",
    title: "Sent Notification",
    description: "Platform announcement sent to 1,284 users.",
    timestamp: "August 18, 2026 • 11:05 AM",
    type: "notification",
  },
];

export function UserRecentActivityCard({
  user,
  onViewFullActivity,
}: UserRecentActivityCardProps) {
  const activities = user.recentActivities?.length
    ? user.recentActivities
    : defaultActivities;

  const getIcon = (type: UserRecentActivityItem["type"]) => {
    switch (type) {
      case "approved":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "updated":
        return <RefreshCw className="w-3.5 h-3.5 text-success" />;
      case "suspended":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case "notification":
        return <Send className="w-3.5 h-3.5 text-sky-500" />;
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-bold text-foreground mb-4">Recent Activity</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activities.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between p-3 rounded-lg bg-muted/20 border border-border/50 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                      item.type === "approved" && "bg-success/15",
                      item.type === "updated" && "bg-success/15",
                      item.type === "suspended" && "bg-destructive/15",
                      item.type === "notification" && "bg-sky-500/15"
                    )}
                  >
                    {getIcon(item.type)}
                  </div>
                  <span className="font-bold text-foreground text-xs leading-tight">
                    {item.title}
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-snug">
                  {item.description}
                </p>
              </div>

              <span className="text-[10px] text-muted-foreground mt-2 block font-normal">
                {item.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom link */}
      <div className="pt-3 text-right">
        <button
          type="button"
          onClick={onViewFullActivity}
          className="text-xs font-semibold text-foreground hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <span>View Full Activity</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
