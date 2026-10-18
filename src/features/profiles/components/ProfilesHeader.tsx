"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeaderLayout } from "@/components/shared";

interface ProfilesHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export function ProfilesHeader({
  searchQuery,
  onSearchChange,
}: ProfilesHeaderProps) {
  return (
    < PageHeaderLayout title="Profiles" description="Host profile approvals &amp; account management" >

      {/* search input */}
      < div className="relative" >
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email, profile ..."
          className="pl-9 pr-4 h-9 text-xs rounded-full bg-muted/40 border-border/70 focus-visible:ring-primary focus-visible:ring-1 transition-colors"
        />
      </div >
    </PageHeaderLayout >

  );
}
