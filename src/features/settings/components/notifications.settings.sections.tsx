"use client";

import { useId } from "react";
import {
  Controller,
  useFormContext,
  useWatch,
  type FieldPathByValue,
} from "react-hook-form";
import { Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type {
  NotificationSettings,
  NotificationSettingsSnapshot,
} from "../settings.notifications.types";

export function NotificationCheckbox({
  name,
  label,
  disabled,
  onDisable,
}: {
  name: FieldPathByValue<NotificationSettings, boolean>;
  label: string;
  disabled: boolean;
  onDisable?: (apply: () => void) => void;
}) {
  const { control } = useFormContext<NotificationSettings>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Checkbox
          aria-label={label}
          checked={field.value}
          onCheckedChange={(checked) => {
            if (!checked && onDisable) onDisable(() => field.onChange(false));
            else field.onChange(checked);
          }}
          onBlur={field.onBlur}
          ref={field.ref}
          disabled={disabled}
          className="peer-checked:border-secondary peer-checked:bg-secondary peer-checked:text-secondary-foreground"
        />
      )}
    />
  );
}

export function NotificationToggle({
  name,
  label,
  disabled,
}: {
  name: FieldPathByValue<NotificationSettings, boolean>;
  label: string;
  disabled: boolean;
}) {
  const id = useId();
  const { control } = useFormContext<NotificationSettings>();
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <label htmlFor={id} className="text-xs">
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Switch
            id={id}
            checked={field.value}
            onCheckedChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            disabled={disabled}
            className={field.value ? "bg-secondary" : ""}
          />
        )}
      />
    </div>
  );
}

export function NotificationPreferenceTable({
  disabled,
  onManage,
}: {
  disabled: boolean;
  onManage: (index: number) => void;
}) {
  const { control } = useFormContext<NotificationSettings>();
  const preferences = useWatch({ control, name: "userPreferences" });
  return (
    <table className="w-full text-left text-xs">
      <thead className="bg-muted/50 text-[10px] uppercase text-muted-foreground">
        <tr>
          <th className="px-3 py-2 font-medium">User Type</th>
          {["Email", "Push", "SMS"].map((channel) => (
            <th key={channel} className="w-28 text-center font-medium">
              {channel}
            </th>
          ))}
          <th className="w-44 px-3 text-right font-medium">Action</th>
        </tr>
      </thead>
      <tbody>
        {preferences.map((item, index) => (
          <tr key={item.id} className="border-b border-border last:border-0">
            <td className="px-3 py-3">{item.label}</td>
            {(["email", "push", "sms"] as const).map((channel) => (
              <td key={channel} className="text-center">
                <NotificationCheckbox
                  name={`userPreferences.${index}.${channel}`}
                  label={`${item.label} ${channel}`}
                  disabled={disabled}
                />
              </td>
            ))}
            <td className="text-right">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-primary"
                disabled={disabled}
                onClick={() => onManage(index)}
              >
                Manage Preferences
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function NotificationEventMatrix({
  index,
  disabled,
  onDisableBooking,
}: {
  index: number;
  disabled: boolean;
  onDisableBooking: (apply: () => void) => void;
}) {
  const { control } = useFormContext<NotificationSettings>();
  const group = useWatch({ control, name: `eventGroups.${index}` });
  return (
    <table className="w-full text-left text-xs">
      <thead className="bg-muted/50 text-[10px] uppercase text-muted-foreground">
        <tr>
          <th className="px-3 py-2 font-medium">{group.heading}</th>
          <th className="w-20 text-center font-medium">Email</th>
          <th className="w-20 text-center font-medium">Push</th>
        </tr>
      </thead>
      <tbody>
        {group.events.map((item, rowIndex) => (
          <tr key={item.id} className="border-b border-border last:border-0">
            <td className="px-3 py-3">{item.label}</td>
            {(["email", "push"] as const).map((channel) => (
              <td key={channel} className="text-center">
                <NotificationCheckbox
                  name={`eventGroups.${index}.events.${rowIndex}.${channel}`}
                  label={`${group.title}: ${item.label} ${channel}`}
                  disabled={disabled}
                  onDisable={
                    group.id === "bookings" && channel === "email"
                      ? onDisableBooking
                      : undefined
                  }
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function NotificationTimingFields({ disabled }: { disabled: boolean }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<NotificationSettings>();
  const quiet = useWatch({ control, name: "quietHours" });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-5">
        {(["bookingReminderLeadTime", "subscriptionReminders"] as const).map(
          (name) => (
            <label key={name} className="space-y-1.5 text-xs">
              <span className="block font-medium">
                {name === "bookingReminderLeadTime"
                  ? "Booking Reminder Lead Time"
                  : "Subscription Expiry Reminders"}
              </span>
              <Input
                {...register(name)}
                disabled={disabled}
                aria-invalid={!!errors[name]}
                className="h-9 text-xs"
              />
              {errors[name] && (
                <span role="alert" className="text-destructive">
                  {errors[name]?.message}
                </span>
              )}
            </label>
          ),
        )}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium">Quiet Hours</span>
            <Controller
              control={control}
              name="quietHours"
              render={({ field }) => (
                <Switch
                  aria-label="Enable Quiet Hours"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                  className={field.value ? "bg-secondary" : ""}
                />
              )}
            />
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="time"
              aria-label="Quiet hours start"
              {...register("quietStart")}
              disabled={disabled || !quiet}
              className="h-9 text-xs"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <Input
              type="time"
              aria-label="Quiet hours end"
              {...register("quietEnd")}
              disabled={disabled || !quiet}
              className="h-9 text-xs"
            />
          </div>
          {(errors.quietStart || errors.quietEnd) && (
            <p role="alert" className="mt-1 text-xs text-destructive">
              Enter valid quiet hour times.
            </p>
          )}
        </div>
      </div>
      <div className="flex items-start gap-2 rounded-md border border-warning-border bg-warning-surface px-3 py-2.5 text-[11px]">
        <Info className="size-4 shrink-0 text-secondary" />
        <div>
          <p className="font-semibold text-secondary">
            Critical Alerts Override Quiet Hours
          </p>
          <p>
            Critical security alerts, account verification OTPs, and urgent
            booking cancellations bypass quiet hours.
          </p>
        </div>
      </div>
    </div>
  );
}

export function NotificationDefaultFields({ disabled }: { disabled: boolean }) {
  const {
    control,
    formState: { errors },
  } = useFormContext<NotificationSettings>();
  const retry = useWatch({ control, name: "retryFailed" });
  const fields = [
    {
      name: "enableNewTypes",
      label: "Enable New Notification Types by Default",
    },
    {
      name: "allowMarketingOptOut",
      label: "Allow Users to Opt Out of Marketing",
    },
    {
      name: "allowUserPreferences",
      label: "Allow Users to Manage Preferences",
    },
    {
      name: "automaticTransactional",
      label: "Send Transactional Notifications Automatically",
    },
    { name: "retryFailed", label: "Retry Failed Notifications" },
  ] as const;
  return (
    <div>
      {fields.map((field) => (
        <NotificationToggle key={field.name} {...field} disabled={disabled} />
      ))}
      <label className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span>Max Retry Attempts:</span>
        <Controller
          control={control}
          name="maxRetries"
          render={({ field }) => (
            <Input
              {...field}
              value={Number.isNaN(field.value) ? "" : field.value}
              onChange={(event) =>
                field.onChange(
                  event.target.value === "" ? NaN : Number(event.target.value),
                )
              }
              type="number"
              min={0}
              step={1}
              disabled={disabled || !retry}
              aria-invalid={!!errors.maxRetries}
              className="h-8 w-20 text-xs text-foreground"
            />
          )}
        />
      </label>
      {errors.maxRetries && (
        <p role="alert" className="mt-1 text-xs text-destructive">
          {errors.maxRetries.message}
        </p>
      )}
    </div>
  );
}

export function NotificationActivityTable({
  activity,
}: {
  activity: NotificationSettingsSnapshot["activity"];
}) {
  return (
    <table className="w-full text-left text-xs">
      <thead className="bg-muted/50 text-[10px] uppercase text-muted-foreground">
        <tr>
          {[
            "Notification",
            "Recipient",
            "Channel",
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
            <td className="px-3 py-3">{item.notification}</td>
            <td className="px-3 text-muted-foreground">{item.recipient}</td>
            <td className="px-3">{item.channel}</td>
            <td className="whitespace-nowrap px-3">{item.date}</td>
            <td className="px-3">
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-semibold ${item.status === "Failed" ? "bg-destructive/10 text-destructive" : "bg-secondary/10 text-secondary"}`}
              >
                {item.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
