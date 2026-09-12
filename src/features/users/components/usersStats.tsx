"use client";

import type { UserStats } from "../types/users.types";

interface UsersStatsProps {
  stats: UserStats;
}

export function UsersStats({ stats }: UsersStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {/* Total Users */}
      <div className="bg-card rounded-md border border-border/80 p-5 shadow-xs flex flex-col justify-between h-25 transition-shadow hover:shadow-sm">
        <span className="text-xs font-normal text-muted-foreground">
          Total Users
        </span>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {stats.totalUsers.count.toLocaleString()}
          </span>
          <span className="text-xs font-bold text-success whitespace-nowrap">
            +{stats.totalUsers.growthPercent}% {stats.totalUsers.growthPeriod}
          </span>
        </div>
      </div>

      {/* Hostés */}
      <div className="bg-card rounded-md border border-border/80 p-5 shadow-xs flex flex-col justify-between h-25 transition-shadow hover:shadow-sm">
        <span className="text-xs font-normal text-muted-foreground">
          Hostés
        </span>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {stats.hostes.count.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {stats.hostes.subtitle}
          </span>
        </div>
      </div>

      {/* Customers */}
      <div className="bg-card rounded-md border border-border/80 p-5 shadow-xs flex flex-col justify-between h-25 transition-shadow hover:shadow-sm">
        <span className="text-xs font-normal text-muted-foreground">
          Customers
        </span>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {stats.customers.count.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {stats.customers.subtitle}
          </span>
        </div>
      </div>

      {/* Admins & Staff */}
      <div className="bg-card rounded-md border border-border/80 p-5 shadow-xs flex flex-col justify-between h-25 transition-shadow hover:shadow-sm">
        <span className="text-xs font-normal text-muted-foreground">
          Admins & Staff
        </span>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {stats.adminsAndStaff.count.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {stats.adminsAndStaff.subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}
