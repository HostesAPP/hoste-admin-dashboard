"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "../types/users.types";
import { suspendUserSchema } from "../schemas/users.schema";
import { ShieldAlert, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuspendUserModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (user: User, reason: string) => Promise<void> | void;
  isLoading?: boolean;
}

export function SuspendUserModal({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: SuspendUserModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setReason("");
      setError(null);
    }
    onOpenChange(nextOpen);
  };

  if (!user) return null;

  const isActive = user.status === "Active";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isActive) {
      const validation = suspendUserSchema.safeParse({ reason });
      if (!validation.success) {
        const issue =
          validation.error.issues[0]?.message ||
          "Reason for suspension is required";
        setError(issue);
        return;
      }
    }

    try {
      const effectiveReason =
        reason.trim() ||
        (isActive
          ? "Administrative suspension by staff"
          : "Account reactivated by staff administrator");
      await onConfirm(user, effectiveReason);
      setReason("");
      setError(null);
      onOpenChange(false);
    } catch {
      // Error handling is handled by caller (toast notification)
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2.5 text-foreground mb-1">
              {isActive ? (
                <ShieldAlert className="w-5 h-5 text-destructive" />
              ) : (
                <CheckCircle className="w-5 h-5 text-success" />
              )}
              <DialogTitle className="text-base font-bold">
                {isActive ? `Suspend ${user.name}` : `Activate ${user.name}`}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              {isActive
                ? `Suspending this account will temporarily disable platform access and API credentials for ${user.userCode}.`
                : `Activating this account will restore full platform access for ${user.userCode}.`}
            </DialogDescription>
          </DialogHeader>

          {isActive ? (
            <div className="py-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="suspend-reason" className="text-xs font-semibold">
                  Reason for Suspension <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="suspend-reason"
                  placeholder="e.g. Policy violation or suspicious activity..."
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (error) setError(null);
                  }}
                  disabled={isLoading}
                  className={cn(
                    "text-xs h-9 bg-card border-border/80 transition-colors",
                    error && "border-destructive focus-visible:ring-destructive"
                  )}
                  autoFocus
                />
                {error && (
                  <p className="text-[11px] text-destructive font-medium mt-1">
                    {error}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="activate-reason" className="text-xs font-semibold">
                  Reason for Activation{" "}
                  <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <Input
                  id="activate-reason"
                  placeholder="e.g. Account reviewed and issue resolved..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={isLoading}
                  className="text-xs h-9 bg-card border-border/80 transition-colors"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:justify-end gap-2 pt-3 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="text-xs font-medium h-9"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant={isActive ? "destructive" : "default"}
              size="sm"
              disabled={isLoading}
              className="text-xs font-semibold h-9 gap-1.5"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isActive ? "Confirm Suspension" : "Confirm Activation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
