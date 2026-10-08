"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SettingsHeader({
  search,
  onSearch,
}: {
  search: string;
  onSearch: (value: string) => void;
}) {
  return (
    <header className="flex h-[76px] items-center justify-between gap-6 border-b border-border bg-card px-8">
      <div className="relative w-96">
        <Search
          aria-hidden="true"
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          aria-label="Search settings"
          placeholder="Search settings, configurations, logs..."
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          className="h-9 rounded-md border-0 bg-muted/70 pl-9 text-xs"
        />
      </div>
      <div className="flex items-center gap-7">
          <Button
            nativeButton={false}
          variant="ghost"
          size="icon"
          aria-label="Open notifications"
          render={<Link href="/notifications" />}
        >
          <Bell className="size-5" />
        </Button>
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback className="bg-secondary/10 text-xs font-semibold text-secondary">
              JA
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs font-semibold">John Admin</p>
            <p className="text-[11px] text-muted-foreground">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
