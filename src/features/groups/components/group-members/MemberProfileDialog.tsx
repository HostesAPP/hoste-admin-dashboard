"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Calendar, Activity, Shield, Hash } from "lucide-react";
import type { GroupMember } from "@/features/groups";

export type MemberProfileDialogProps = {
  member: GroupMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenChangeRole?: (member: GroupMember) => void;
};

export const MemberProfileDialog: React.FC<MemberProfileDialogProps> = ({
  member,
  open,
  onOpenChange,
  onOpenChangeRole,
}) => {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden sm:max-w-md">
        <DialogHeader className="gap-2 pb-2 border-b">
          <DialogTitle className="text-lg font-bold">Member Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Top Profile Summary */}
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 border-2 border-primary/20">
              <AvatarFallback
                style={{
                  backgroundColor: `${member.avatarColor || "#EF5A22"}20`,
                  color: member.avatarColor || "#EF5A22",
                }}
                className="text-base font-bold"
              >
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-base text-foreground">
                {member.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                  {member.role}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    member.status === "Active"
                      ? "bg-success/15 text-success border border-success/30"
                      : member.status === "Pending"
                      ? "bg-warning/15 text-warning border border-warning/30"
                      : "bg-destructive/15 text-destructive border border-destructive/30"
                  }`}
                >
                  {member.status}
                </span>
              </div>
            </div>
          </div>

          {/* Details List */}
          <div className="grid grid-cols-1 gap-2.5 bg-muted/30 p-3.5 rounded-xl border text-xs">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Hash className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>User ID:</span>
              <span className="font-semibold text-foreground">{member.userId}</span>
            </div>

            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>Email:</span>
              <span className="font-semibold text-foreground">{member.email}</span>
            </div>

            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>Date Joined:</span>
              <span className="font-semibold text-foreground">{member.dateJoined}</span>
            </div>

            <div className="flex items-center gap-2.5 text-muted-foreground">
              <Activity className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>Last Activity:</span>
              <span className="font-semibold text-foreground">{member.lastActivity}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="space-x-2 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {onOpenChangeRole && (
            <Button
              type="button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
              onClick={() => {
                onOpenChange(false);
                onOpenChangeRole(member);
              }}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Change Role</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
