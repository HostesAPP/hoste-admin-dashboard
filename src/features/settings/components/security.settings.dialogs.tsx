"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  parseSecurityAddresses,
  securityIpEditorSchema,
  securityTwoFactorSchema,
} from "../schemas/settings.security.schema";
import type {
  SecurityIpRestrictions,
  SecurityTwoFactor,
} from "../settings.security.types";

export function SecurityIpDialog({
  restriction,
  currentIp,
  onClose,
  onApply,
}: {
  restriction: SecurityIpRestrictions;
  currentIp: string | null;
  onClose: () => void;
  onApply: (restriction: SecurityIpRestrictions) => void;
}) {
  const form = useForm<{ enabled: boolean; addresses: string }>({
    resolver: zodResolver(securityIpEditorSchema),
    defaultValues: {
      enabled: restriction.enabled,
      addresses: restriction.allowedAddresses.join(", "),
    },
  });
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="tracking-normal sm:max-w-[480px]">
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit((value) =>
            onApply({
              enabled: value.enabled,
              allowedAddresses: parseSecurityAddresses(value.addresses),
            }),
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-base">
              Configure IP Access Restrictions
            </DialogTitle>
            <DialogDescription className="sr-only">
              Allowed administrator IP addresses and CIDR blocks.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">
              Enable IP Restrictions
            </span>
            <Controller
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <Switch
                  aria-label="Enable IP Restrictions"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
          <label className="block space-y-1.5 text-xs">
            <span className="font-semibold">
              Allowed IP Addresses / CIDR Block
            </span>
            <Input
              {...form.register("addresses")}
              aria-invalid={!!form.formState.errors.addresses}
              className="text-xs"
            />
            {form.formState.errors.addresses && (
              <span role="alert" className="text-destructive">
                {form.formState.errors.addresses.message}
              </span>
            )}
          </label>
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-[11px] text-destructive">
            <p className="font-semibold">Warning</p>
            <p>
              Make sure your current IP{currentIp ? ` (${currentIp})` : ""} is
              included before saving, or you may lose administrator access.
            </p>
          </div>
          <footer className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save IPs</Button>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export function SecurityTwoFactorDialog({
  configuration,
  onClose,
  onApply,
}: {
  configuration: SecurityTwoFactor;
  onClose: () => void;
  onApply: (configuration: SecurityTwoFactor) => void;
}) {
  const form = useForm<SecurityTwoFactor>({
    resolver: zodResolver(securityTwoFactorSchema),
    defaultValues: configuration,
  });
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="tracking-normal sm:max-w-[480px]">
        <form className="space-y-5" onSubmit={form.handleSubmit(onApply)}>
          <DialogHeader>
            <DialogTitle className="text-base">
              Configure 2FA Enforcement
            </DialogTitle>
            <DialogDescription className="sr-only">
              Authentication method and grace period for new administrators.
            </DialogDescription>
          </DialogHeader>
          <fieldset>
            <legend className="mb-2 text-xs font-semibold">
              Authentication Method
            </legend>
            <Controller
              control={form.control}
              name="method"
              render={({ field }) => (
                <div className="space-y-2">
                  {(
                    [
                      {
                        value: "TOTP",
                        label: "Authenticator App (TOTP)",
                        detail: "Google Authenticator, 1Password, Authy",
                      },
                      {
                        value: "EMAIL_OTP",
                        label: "Email One-Time Password (OTP)",
                        detail:
                          "Send a verification code to the administrator's email",
                      },
                    ] as const
                  ).map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 ${field.value === option.value ? "border-primary bg-warning-surface" : "border-border"}`}
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={option.value}
                        checked={field.value === option.value}
                        onChange={() => field.onChange(option.value)}
                        className="accent-primary"
                      />
                      <span>
                        <span className="block text-xs font-semibold">
                          {option.label}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {option.detail}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            />
          </fieldset>
          <label className="block space-y-1.5 text-xs">
            <span className="font-semibold">
              Grace Period for New Admins (Days)
            </span>
            <Input
              type="number"
              min={0}
              step={1}
              {...form.register("graceDays", { valueAsNumber: true })}
              aria-invalid={!!form.formState.errors.graceDays}
              className="text-xs"
            />
            {form.formState.errors.graceDays && (
              <span role="alert" className="text-destructive">
                {form.formState.errors.graceDays.message}
              </span>
            )}
          </label>
          <footer className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Settings</Button>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export function SecurityLockoutDialog({
  onClose,
  onConfirm,
}: {
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
      <DialogContent className="tracking-normal sm:max-w-[440px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="size-6 text-destructive" />
            <div>
              <DialogTitle className="text-base">
                Disable Account Lockout?
              </DialogTitle>
              <p className="mt-1 text-[11px] text-muted-foreground">
                High Risk Security Warning
              </p>
            </div>
          </div>
          <DialogDescription className="pt-3 text-xs">
            Users will no longer be temporarily locked after repeated failed
            login attempts.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md border border-warning-border bg-warning-surface p-3 text-xs text-warning">
          <p className="mb-1 font-semibold">Potential Risk Impact:</p>
          <ul className="list-inside list-disc space-y-1 text-[11px]">
            <li>Increases vulnerability to automated brute-force attacks.</li>
            <li>Lowers platform security protections.</li>
          </ul>
        </div>
        <footer className="flex justify-end gap-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Disable
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
