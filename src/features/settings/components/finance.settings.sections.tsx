"use client";

import { useId } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SettingsNativeSelect } from "./settings.native.select";
import type {
  FinanceSettings,
  FinanceSettingsSnapshot,
} from "../settings.finance.types";

type ToggleName = {
  [Key in keyof FinanceSettings]: FinanceSettings[Key] extends boolean
    ? Key
    : never;
}[keyof FinanceSettings];
type NumberName = {
  [Key in keyof FinanceSettings]: FinanceSettings[Key] extends number
    ? Key
    : never;
}[keyof FinanceSettings];

export function FinanceToggle({
  name,
  label,
  description,
  disabled,
}: {
  name: ToggleName;
  label: string;
  description?: string;
  disabled: boolean;
}) {
  const { control } = useFormContext<FinanceSettings>();
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div>
        <label htmlFor={id} className="text-xs font-medium">
          {label}
        </label>
        {description && (
          <p className="text-[11px] leading-4 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Switch
            id={id}
            aria-label={label}
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
            className={field.value ? "bg-secondary" : ""}
          />
        )}
      />
    </div>
  );
}

export function FinanceNumber({
  name,
  label,
  disabled,
}: {
  name: NumberName;
  label: string;
  disabled: boolean;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext<FinanceSettings>();
  return (
    <label className="block space-y-1.5 text-xs">
      <span className="font-medium">{label}</span>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            type="number"
            min={0}
            step={
              name === "holdingDays" || name === "refundWindowHours" ? 1 : "any"
            }
            {...field}
            value={Number.isNaN(field.value) ? "" : field.value}
            onChange={(event) =>
              field.onChange(
                event.target.value === "" ? NaN : Number(event.target.value),
              )
            }
            disabled={disabled}
            aria-invalid={!!errors[name]}
            className="h-9 text-xs"
          />
        )}
      />
      {errors[name] && (
        <span role="alert" className="block text-destructive">
          {errors[name]?.message}
        </span>
      )}
    </label>
  );
}

export function FinanceRefundFields({ disabled }: { disabled: boolean }) {
  const { control } = useFormContext<FinanceSettings>();
  return (
    <div className="space-y-3">
      <FinanceToggle
        name="automaticRefunds"
        label="Allow Automatic Refunds"
        description="Process refund rules without manual review"
        disabled={disabled}
      />
      <div className="grid grid-cols-2 gap-4">
        <label className="space-y-1.5 text-xs">
          <span className="block font-medium">Refund Approval</span>
          <Controller
            control={control}
            name="refundApproval"
            render={({ field }) => (
              <SettingsNativeSelect
                {...field}
                disabled={disabled}
                className="h-9"
              >
                <option value="ADMIN">Admin Approval Required</option>
                <option value="AUTOMATIC">Automatic Approval</option>
              </SettingsNativeSelect>
            )}
          />
        </label>
        <FinanceNumber
          name="refundWindowHours"
          label="Default Refund Window (Hours)"
          disabled={disabled}
        />
      </div>
      <FinanceToggle
        name="partialRefunds"
        label="Allow Partial Refunds"
        disabled={disabled}
      />
      <FinanceToggle
        name="cancellationRefunds"
        label="Allow Refund After Booking Cancellation"
        disabled={disabled}
      />
    </div>
  );
}

export function FinanceEscrowFields({ disabled }: { disabled: boolean }) {
  const { register } = useFormContext<FinanceSettings>();
  const enabled = useWatch<FinanceSettings>({ name: "escrowEnabled" });
  return (
    <div className="space-y-3">
      <FinanceToggle
        name="escrowEnabled"
        label="Enable Escrow System"
        description="Safely hold funds prior to booking fulfillment"
        disabled={disabled}
      />
      <FinanceToggle
        name="holdUntilCompletion"
        label="Hold Payment Until Booking Completion"
        disabled={disabled}
      />
      <div className="grid grid-cols-2 gap-4">
        <label className="space-y-1.5 text-xs">
          <span className="block font-medium">Escrow Release Condition</span>
          <SettingsNativeSelect
            {...register("releaseCondition")}
            className="h-9"
            disabled={disabled}
          >
            <option value="AFTER_COMPLETION">After completion</option>
            <option value="MANUAL">Manual release</option>
          </SettingsNativeSelect>
        </label>
        <FinanceNumber
          name="holdingDays"
          label="Holding Period (Days)"
          disabled={disabled}
        />
      </div>
      <FinanceToggle
        name="disputeHold"
        label="Dispute Hold"
        description="Hold funds when a booking is under dispute until resolved"
        disabled={disabled}
      />
      {enabled && (
        <div className="flex gap-2 rounded-md border border-warning/40 bg-warning/10 p-3 text-[11px]">
          <Info className="size-4 shrink-0 text-secondary" />
          <div>
            <p className="font-semibold text-secondary">
              Escrow Protection Active
            </p>
            <p>
              Escrow holds booking payments until the release requirements are
              met.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function FinancePayoutFields({ disabled }: { disabled: boolean }) {
  const { register } = useFormContext<FinanceSettings>();
  return (
    <div className="space-y-3">
      <FinanceToggle
        name="payoutsEnabled"
        label="Enable Hosté Payouts"
        description="Automate disbursement to host bank accounts"
        disabled={disabled}
      />
      <div className="grid grid-cols-2 gap-4">
        <label className="space-y-1.5 text-xs">
          <span className="block font-medium">Payout Schedule</span>
          <SettingsNativeSelect
            {...register("payoutSchedule")}
            disabled={disabled}
            className="h-9"
          >
            <option value="WEEKLY">Weekly (Every Monday)</option>
            <option value="MONTHLY">Monthly</option>
            <option value="MANUAL">Manual</option>
          </SettingsNativeSelect>
        </label>
        <FinanceNumber
          name="minimumPayout"
          label="Min Payout Amount (₦)"
          disabled={disabled}
        />
      </div>
      <FinanceNumber
        name="processingFee"
        label="Payout Processing Fee (₦)"
        disabled={disabled}
      />
      <div className="grid grid-cols-2 gap-4">
        <FinanceToggle
          name="verifiedHosteRequired"
          label="Require Verified Hosté"
          disabled={disabled}
        />
        <FinanceToggle
          name="completedBookingRequired"
          label="Require Completed Booking"
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export function FinanceTransactionFields({ disabled }: { disabled: boolean }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <label className="space-y-1.5 text-xs">
          <span className="block font-medium">Transaction Currency</span>
          <Input value="NGN (₦)" readOnly className="h-9 bg-muted text-xs" />
        </label>
        <FinanceNumber
          name="minimumTransaction"
          label="Min Amount (₦)"
          disabled={disabled}
        />
        <FinanceNumber
          name="maximumTransaction"
          label="Max Amount (₦)"
          disabled={disabled}
        />
      </div>
      <FinanceToggle
        name="verifyPayments"
        label="Require Payment Verification Step"
        disabled={disabled}
      />
      <FinanceToggle
        name="reconcilePayments"
        label="Automatically Reconcile Payments"
        disabled={disabled}
      />
      <FinanceToggle
        name="recordFailedTransactions"
        label="Record Failed Transactions in Audit Log"
        disabled={disabled}
      />
    </div>
  );
}

export function FinanceNotifications({ disabled }: { disabled: boolean }) {
  const { control } = useFormContext<FinanceSettings>();
  const notifications = useWatch({ control, name: "notifications" });
  return (
    <table className="w-full text-xs">
      <thead className="text-[10px] font-medium uppercase text-muted-foreground">
        <tr>
          <th className="text-left">
            <span className="sr-only">Event</span>
          </th>
          <th className="w-16 pb-2">Email</th>
          <th className="w-16 pb-2">Push</th>
        </tr>
      </thead>
      <tbody>
        {notifications.map((item, index) => (
          <tr key={item.id}>
            <td className="py-2">{item.label}</td>
            {(["email", "push"] as const).map((channel) => (
              <td key={channel} className="text-center">
                <Controller
                  control={control}
                  name={`notifications.${index}.${channel}`}
                  render={({ field }) => (
                    <Switch
                      aria-label={`${item.label} ${channel}`}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                      className={field.value ? "bg-secondary" : ""}
                    />
                  )}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function FinanceActivityTable({
  activity,
}: {
  activity: FinanceSettingsSnapshot["activity"];
}) {
  return (
    <table className="w-full text-left text-xs">
      <thead className="bg-muted/50 text-[10px] uppercase text-muted-foreground">
        <tr>
          {[
            "Activity / Event",
            "Reference / User",
            "Amount",
            "Date & Time",
            "Status",
          ].map((label) => (
            <th key={label} className="px-3 py-2 font-medium">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {activity.map((item) => (
          <tr key={item.id} className="border-b border-border last:border-0">
            <td className="px-3 py-3">{item.event}</td>
            <td className="px-3 text-muted-foreground">{item.user}</td>
            <td className="px-3 text-muted-foreground">{item.amount}</td>
            <td className="px-3 whitespace-nowrap text-muted-foreground">
              {item.date}
            </td>
            <td className="px-3">
              <span className="rounded bg-secondary/10 px-2 py-1 text-[10px] font-semibold text-secondary">
                {item.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
