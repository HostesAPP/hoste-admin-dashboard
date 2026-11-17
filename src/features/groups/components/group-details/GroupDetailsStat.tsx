"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import type { Group } from "../../types/groups.types";

export const GroupDetailsStat = ({ group }: { group: Group }) => {
  const membersCount =
    group.memberCount ??
    group.membersCount ??
    (Array.isArray(group.members) ? group.members.length : 0);

  const bookingsCount =
    group.bookingCount ??
    group.bookingsCount ??
    group.engagementsCount ??
    (Array.isArray(group.engagements) ? group.engagements.length : 0);

  const rating =
    group.rating !== undefined && group.rating !== null
      ? typeof group.rating === "number"
        ? group.rating.toFixed(1)
        : String(group.rating)
      : "—";

  const leaderEarnings =
    group.leaderEarnings !== undefined && group.leaderEarnings !== null
      ? typeof group.leaderEarnings === "number"
        ? `₦${group.leaderEarnings.toLocaleString()}`
        : String(group.leaderEarnings)
      : "₦0";

  const stats = [
    {
      title: "Total Members",
      value: membersCount,
      subtitle: "Current group members",
      isRating: false,
    },
    {
      title: "Total Bookings",
      value: bookingsCount,
      subtitle: "Associated group bookings",
      isRating: false,
    },
    {
      title: "Group Rating",
      value: rating,
      subtitle: "Average customer rating",
      isRating: rating !== "—",
    },
    {
      title: "Leader Earnings",
      value: leaderEarnings,
      subtitle: "Attributed to group leader",
      isRating: false,
    },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="border border-border bg-card hover:shadow-xs transition-all duration-200 rounded-xl"
        >
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs font-semibold text-muted-foreground tracking-wide block">
              {stat.title}
            </span>
            <div className="flex items-center gap-1.5 my-1">
              <span className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight truncate">
                {stat.value}
              </span>
              {stat.isRating && (
                <Star className="w-5 h-5 fill-amber-400 text-amber-400 shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};
