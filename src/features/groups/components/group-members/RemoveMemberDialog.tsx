"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, ShieldAlert } from "lucide-react";
import type { GroupMember } from "@/features/groups";

export type RemoveMemberDialogProps = {
  member: GroupMember | null;
  leaderName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemoveMember: (memberId: string) => void;
};

export const RemoveMemberDialog: React.FC<RemoveMemberDialogProps> = ({
  member,
  leaderName = "Kofi Asante",
  open,
  onOpenChange,
  onRemoveMember,
}) => {
  const [understood, setUnderstood] = useState(false);

  useEffect(() => {
    if (!open) {
      setUnderstood(false);
    }
  }, [open]);

  if (!member) return null;

  const handleConfirm = () => {
    if (understood) {
      onRemoveMember(member.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden sm:max-w-md p-6">
        {/* Header with Red Icon */}
        <DialogHeader className="gap-2 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Remove Member?
              </DialogTitle>
              <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 tracking-wider mt-0.5">
                CONFIRM DESTRUCTIVE ACTION
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Member Card */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarFallback
                  style={{
                    backgroundColor: `${member.avatarColor || "#0284C7"}20`,
                    color: member.avatarColor || "#0284C7",
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

            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 px-2 py-0.5 rounded uppercase tracking-wider">
              To be removed
            </span>
          </div>

          {/* What happens list */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-foreground">
              What happens when you remove this member:
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed pl-1">
              <li className="flex items-start gap-2">
                <span className="text-foreground font-bold mt-0.5">•</span>
                <span>
                  <strong className="text-foreground font-medium">Group Access:</strong> User will lose access to shared group bookings and itineraries immediately.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground font-bold mt-0.5">•</span>
                <span>
                  <strong className="text-foreground font-medium">Customer Profile Safety:</strong> Their global Hosté account profile ({member.userId}) will NOT be deleted or banned.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-foreground font-bold mt-0.5">•</span>
                <span>
                  <strong className="text-foreground font-medium">Group Leadership Unaffected:</strong> Group Leader ({leaderName}) remains intact.
                </span>
              </li>
            </ul>
          </div>

          {/* Group Leader Protection Rule Callout */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-warning/10 border border-warning/30 text-xs">
            <ShieldAlert className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-warning">
              <div className="font-semibold">Group Leader Protection Rule:</div>
              <p className="text-[11px] leading-normal opacity-90">
                Group Leaders are protected from removal. To remove a Group Leader, transfer leadership to another member first.
              </p>
            </div>
          </div>

          {/* Checkbox Acknowledgment */}
          <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
            <Checkbox
              checked={understood}
              onCheckedChange={(checked) => setUnderstood(!!checked)}
            />
            <span className="text-xs text-foreground font-medium">
              I understand this action removes the user from the group.
            </span>
          </label>
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
            disabled={!understood}
            onClick={handleConfirm}
          >
            Remove Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
