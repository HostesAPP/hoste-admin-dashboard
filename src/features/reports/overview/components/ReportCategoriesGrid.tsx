"use client";

import React from "react";
import Link from "next/link";
import {
  Plus,
  Calendar,
  Sparkles,
  Building2,
  Briefcase,
  Users,
  Users2,
  Activity,
  ArrowRight,
} from "lucide-react";
import type { ReportCategoryCardItem } from "../types/overview.types";

interface ReportCategoriesGridProps {
  categories: ReportCategoryCardItem[];
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case "Plus":
      return Plus;
    case "Calendar":
      return Calendar;
    case "Sparkles":
      return Sparkles;
    case "Building2":
      return Building2;
    case "Briefcase":
      return Briefcase;
    case "Users":
      return Users;
    case "Users2":
      return Users2;
    case "Activity":
      return Activity;
    default:
      return Plus;
  }
};

export const ReportCategoriesGrid: React.FC<ReportCategoriesGridProps> = ({
  categories,
}) => {
  return (
    <div className="space-y-3.5">
      <h2 className="text-base font-bold text-foreground">
        Report Categories
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const IconComponent = getCategoryIcon(cat.iconName);
          return (
            <div
              key={cat.id}
              className="bg-card border border-border/80 rounded-2xl p-5 shadow-soft flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
            >
              <div className="space-y-3">
                {/* Header: Icon & Title */}
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${cat.iconBg}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                </div>

                {/* Bullet Points */}
                <ul className="space-y-1.5 text-xs text-muted-foreground pt-1">
                  {cat.bulletPoints.map((bp) => (
                    <li key={bp} className="flex items-start gap-1.5">
                      <span className="text-muted-foreground/60">•</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* View Report Link */}
              <div className="pt-4 mt-2 border-t border-border/50">
                <Link
                  href={cat.href}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                >
                  <span>View Report</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
