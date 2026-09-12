"use client";

import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import type { TopPerformingHosteItem } from "../types/hostes.types";

interface TopPerformingHostesTableProps {
  topPerformers: TopPerformingHosteItem[];
}

export const TopPerformingHostesTable: React.FC<TopPerformingHostesTableProps> = ({
  topPerformers,
}) => {
  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-soft space-y-3">
      <div>
        <h3 className="text-base font-bold text-foreground">
          Top Performing Hostés
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Ranked by overall booking fulfillment, user rating, and earnings
        </p>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-border/70">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <th className="py-3 px-4">RANK</th>
              <th className="py-3 px-4">HOSTÉ</th>
              <th className="py-3 px-4">TOTAL BOOKINGS</th>
              <th className="py-3 px-4">COMPLETED</th>
              <th className="py-3 px-4">COMPLETION RATE</th>
              <th className="py-3 px-4">TOTAL EARNINGS</th>
              <th className="py-3 px-4">AVG RATING</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs">
            {topPerformers.map((hoste) => (
              <tr key={hoste.id} className="hover:bg-muted/30 transition-colors">
                {/* RANK */}
                <td className="py-3.5 px-4 font-bold text-foreground">
                  <span className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-extrabold">
                    {hoste.rank}
                  </span>
                </td>

                {/* HOSTE */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] ${hoste.avatarColor}`}
                    >
                      {hoste.initials}
                    </div>
                    <span className="font-bold text-foreground">
                      {hoste.name}
                    </span>
                  </div>
                </td>

                {/* TOTAL BOOKINGS */}
                <td className="py-3.5 px-4 font-medium text-foreground">
                  {hoste.totalBookings}
                </td>

                {/* COMPLETED */}
                <td className="py-3.5 px-4 font-bold text-secondary">
                  {hoste.completed}
                </td>

                {/* COMPLETION RATE */}
                <td className="py-3.5 px-4 font-bold text-secondary">
                  {hoste.completionRate}
                </td>

                {/* TOTAL EARNINGS */}
                <td className="py-3.5 px-4 font-extrabold text-foreground">
                  {hoste.totalEarnings}
                </td>

                {/* AVG RATING */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1 font-bold text-foreground">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{hoste.avgRating}</span>
                  </div>
                </td>

                {/* STATUS */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20">
                    {hoste.status}
                  </span>
                </td>

                {/* ACTION */}
                <td className="py-3.5 px-4 text-right">
                  <Link
                    href={`/profiles`}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    View Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
