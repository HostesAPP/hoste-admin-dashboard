"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Group } from "../../types/groups.types";

export const GroupDetailsStat = ({ group }: { group: Group }) => {
  const membersCount = group.memberCount ?? group.membersCount ?? "—";
  const bookingsCount = group.bookingCount ?? group.bookingsCount ?? group.engagementsCount ?? "—";

  const stats = [
    {
      title: "Total Members",
      value: membersCount,
      subtitle: "Registered group members",
    },
    {
      title: "Total Bookings",
      value: bookingsCount,
      subtitle: "Attributed group engagements",
    },
    {
      title: "Category",
      value: group.category || "General",
      subtitle: "Group classification",
    },
    {
      title: "Operational Status",
      value: group.status || "Active",
      subtitle: "Current operational state",
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
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight truncate">
                {stat.value}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {stat.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};