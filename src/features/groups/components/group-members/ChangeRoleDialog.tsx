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
import { ShieldCheck, AlertTriangle } from "lucide-react";
import type { GroupMember, GroupMemberRole } from "@/features/groups";

export type ChangeRoleDialogProps = {
  member: GroupMember | null;
  leaderName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeRole: (memberId: string, newRole: GroupMemberRole) => void;
};

export const ChangeRoleDialog: React.FC<ChangeRoleDialogProps> = ({
  member,
  leaderName = "Kofi Asante",
  open,
  onOpenChange,
  onChangeRole,
}) => {
  const [selectedRole, setSelectedRole] = useState<GroupMemberRole>("Member");

  useEffect(() => {
    function resetRole() {
      setSelectedRole(member?.role === "Group Leader" ? "Group Leader" : "Member");
    }
    if (member) resetRole();
  }, [member, open]);

  if (!member) return null;

  const handleConfirm = () => {
    onChangeRole(member.id, selectedRole);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden sm:max-w-md p-6">
        <DialogHeader className="gap-1.5 text-left">
          <DialogTitle className="text-xl font-bold text-foreground">
            Change Member Role
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Update the group permissions for this ordinary member.
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
                  {member.email}
                </div>
              </div>
            </div>

            <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
              Member
            </span>
          </div>

          {/* Select New Role Section */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-foreground">
              Select New Role
            </label>

            {/* Option 1: Ordinary Member */}
            <div
              onClick={() => setSelectedRole("Member")}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all ${selectedRole === "Member"
                ? "border-primary bg-primary/10 ring-1 ring-primary/40"
                : "border-border hover:bg-muted/40"
                }`}
            >
              <div className="flex items-start gap-2.5">
                <input
                  type="radio"
                  name="change-role-radio"
                  checked={selectedRole === "Member"}
                  onChange={() => setSelectedRole("Member")}
                  className="accent-primary h-4 w-4 mt-0.5"
                />
                <div className="space-y-0.5">
                  <div className="font-semibold text-sm text-foreground">
                    Ordinary Member
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal">
                    Standard permissions. Can view group bookings and participate in group chats.
                  </p>
                </div>
              </div>
            </div>

            {/* Option 2: Group Leader (Protected Flow) */}
            <div className="p-3.5 rounded-lg border border-border bg-muted/10 opacity-90 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <input
                  type="radio"
                  name="change-role-radio"
                  disabled
                  checked={false}
                  className="accent-primary h-4 w-4 mt-0.5 opacity-50 cursor-not-allowed"
                />
                <div className="space-y-0.5">
                  <div className="font-semibold text-sm text-muted-foreground">
                    Group Leader
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal">
                    Full administrative control over this group.
                  </p>
                </div>
              </div>

              {/* Leadership Transfer Required Callout */}
              <div className="flex items-start gap-2 p-2.5 bg-warning/10 border border-warning/30 rounded-md text-xs text-warning">
                <AlertTriangle className="w-4 h-4 shrink-0 text-warning mt-0.5" />
                <div className="text-[11px] leading-snug">
                  <span className="font-bold">Leadership Transfer Required</span>
                  <p className="opacity-90 mt-0.5">
                    Use top-right &quot;Transfer Leadership&quot; button instead.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Protected Leadership Flow Banner */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-success/10 border border-success/30 text-xs text-success">
            <ShieldCheck className="w-4 h-4 shrink-0 text-success mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold">Protected Leadership Flow</div>
              <p className="text-[11px] leading-normal opacity-90">
                Existing Group Leader ({leaderName}) is protected from normal role edits and cannot be demoted here.
              </p>
            </div>
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
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium px-5"
            onClick={handleConfirm}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
