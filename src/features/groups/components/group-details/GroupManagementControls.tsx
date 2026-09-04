"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import type { Group } from "@/features/groups";

export type GroupManagementControlsProps = {
  group: Group;
  onOpenSuspend: () => void;
};

export const GroupManagementControls: React.FC<GroupManagementControlsProps> = ({
  group,
  onOpenSuspend,
}) => {
  return (
    <section className="p-6 rounded-xl border border-destructive/20 bg-card shadow-xs space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-destructive flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          <span>Group Management & Controls</span>
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Administrative actions for managing operational state and group access.
        </p>
      </div>

      {/* Action Zone */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
        <div className="space-y-0.5 max-w-xl">
          <h4 className="text-sm font-semibold text-foreground">
            Suspend Group Operational Status
          </h4>
          <p className="text-xs text-muted-foreground leading-normal">
            Temporarily restrict {group?.name || "this group"} from accepting new bookings or operating on the platform.
          </p>
        </div>

        <Button
          variant="destructive"
          onClick={onOpenSuspend}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium text-xs h-9 px-4 shrink-0 shadow-xs cursor-pointer"
        >
          Suspend Group
        </Button>
      </div>
    </section>
  );
};
