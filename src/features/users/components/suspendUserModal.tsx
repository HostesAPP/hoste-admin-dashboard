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
import { ShieldAlert, CheckCircle } from "lucide-react";

interface SuspendUserModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (user: User, reason: string) => void;
}

export function SuspendUserModal({
  user,
  open,
  onOpenChange,
  onConfirm,
}: SuspendUserModalProps) {
  const [reason, setReason] = useState("");

  if (!user) return null;

  const isActive = user.status === "Active";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(user, reason);
    onOpenChange(false);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

          {isActive && (
            <div className="py-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="suspend-reason" className="text-xs font-semibold">
                  Reason for Suspension
                </Label>
                <Input
                  id="suspend-reason"
                  placeholder="e.g. Policy violation or suspicious activity..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="text-xs h-9 bg-card border-border/80"
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
              className="text-xs font-medium h-9"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant={isActive ? "destructive" : "default"}
              size="sm"
              className="text-xs font-semibold h-9"
            >
              {isActive ? "Confirm Suspension" : "Confirm Activation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
