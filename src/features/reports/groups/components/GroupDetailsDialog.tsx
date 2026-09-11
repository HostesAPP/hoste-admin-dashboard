"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users2,
  Calendar,
  CreditCard,
  Download,
  User,
  Layers,
} from "lucide-react";
import type { GroupDirectoryItem } from "../types/groups.types";

interface GroupDetailsDialogProps {
  group: GroupDirectoryItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupDetailsDialog({
  group,
  isOpen,
  onOpenChange,
}: GroupDetailsDialogProps) {
  if (!group) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold text-foreground">
              Group Profile
            </DialogTitle>
            <Badge
              variant="outline"
              className={`text-xs px-2.5 py-0.5 rounded-full ${
                group.status === "Active"
                  ? "bg-secondary/10 text-secondary border-secondary/20"
                  : group.status === "Pending"
                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  : group.status === "Completed"
                  ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                  : group.status === "Cancelled"
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {group.status}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Group metadata, membership breakdown, and venue booking revenue
          </DialogDescription>
        </DialogHeader>

        {/* Group Header Card */}
        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-muted/20 border border-border mt-2">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base bg-primary text-primary-foreground shrink-0">
            <Users2 className="w-6 h-6" />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <h4 className="font-bold text-foreground text-sm truncate">
              {group.groupName}
            </h4>
            {group.category && (
              <p className="text-xs text-primary font-medium flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {group.category}
              </p>
            )}
            <div className="space-y-0.5 pt-1 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <User className="w-3 h-3 text-muted-foreground" />
                Leader: <span className="font-semibold text-foreground">{group.groupLeader}</span>
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-1">
              <Calendar className="w-3 h-3" />
              Created {group.createdDate} • Last active {group.lastActivity}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users2 className="w-3.5 h-3.5 text-primary" />
              Members &amp; Bookings
            </div>
            <p className="text-xl font-bold text-foreground">
              {group.members}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                members
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground pt-1">
              Bookings: <span className="font-semibold text-foreground">{group.bookingsFormatted}</span>
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CreditCard className="w-3.5 h-3.5 text-secondary" />
              Total Revenue
            </div>
            <p className="text-xl font-bold text-secondary">{group.revenue}</p>
            <p className="text-[11px] text-muted-foreground pt-1">
              Status: <span className="font-semibold text-foreground">{group.status}</span>
            </p>
          </div>
        </div>

        {group.description && (
          <div className="p-3 rounded-xl bg-muted/15 border border-border/60 text-xs text-muted-foreground mt-2">
            <p className="font-semibold text-foreground mb-0.5">Description</p>
            <p>{group.description}</p>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between sm:justify-between gap-2 mt-4 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Close
          </Button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground text-xs gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Statement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
