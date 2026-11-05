"use client";

import { Search, Download, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeaderLayout } from "@/components/shared";

interface ProfilesHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onExport?: () => void;
  isExporting?: boolean;
}

export function ProfilesHeader({
  searchQuery,
  onSearchChange,
  onExport,
  isExporting,
}: ProfilesHeaderProps) {
  return (
    <PageHeaderLayout title="Profiles" description="Host profile approvals & account management">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email, profile ..."
          className="pl-9 pr-4 h-9 text-xs rounded-full bg-muted/40 border-border/70 focus-visible:ring-primary focus-visible:ring-1 transition-colors w-64"
        />
      </div>

      {/* Export CSV Button */}
      {onExport && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={isExporting}
          className="h-9 px-3.5 text-xs font-semibold rounded-full border-border/80 hover:bg-muted transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          {isExporting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5 text-muted-foreground" />
          )}
          <span>Export CSV</span>
        </Button>
      )}
    </PageHeaderLayout>
  );
}
