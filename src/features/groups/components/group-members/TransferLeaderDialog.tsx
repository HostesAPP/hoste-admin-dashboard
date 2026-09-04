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
import { ArrowRightLeft, AlertTriangle } from "lucide-react";
import type { Group, GroupMember } from "@/features/groups";

export type TransferLeaderDialogProps = {
  group?: Group;
  members: GroupMember[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransferLeader: (memberId: string) => void;
};

export const TransferLeaderDialog: React.FC<TransferLeaderDialogProps> = ({
  group,
  members,
  open,
  onOpenChange,
  onTransferLeader,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");

  const eligibleMembers = members.filter(
    (m) => m.status === "Active" && m.role !== "Group Leader"
  );
  const currentLeader = members.find(
    (m) => m.role === "Group Leader" || m.isLeader
  );

  useEffect(() => {
    if (open && eligibleMembers.length > 0 && !selectedMemberId) {
      setSelectedMemberId(eligibleMembers[0].id);
    }
  }, [open, eligibleMembers, selectedMemberId]);

  const handleConfirm = () => {
    if (selectedMemberId) {
      onTransferLeader(selectedMemberId);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden sm:max-w-md">
        <DialogHeader className="gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg font-bold">
                Transfer Group Leadership
              </DialogTitle>
              <span className="text-sm text-muted-foreground">
                {group?.name || "Group"}
              </span>
            </div>
          </div>

          <DialogDescription className="text-sm text-muted-foreground pt-1">
            Assign a new group leader. The current leader will become a regular
            member with standard privileges.
          </DialogDescription>
        </DialogHeader>

        {currentLeader && (
          <div className="p-3 bg-muted/40 rounded-lg border flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Leader:</span>
            <span className="font-semibold text-foreground flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: currentLeader.avatarColor || "#EF5A22" }}
              />
              {currentLeader.name} ({currentLeader.userId})
            </span>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold">Select New Leader</label>
          <div className="max-h-56 overflow-y-auto space-y-1.5 border rounded-lg p-1.5">
            {eligibleMembers.map((member) => {
              const isSelected = selectedMemberId === member.id;
              return (
                <div
                  key={member.id}
                  onClick={() => setSelectedMemberId(member.id)}
                  className={`flex items-center justify-between p-2.5 rounded-md cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-muted/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback
                        style={{
                          backgroundColor: `${member.avatarColor || "#0284C7"}20`,
                          color: member.avatarColor || "#0284C7",
                        }}
                        className="text-xs font-semibold"
                      >
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm text-foreground">
                        {member.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {member.email} • {member.userId}
                      </div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="leader-radio"
                    checked={isSelected}
                    onChange={() => setSelectedMemberId(member.id)}
                    className="accent-primary h-4 w-4 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-warning/10 text-warning border border-warning/30 rounded-lg text-xs">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            This action immediately changes permissions. The new leader will have full control over group settings and member management.
          </span>
        </div>

        <DialogFooter className="space-x-2 pt-3 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            disabled={!selectedMemberId}
            onClick={handleConfirm}
          >
            Confirm Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
