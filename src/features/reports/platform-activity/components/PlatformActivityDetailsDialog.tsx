"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  User,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  Monitor,
  Hash,
} from "lucide-react";
import type { PlatformActivityLogItem } from "../types/platform-activity.types";

interface PlatformActivityDetailsDialogProps {
  log: PlatformActivityLogItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PlatformActivityDetailsDialog: React.FC<
  PlatformActivityDetailsDialogProps
> = ({ log, isOpen, onClose }) => {
  if (!log) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg rounded-2xl p-6 bg-card border-border">
        <DialogHeader className="pb-4 border-b border-border/80">
          <div className="flex items-center justify-between gap-3 pr-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Activity Audit Log
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground font-mono mt-0.5">
                  ID: {log.id}
                </DialogDescription>
              </div>
            </div>

            <Badge
              variant="outline"
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                log.status === "Success" || log.status === "Completed" || log.status === "Active"
                  ? "bg-secondary/10 text-secondary border-secondary/20"
                  : log.status === "Pending"
                  ? "bg-warning/10 text-warning border-warning/20"
                  : log.status === "In Review"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }`}
            >
              {log.status}
            </Badge>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="py-4 space-y-4 text-xs">
          {/* Main Action Banner */}
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
            <p className="text-[11px] text-muted-foreground font-medium">Activity Description</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{log.activityDescription}</p>
          </div>

          {/* Key-Value Details Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-3 rounded-xl bg-muted/30 border border-border/70 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <User className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] font-medium">User & Role</span>
              </div>
              <p className="font-semibold text-foreground">{log.user}</p>
              <p className="text-[10px] text-muted-foreground">{log.userType}</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 border border-border/70 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Layers className="w-3.5 h-3.5 text-secondary" />
                <span className="text-[11px] font-medium">Module Area</span>
              </div>
              <p className="font-semibold text-foreground">{log.area}</p>
              <p className="text-[10px] text-muted-foreground">{log.activityType}</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 border border-border/70 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] font-medium">Timestamp</span>
              </div>
              <p className="font-semibold text-foreground">{log.dateTime}</p>
              <p className="text-[10px] text-muted-foreground">WAT (UTC+1)</p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 border border-border/70 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Monitor className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] font-medium">Client Device</span>
              </div>
              <p className="font-semibold text-foreground truncate">
                {log.details?.device || "Hosté Web Client"}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono">
                IP: {log.details?.ipAddress || "197.210.0.1"}
              </p>
            </div>
          </div>

          {/* Reference & Notes */}
          {log.details?.referenceId && (
            <div className="p-3 rounded-xl bg-muted/20 border border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Hash className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">Entity Reference:</span>
              </div>
              <span className="font-mono font-bold text-foreground">
                {log.details.referenceId}
              </span>
            </div>
          )}

          {log.details?.amount && (
            <div className="p-3 rounded-xl bg-secondary/5 border border-secondary/20 flex items-center justify-between">
              <span className="font-medium text-secondary">Transaction Amount:</span>
              <span className="font-bold text-base text-secondary">
                {log.details.amount}
              </span>
            </div>
          )}

          {log.details?.notes && (
            <div className="p-3 rounded-xl bg-muted/30 border border-border/70">
              <p className="text-[11px] font-medium text-muted-foreground mb-1">Additional Notes</p>
              <p className="text-foreground leading-relaxed">{log.details.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
