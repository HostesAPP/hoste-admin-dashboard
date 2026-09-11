import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TopPerformingBrandItem } from "../types/brand-users.types";

interface TopPerformingBrandsTableProps {
  brands: TopPerformingBrandItem[];
}

export const TopPerformingBrandsTable: React.FC<TopPerformingBrandsTableProps> = ({ brands }) => {
  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-foreground">
          Top Performing Brand Users
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Highest spending and most active enterprise and corporate brands on Hosté
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="border-y border-border bg-muted/20 text-muted-foreground font-semibold uppercase text-[10px] tracking-wider whitespace-nowrap">
                <th className="py-2.5 px-4 w-12 text-center">RANK</th>
                <th className="py-2.5 px-4">BRAND / USER</th>
                <th className="py-2.5 px-4">TOTAL BOOKINGS</th>
                <th className="py-2.5 px-4">COMPLETED</th>
                <th className="py-2.5 px-4">TOTAL SPENDING (₦)</th>
                <th className="py-2.5 px-4">AVG BOOKING VALUE</th>
                <th className="py-2.5 px-4">LAST ACTIVITY</th>
                <th className="py-2.5 px-4 text-center">STATUS</th>
                <th className="py-2.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 whitespace-nowrap">
              {brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3.5 px-4 text-center font-bold text-primary text-xs">
                    #{brand.rank}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          brand.name.includes("Heineken")
                            ? "bg-secondary text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {brand.initial}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{brand.name}</p>
                        <p className="text-[11px] text-muted-foreground">{brand.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    {brand.totalBookings}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-secondary">
                    {brand.completed}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-foreground">
                    {brand.totalSpending}
                  </td>
                  <td className="py-3.5 px-4 text-foreground">
                    {brand.avgBookingValue}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {brand.lastActivity}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full border border-secondary/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-3 text-xs font-semibold text-primary border-primary/40 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors cursor-pointer"
                    >
                      View Profile
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
