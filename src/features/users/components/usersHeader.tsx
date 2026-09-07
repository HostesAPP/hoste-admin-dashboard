"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeaderLayout } from "@/components/shared";

interface UsersHeaderProps {
  onSearchChange?: (val: string) => void;
}

export function UsersHeader({ onSearchChange }: UsersHeaderProps) {
  return (
    <PageHeaderLayout title="Users" description="All Hostes & Brands — search, view, suspend or ban" >
      {/* Filter outline pill button */}
      <Button
        variant="outline"
        size="sm"
        className="rounded-full text-xs font-medium h-9 px-3.5 gap-2 border-border text-foreground hover:bg-muted"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
        <span>Filter</span>
      </Button>

      {/* Search anything pill input */}
      <div className="relative w-48 sm:w-60">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search anything..."
          className="pl-9 h-9 text-xs rounded-full bg-muted/40 border-border/70 focus-visible:ring-primary focus-visible:ring-1"
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
    </PageHeaderLayout>
  );
}
