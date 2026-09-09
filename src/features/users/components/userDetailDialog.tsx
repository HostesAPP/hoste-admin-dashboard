"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "../types/users.types";
import { cn } from "@/lib/utils";

interface UserDetailDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleStatus?: (user: User) => void;
}

export function UserDetailDialog({
  user,
  open,
  onOpenChange,
  onToggleStatus,
}: UserDetailDialogProps) {
  if (!user) return null;

  const isActive = user.status === "Active";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3.5 mb-2">
            <Avatar className="w-12 h-12 bg-muted border border-border">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-dark text-dark-foreground text-sm font-semibold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <DialogTitle className="text-base font-bold text-foreground">
                {user.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground font-mono mt-0.5">
                {user.userCode}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* User Details Grid */}
        <div className="grid grid-cols-2 gap-3 py-2 text-xs">
          <div className="bg-muted/40 p-3 rounded-lg border border-border/50">
            <span className="text-muted-foreground block text-[11px]">Type / Role</span>
            <span className="font-semibold text-foreground mt-0.5 block">
              {user.type} {user.roleSubtitle ? `• ${user.roleSubtitle}` : ""}
            </span>
          </div>

          <div className="bg-muted/40 p-3 rounded-lg border border-border/50">
            <span className="text-muted-foreground block text-[11px]">Status</span>
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border mt-1",
                isActive
                  ? "bg-success/15 text-success border-success/30"
                  : "bg-destructive/15 text-destructive border-destructive/30"
              )}
            >
              {user.status}
            </span>
          </div>

          <div className="bg-muted/40 p-3 rounded-lg border border-border/50">
            <span className="text-muted-foreground block text-[11px]">Email</span>
            <span className="font-medium text-foreground mt-0.5 block truncate">
              {user.email}
            </span>
          </div>

          <div className="bg-muted/40 p-3 rounded-lg border border-border/50">
            <span className="text-muted-foreground block text-[11px]">Phone</span>
            <span className="font-medium text-foreground mt-0.5 block">
              {user.phoneNumber || "Not provided"}
            </span>
          </div>

          <div className="bg-muted/40 p-3 rounded-lg border border-border/50">
            <span className="text-muted-foreground block text-[11px]">Date Joined</span>
            <span className="font-medium text-foreground mt-0.5 block">
              {user.dateJoined}
            </span>
          </div>

          <div className="bg-muted/40 p-3 rounded-lg border border-border/50">
            <span className="text-muted-foreground block text-[11px]">Last Active</span>
            <span className="font-medium text-foreground mt-0.5 block">
              {user.lastActive}
            </span>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between items-center gap-2 pt-2">
          <Button
            type="button"
            variant={isActive ? "destructive" : "default"}
            size="sm"
            onClick={() => {
              onToggleStatus?.(user);
              onOpenChange(false);
            }}
            className={cn(
              "text-xs font-semibold h-8",
              !isActive && "bg-success hover:bg-success/90 text-success-foreground"
            )}
          >
            {isActive ? "Suspend User" : "Activate User"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs font-medium h-8"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
