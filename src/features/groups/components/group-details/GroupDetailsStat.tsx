"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { getGroupEngagements, getGroupMembers, type Group } from "@/features/groups";

export const GroupDetailsStat = ({ group }: { group: Group }) => {
  const membersCount = getGroupMembers(group.id)?.length || 124;
  const bookingsCount = getGroupEngagements(group.id)?.length || 342;

  const stats = [
    {
      title: "Total Members",
      value: membersCount > 0 ? membersCount : 124,
      subtitle: "Current group members",
      isRating: false,
      isCurrency: false,
    },
    {
      title: "Total Bookings",
      value: bookingsCount > 0 ? bookingsCount : 342,
      subtitle: "Associated group bookings",
      isRating: false,
      isCurrency: false,
    },
    {
      title: "Group Rating",
      value: "4.9",
      subtitle: "Average customer rating",
      isRating: true,
      isCurrency: false,
    },
    {
      title: "Leader Earnings",
      value: "480,000",
      subtitle: "Attributed to group leader",
      isRating: false,
      isCurrency: true,
    },
  ];

  return (
    <section className="grid grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="border border-border bg-card hover:shadow-sm transition-all duration-200 rounded-md"
        >
          <CardContent className="px-5">
            <span className="text-xs font-medium text-muted-foreground tracking-wide">
              {stat.title}
            </span>
            <div className="flex items-baseline gap-1.5">
              {stat.isCurrency && (
                <span className="text-2xl sm:text-3xl font-bold text-foreground">
                  ₦
                </span>
              )}
              <span className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {stat.value}
              </span>
              {stat.isRating && (
                <Star className="w-5 h-5 fill-yellow text-yellow inline -mt-1 ml-0.5" />
              )}
            </div>
            <p className="text-xs text-muted-foreground pt-0.5">
              {stat.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};