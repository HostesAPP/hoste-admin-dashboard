"use client";

import { Button } from "@/components/ui/button";
import type { User } from "../types/users.types";
import { cn } from "@/lib/utils";

interface UserAccountActionsCardProps {
  user: User;
  onOpenSuspend: () => void;
  onOpenDeactivate: () => void;
  onOpenChangeRole: () => void;
}

export function UserAccountActionsCard({
  user,
  onOpenSuspend,
  onOpenDeactivate,
  onOpenChangeRole,
}: UserAccountActionsCardProps) {
  const isActive = user.status === "Active";
  const roleLabel = user.type === "Admin" ? "Admin" : "User";

  return (
    <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground">Account Actions</h3>
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
              isActive
                ? "bg-success/15 text-success border-success/30"
                : "bg-destructive/15 text-destructive border-destructive/30"
            )}
          >
            {user.status}
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {/* Suspend button */}
          <Button
            type="button"
            variant="outline"
            onClick={onOpenSuspend}
            className="w-full bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/20 font-semibold text-xs sm:text-sm h-10 rounded-lg cursor-pointer"
          >
            {isActive ? `Suspend ${roleLabel}` : `Activate ${roleLabel}`}
          </Button>

          {/* Deactivate button */}
          <Button
            type="button"
            variant="outline"
            onClick={onOpenDeactivate}
            className="w-full border-border/80 hover:bg-muted text-foreground font-semibold text-xs sm:text-sm h-10 rounded-lg cursor-pointer"
          >
            {`Deactivate ${roleLabel}`}
          </Button>

          {/* Change role button */}
          <Button
            type="button"
            variant="outline"
            onClick={onOpenChangeRole}
            className="w-full border-border/80 hover:bg-muted text-foreground font-semibold text-xs sm:text-sm h-10 rounded-lg cursor-pointer"
          >
            Change Role
          </Button>
        </div>
      </div>
    </div>
  );
}
