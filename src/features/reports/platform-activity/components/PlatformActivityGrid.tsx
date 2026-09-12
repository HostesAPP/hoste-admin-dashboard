"use client";

import React from "react";
import { UserActivityBreakdownCard } from "./UserActivityBreakdownCard";
import { PlatformEngagementCard } from "./PlatformEngagementCard";
import { BookingActivityOverviewCard } from "./BookingActivityOverviewCard";
import { ActivityByPlatformAreaCard } from "./ActivityByPlatformAreaCard";
import type {
  UserActivityBreakdownItem,
  EngagementTrendPoint,
  BookingVelocityPoint,
  PlatformAreaActivityItem,
} from "../types/platform-activity.types";

interface PlatformActivityGridProps {
  userBreakdown: UserActivityBreakdownItem[];
  engagementSparkline: EngagementTrendPoint[];
  bookingVelocityData: BookingVelocityPoint[];
  platformAreaData: PlatformAreaActivityItem[];
}

export const PlatformActivityGrid: React.FC<PlatformActivityGridProps> = ({
  userBreakdown,
  engagementSparkline,
  bookingVelocityData,
  platformAreaData,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Top Left: User Activity Breakdown */}
      <UserActivityBreakdownCard items={userBreakdown} />

      {/* Top Right: Platform Engagement */}
      <PlatformEngagementCard sparklineData={engagementSparkline} />

      {/* Bottom Left: Booking Activity Overview */}
      <BookingActivityOverviewCard velocityData={bookingVelocityData} />

      {/* Bottom Right: Activity by Platform Area */}
      <ActivityByPlatformAreaCard items={platformAreaData} />
    </div>
  );
};
