"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, UserX } from "lucide-react";
import type { GroupMember } from "@/features/groups";

export type SuspendMemberDialogProps = {
  member: GroupMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuspendMember: (memberId: string, reason: string, duration: string) => void;
};

export const SuspendMemberDialog: React.FC<SuspendMemberDialogProps> = ({
  member,
  open,
  onOpenChange,
  onSuspendMember,
}) => {
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("7_days");

  useEffect(() => {
    if (!open) {
      setReason("");
      setDuration("7_days");
    }
  }, [open]);

  if (!member) return null;

  const handleConfirm = () => {
    if (reason.trim()) {
      onSuspendMember(member.id, reason, duration);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden sm:max-w-md p-6">
        <DialogHeader className="gap-2 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <UserX className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Suspend Member Account
              </DialogTitle>
              <div className="text-[11px] font-bold text-destructive uppercase tracking-wider mt-0.5">
                Restricted Access
              </div>
            </div>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Suspending this member will prevent them from participating in group activities and bookings until reinstated.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Member Card */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarFallback
                  style={{
                    backgroundColor: `${member.avatarColor || "#EF5A22"}20`,
                    color: member.avatarColor || "#EF5A22",
                  }}
                  className="font-bold text-xs"
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-sm text-foreground">
                  {member.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {member.email} • {member.userId}
                </div>
              </div>
            </div>

            <span className="text-xs font-semibold text-warning bg-warning/15 border border-warning/30 px-2.5 py-0.5 rounded">
              {member.role}
            </span>
          </div>

          {/* Duration Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Suspension Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="24_hours">24 Hours</option>
              <option value="7_days">7 Days</option>
              <option value="30_days">30 Days</option>
              <option value="indefinite">Indefinite (Until manually unbanned)</option>
            </select>
          </div>

          {/* Reason */}
          <Field>
            <FieldLabel htmlFor="suspend-member-reason" className="text-xs font-semibold">
              Reason for Suspension <span className="text-destructive">*</span>
            </FieldLabel>
            <Textarea
              id="suspend-member-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a clear reason for administrative logs and user notification..."
              className="resize-none text-xs"
              rows={3}
            />
          </Field>

          {/* Warning */}
          <div className="flex items-start gap-2 p-2.5 bg-warning/10 border border-warning/30 rounded-md text-xs text-warning">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-snug">
              The user will be notified of their suspension with the provided reason.
            </span>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end gap-2.5 pt-4 border-t border-border mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-5 border-border"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium px-5"
            disabled={!reason.trim()}
            onClick={handleConfirm}
          >
            Suspend Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
