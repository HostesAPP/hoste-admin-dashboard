"use client";
import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FinanceGatewayDialog } from "./finance.settings.dialogs";
import { useFinanceSettings } from "../hooks/settings.finance.hooks";
import type { FinanceSettingsAdapter } from "../settings.finance.types";
import type { SystemBackup } from "../settings.system.types";

export function SystemRestoreDialog({
  backup,
  onClose,
  onRestore,
}: {
  backup: SystemBackup;
  onClose: () => void;
  onRestore: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent
        showCloseButton={!busy}
        className="tracking-normal sm:max-w-[440px]"
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-6 text-destructive" />
            <div>
              <DialogTitle className="text-base">
                Restore System Backup?
              </DialogTitle>
              <p className="mt-1 text-[11px] text-muted-foreground">
                High Impact Data Overwrite Warning
              </p>
            </div>
          </div>
          <DialogDescription className="pt-3 text-xs">
            Restoring a backup will overwrite current platform data with the
            selected snapshot.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md border border-border bg-muted/40 p-3">
          <p className="mb-1 text-[10px] font-semibold uppercase text-muted-foreground">
            Selected Backup Snapshot
          </p>
          <p className="text-xs font-semibold">
            {backup.date} ({backup.size})
          </p>
        </div>
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          Action cannot be undone once initiated.
        </p>
        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
        <footer className="flex justify-end gap-3 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                await onRestore();
                onClose();
              } catch (cause) {
                setError(
                  cause instanceof Error
                    ? cause.message
                    : "Unable to restore the selected backup.",
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy && <Loader2 className="size-4 animate-spin" />}Restore Backup
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
export function SystemDisableModuleDialog({
  label,
  isGroups,
  onClose,
  onConfirm,
}: {
  label: string;
  isGroups: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="tracking-normal sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-warning" />
            <div>
              <DialogTitle className="text-base">
                Disable {isGroups ? "Groups Module" : label}?
              </DialogTitle>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Platform Feature Control
              </p>
            </div>
          </div>
          <DialogDescription className="pt-3 text-xs">
            {isGroups
              ? "Disabling this feature will prevent students from creating new roommate groups and splitting rental payments."
              : `Disabling this feature turns off ${label} for new platform activity.`}
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md border border-warning-border bg-warning-surface p-3 text-[11px]">
          <p className="mb-1 font-semibold">Note on Existing Data:</p>
          <p>
            {isGroups
              ? "Existing active group bookings will remain unaffected."
              : "Existing records will remain saved."}
          </p>
        </div>
        <footer className="flex justify-end gap-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Disable Feature
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
export function SystemGatewayDialog({
  adapter,
  onClose,
}: {
  adapter: FinanceSettingsAdapter;
  onClose: () => void;
}) {
  const query = useFinanceSettings(adapter);
  if (query.isPending || query.isError || !query.data?.canManage)
    return (
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Paystack</DialogTitle>
            <DialogDescription>
              Payment gateway configuration.
            </DialogDescription>
          </DialogHeader>
          {query.isPending ? (
            <p role="status" className="text-xs">
              Loading gateway settings...
            </p>
          ) : query.isError ? (
            <>
              <p role="alert" className="text-xs text-destructive">
                {query.error.message}
              </p>
              <Button variant="outline" onClick={() => query.refetch()}>
                Try Again
              </Button>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              You have view-only access to the payment gateway.
            </p>
          )}
        </DialogContent>
      </Dialog>
    );
  return (
    <FinanceGatewayDialog
      gateway={query.data.gateway}
      onClose={onClose}
      onConfigure={query.configureGateway}
      onTest={query.testConnection}
    />
  );
}
