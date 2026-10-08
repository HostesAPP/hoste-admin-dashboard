"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SettingsNativeSelect } from "./settings.native.select";
import {
  financeCommissionSchema,
  financeGatewaySchema,
} from "../schemas/settings.finance.schema";
import type {
  FinanceCommission,
  FinanceGateway,
  FinanceGatewayInput,
  FinanceSettingsAdapter,
} from "../settings.finance.types";

export function FinanceGatewayDialog({
  gateway,
  onClose,
  onConfigure,
  onTest,
}: {
  gateway: FinanceGateway;
  onClose: () => void;
  onConfigure: FinanceSettingsAdapter["configureGateway"];
  onTest: FinanceSettingsAdapter["testConnection"];
}) {
  const form = useForm<FinanceGatewayInput>({
    resolver: zodResolver(financeGatewaySchema),
    defaultValues: { publicKey: "", secretKey: "", mode: gateway.mode },
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const run = async (operation: () => Promise<void>) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await operation();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to update gateway configuration.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[480px]" showCloseButton={!busy}>
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit((values) =>
            run(async () => {
              await onConfigure(values);
              form.reset({ publicKey: "", secretKey: "", mode: values.mode });
              onClose();
            }),
          )}
        >
          <DialogHeader>
            <DialogTitle>Configure Paystack</DialogTitle>
            <DialogDescription>
              Update payment gateway configuration.
            </DialogDescription>
          </DialogHeader>
          <fieldset disabled={busy} className="space-y-4">
            <label className="block space-y-1.5 text-xs">
              <span className="font-semibold">Public Key</span>
              <Input
                {...form.register("publicKey")}
                placeholder={gateway.publicKeySummary}
                autoComplete="off"
                aria-invalid={!!form.formState.errors.publicKey}
              />
              {form.formState.errors.publicKey && (
                <span role="alert" className="text-destructive">
                  {form.formState.errors.publicKey.message}
                </span>
              )}
            </label>
            <label className="block space-y-1.5 text-xs">
              <span className="font-semibold">Secret Key</span>
              <Input
                {...form.register("secretKey")}
                type="password"
                placeholder="Leave blank to keep the existing secret"
                autoComplete="new-password"
              />
            </label>
            <label className="block space-y-1.5 text-xs">
              <span className="font-semibold">Webhook URL</span>
              <Input
                value={gateway.webhookUrl ?? ""}
                placeholder="Provided by backend"
                readOnly
                className="bg-muted"
              />
            </label>
            <div className="space-y-1.5 text-xs">
              <p className="font-semibold">Environment Mode</p>
              <Controller
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <div
                    role="group"
                    aria-label="Environment Mode"
                    className="inline-flex rounded-md border border-border p-1"
                  >
                    {(["LIVE", "TEST"] as const).map((mode) => (
                      <Button
                        key={mode}
                        type="button"
                        size="sm"
                        variant={field.value === mode ? "default" : "ghost"}
                        aria-pressed={field.value === mode}
                        onClick={() => field.onChange(mode)}
                      >
                        {mode === "LIVE" ? "Live Mode" : "Test Mode"}
                      </Button>
                    ))}
                  </div>
                )}
              />
            </div>
          </fieldset>
          {message && (
            <p role="status" className="text-xs text-secondary">
              {message}
            </p>
          )}
          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
          <footer className="flex justify-end gap-2 border-t pt-4">
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
              variant="outline"
              disabled={busy}
              onClick={() => run(async () => setMessage(await onTest()))}
            >
              Test Connection
            </Button>
            <Button type="submit" disabled={busy}>
              {busy && <Loader2 className="size-4 animate-spin" />}Save Config
            </Button>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function FinanceCommissionEditor({
  rule,
  onClose,
  onApply,
}: {
  rule: FinanceCommission;
  onClose: () => void;
  onApply: (rule: FinanceCommission) => void;
}) {
  const form = useForm<FinanceCommission>({
    resolver: zodResolver(financeCommissionSchema),
    defaultValues: rule,
  });
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[460px]">
        <form className="space-y-5" onSubmit={form.handleSubmit(onApply)}>
          <DialogHeader>
            <DialogTitle>
              {rule.id ? "Edit" : "Add"} Commission Rule
            </DialogTitle>
            <DialogDescription>
              Configure the commission for a booking or Hosté type.
            </DialogDescription>
          </DialogHeader>
          {(["name", "category"] as const).map((name) => (
            <label key={name} className="block space-y-1.5 text-xs">
              <span className="font-semibold">
                {name === "name" ? "Rule Name" : "Booking / Hosté Type"}
              </span>
              <Input
                {...form.register(name)}
                aria-invalid={!!form.formState.errors[name]}
              />
              {form.formState.errors[name] && (
                <span role="alert" className="text-destructive">
                  {form.formState.errors[name]?.message}
                </span>
              )}
            </label>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <label className="space-y-1.5 text-xs">
              <span className="block font-semibold">Commission Type</span>
              <SettingsNativeSelect {...form.register("type")}>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₦)</option>
              </SettingsNativeSelect>
            </label>
            <label className="space-y-1.5 text-xs">
              <span className="block font-semibold">Value</span>
              <Input
                type="number"
                min={0}
                step="any"
                {...form.register("value", { valueAsNumber: true })}
                aria-invalid={!!form.formState.errors.value}
              />
              {form.formState.errors.value && (
                <span role="alert" className="block text-destructive">
                  {form.formState.errors.value.message}
                </span>
              )}
            </label>
          </div>
          <footer className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-secondary hover:bg-secondary/90"
            >
              {rule.id ? "Save Rule" : "Add Rule"}
            </Button>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}
