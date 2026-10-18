"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Banknote, Check, CircleCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { referralConfigurationSchema } from "../schemas/earnings.schema";
import type { ReferralConfiguration as Configuration } from "../types/earnings.types";

export function ReferralConfiguration({
  settings,
  canManage,
  onSave,
  onBack,
}: {
  settings: Configuration;
  canManage: boolean;
  onSave: (settings: Configuration) => Promise<void>;
  onBack: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields, isSubmitting },
  } = useForm<Configuration>({
    resolver: zodResolver(referralConfigurationSchema),
    defaultValues: settings,
  });
  const [error, setError] = useState<string | null>(null);
  const [discarding, setDiscarding] = useState(false);
  const submit = handleSubmit(async (values) => {
    setError(null);
    try {
      await onSave(values);
      reset(values);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to save referral settings.",
      );
    }
  });
  const toggle = (
    name:
      | "requireApproval"
      | "allowRetry"
      | "notifyRewardApproved"
      | "notifyPayoutCompleted"
      | "notifyPayoutFailed",
    label: string,
    detail?: string,
  ) => (
    <div className="flex items-center justify-between gap-5 py-3">
      <div>
        <label htmlFor={name} className="text-xs font-semibold">
          {label}
        </label>
        {detail && (
          <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
            {detail}
          </p>
        )}
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Switch
            id={name}
            checked={field.value}
            onCheckedChange={field.onChange}
            className={field.value ? "bg-success" : ""}
            disabled={!canManage || isSubmitting}
          />
        )}
      />
    </div>
  );
  return (
    <form onSubmit={submit} className="space-y-6 tracking-normal">
      <header className="flex items-start justify-between gap-6 border-b border-border pb-5">
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mb-3 -ml-2 text-xs"
            disabled={isSubmitting}
            onClick={() => (isDirty ? setDiscarding(true) : onBack())}
          >
            <ArrowLeft className="size-4" />
            Back to Earnings
          </Button>
          <h1 className="text-2xl font-bold">
            Referral &amp; Payout Configuration
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage referral rewards, qualification rules, and payout settings
            for the Hosté referral program.
          </p>
        </div>
        <Button
          type="submit"
          className="mt-9 text-xs"
          disabled={!canManage || !isDirty || isSubmitting}
        >
          <Check className="size-4" />
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </header>
      {!canManage && (
        <p role="status" className="text-xs text-muted-foreground">
          You have read-only access to referral configuration.
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive"
        >
          {error}
        </p>
      )}
      <fieldset
        disabled={!canManage || isSubmitting}
        className="grid grid-cols-2 items-start gap-5 disabled:opacity-70"
      >
        <div className="space-y-5">
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-bold">Referral Reward</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Set the amount a referrer earns for each successful referral.
            </p>
            <label
              htmlFor="rewardAmount"
              className="mb-2 mt-5 block text-xs font-semibold"
            >
              Reward per Successful Referral
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs">₦</span>
              <Input
                id="rewardAmount"
                type="number"
                min="1"
                step="1"
                {...register("rewardAmount", { valueAsNumber: true })}
                aria-invalid={!!errors.rewardAmount}
                aria-describedby={
                  errors.rewardAmount ? "reward-error" : undefined
                }
                className={`pl-7 pr-20 text-xs ${dirtyFields.rewardAmount ? "border-primary" : ""}`}
              />
              {dirtyFields.rewardAmount && (
                <span className="absolute right-3 top-2.5 text-[9px] font-semibold text-primary">
                  EDITED
                </span>
              )}
            </div>
            {errors.rewardAmount && (
              <p id="reward-error" className="mt-1 text-xs text-destructive">
                {errors.rewardAmount.message}
              </p>
            )}
            <p className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Info className="size-3" />
              This amount is credited only after a referral becomes successful.
            </p>
          </section>
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-bold">Successful Referral Criteria</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Define when a tracked referral becomes eligible for a reward.
            </p>
            <div className="mt-4 space-y-3 rounded-md border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold">
                A referral becomes successful when the referred user:
              </p>
              {(
                [
                  ["requireAccount", "Creates an account"],
                  [
                    "requireQualifyingAction",
                    "Completes the required qualifying action (e.g. First Booking)",
                  ],
                ] as const
              ).map(([name, label]) => (
                <Controller
                  key={name}
                  name={name}
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="peer-checked:bg-success peer-checked:border-success"
                      />
                      <label htmlFor={name} className="text-[11px] leading-5">
                        {label}
                      </label>
                    </div>
                  )}
                />
              ))}
            </div>
            <p className="mt-3 flex items-center gap-2 rounded-md bg-success/10 p-3 text-[10px] font-semibold text-success">
              <CircleCheck className="size-3.5 shrink-0" />
              Reward is generated after all required conditions are satisfied.
            </p>
          </section>
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-bold">Minimum Payout</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Set the minimum referral earnings required before a payout can be
              issued.
            </p>
            <label
              htmlFor="minimumPayout"
              className="mb-2 mt-5 block text-xs font-semibold"
            >
              Minimum Payout Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs">₦</span>
              <Input
                id="minimumPayout"
                type="number"
                min="0"
                step="1"
                {...register("minimumPayout", { valueAsNumber: true })}
                aria-invalid={!!errors.minimumPayout}
                className="pl-7 text-xs"
              />
            </div>
            {errors.minimumPayout && (
              <p role="alert" className="mt-1 text-xs text-destructive">
                {errors.minimumPayout.message}
              </p>
            )}
            <p className="mt-3 text-[11px] italic text-muted-foreground">
              Referrers below this amount remain eligible for future earnings
              but are not yet ready for payout.
            </p>
          </section>
        </div>
        <div className="space-y-5">
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-bold">Payout Method</h2>
            <div className="my-4 flex items-center gap-3 rounded-md border border-border bg-muted/30 p-3">
              <Banknote className="size-7 rounded-full bg-success/10 p-1.5 text-success" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">Bank Transfer</p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Issued automatically through configured payment gateway
                </p>
              </div>
              <span className="rounded-full bg-success/10 px-2 py-1 text-[9px] font-semibold text-success">
                Enabled
              </span>
            </div>
            <h2 className="border-t border-border pt-4 text-sm font-bold">
              Payout Approval
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Require manual admin verification before any payout is processed.
            </p>
            {toggle(
              "requireApproval",
              "Require Admin Approval",
              "Payouts must be reviewed under Referrals → Rewards & Approvals.",
            )}
          </section>
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-bold">Payout Processing</h2>
            <p className="mt-3 text-xs text-muted-foreground">
              Processing Mode:{" "}
              <span className="ml-2 rounded bg-muted px-3 py-1 font-semibold text-foreground">
                Manual
              </span>
            </p>
            <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
              Approved payouts are executed by an administrator from the Payouts
              queue.
            </p>
            <h2 className="mt-4 border-t border-border pt-4 text-sm font-bold">
              Failed Payout Handling
            </h2>
            {toggle(
              "allowRetry",
              "Allow Retry on Failure",
              "Administrators can retry a failed payout after verifying destination details.",
            )}
          </section>
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-bold">Referrer Notifications</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Configure automated email and push alerts sent to referrers.
            </p>
            <div className="mt-2 divide-y divide-border">
              {toggle(
                "notifyRewardApproved",
                "Reward Approved",
                "Notify referrer when a referral reward is approved.",
              )}
              {toggle(
                "notifyPayoutCompleted",
                "Payout Completed",
                "Notify referrer when a payout is successfully completed.",
              )}
              {toggle(
                "notifyPayoutFailed",
                "Payout Failed",
                "Notify referrer when a payout attempt fails.",
              )}
            </div>
          </section>
        </div>
      </fieldset>
      <Dialog open={discarding} onOpenChange={setDiscarding}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Discard Changes?</DialogTitle>
            <DialogDescription>
              Your unsaved referral configuration changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDiscarding(false)}
            >
              Keep Editing
            </Button>
            <Button type="button" variant="destructive" onClick={onBack}>
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
