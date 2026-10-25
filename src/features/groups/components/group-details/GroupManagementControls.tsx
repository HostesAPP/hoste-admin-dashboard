"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import type { Group } from "@/features/groups";
import { useUpdateGroupStatus } from "../../hooks/groups.hooks";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export type GroupManagementControlsProps = {
  group: Group;
  onOpenSuspend: () => void;
};

export const GroupManagementControls: React.FC<GroupManagementControlsProps> = ({
  group,
  onOpenSuspend,
}) => {
  const { mutateAsync: updateStatus, isPending } = useUpdateGroupStatus();

  const isSuspended =
    group.status?.toUpperCase() === "PAUSED" ||
    group.status?.toUpperCase() === "SUSPENDED" ||
    group.status?.toUpperCase() === "INACTIVE";

  const handleReactivate = async () => {
    try {
      await updateStatus({
        groupId: group.id,
        status: "ACTIVE",
      });
      toast.success(`Group "${group.name}" operational status restored to Active.`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to reactivate group.";
      toast.error(message);
    }
  };

  return (
    <section className="p-6 rounded-xl border border-destructive/30 bg-card shadow-xs space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-destructive">
          Group Management & Controls
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Administrative actions for managing operational state and group access.
        </p>
      </div>

      {/* Action Zone */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
        <div className="space-y-0.5 max-w-xl">
          <h4 className="text-sm font-semibold text-foreground">
            {isSuspended
              ? "Reactivate Group Operational Status"
              : "Suspend Group Operational Status"}
          </h4>
          <p className="text-xs text-muted-foreground leading-normal">
            {isSuspended
              ? "Restore this group to operational status, allowing it to receive new bookings and operate on the platform."
              : "Temporarily restrict this group from accepting new bookings or operating on the platform."}
          </p>
        </div>

        {isSuspended ? (
          <Button
            variant="outline"
            onClick={handleReactivate}
            disabled={isPending}
            className="border-success/40 text-success hover:bg-success/10 font-semibold text-xs h-9 px-4 shrink-0 shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Reactivate Group</span>
          </Button>
        ) : (
          <Button
            variant="destructive"
            onClick={onOpenSuspend}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold text-xs h-9 px-4 shrink-0 shadow-xs cursor-pointer"
          >
            Suspend Group
          </Button>
        )}
      </div>
    </section>
  );
};
