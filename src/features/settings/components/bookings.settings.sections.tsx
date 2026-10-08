"use client";

import type { ReactNode } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SettingsNativeSelect } from "./settings.native.select";
import { SettingsSection } from "./settings.section";
import { BOOKING_CONTROL_GROUPS } from "../data/settings.bookings.data";
import type {
  BookingControlGroup,
  BookingsSettings,
  BookingTypeSettings,
} from "../settings.bookings.types";

export function BookingToggleRows({
  group,
  disabled,
  onDisableGroups,
  prefix = "booking",
}: {
  group: BookingControlGroup;
  disabled: boolean;
  onDisableGroups?: () => void;
  prefix?: string;
}) {
  const { control } = useFormContext<BookingsSettings>();
  return (
    <div
      className={
        group.columns === 2 ? "grid grid-cols-2 gap-x-10 gap-y-5" : "space-y-4"
      }
    >
      {group.fields.map((item) => (
        <div
          key={item.name}
          className="flex min-h-9 items-start justify-between gap-4"
        >
          <label htmlFor={`${prefix}-${item.name}`} className="min-w-0">
            <span className="block text-xs font-semibold">{item.label}</span>
            {item.description && (
              <span className="mt-1 block text-[11px] leading-4 text-muted-foreground">
                {item.description}
              </span>
            )}
          </label>
          <Controller
            control={control}
            name={item.name}
            render={({ field }) => (
              <Switch
                id={`${prefix}-${item.name}`}
                disabled={disabled}
                checked={field.value}
                className={field.value ? "bg-secondary" : ""}
                onCheckedChange={(checked) => {
                  if (
                    item.name === "groupsEnabled" &&
                    !checked &&
                    onDisableGroups
                  )
                    onDisableGroups();
                  else field.onChange(checked);
                }}
              />
            )}
          />
        </div>
      ))}
    </div>
  );
}

export function BookingControlSection({
  group,
  disabled,
  children,
  onDisableGroups,
}: {
  group: BookingControlGroup;
  disabled: boolean;
  children?: ReactNode;
  onDisableGroups?: () => void;
}) {
  return (
    <SettingsSection id={group.id} title={group.title} banded>
      <div className="space-y-5">
        {children}
        <BookingToggleRows
          group={group}
          disabled={disabled}
          onDisableGroups={onDisableGroups}
        />
      </div>
    </SettingsSection>
  );
}

export function BookingRequestFields({ disabled }: { disabled: boolean }) {
  const { register } = useFormContext<BookingsSettings>();
  return (
    <div className="space-y-4">
      <label className="block space-y-2 text-xs font-semibold">
        Minimum Booking Lead Time
        <SettingsNativeSelect disabled={disabled} {...register("leadHours")}>
          {["12", "24", "48"].map((hours) => (
            <option key={hours} value={hours}>
              {hours} hours
            </option>
          ))}
        </SettingsNativeSelect>
      </label>
      <label className="block space-y-2 text-xs font-semibold">
        Maximum Advance Booking Period
        <SettingsNativeSelect disabled={disabled} {...register("advanceDays")}>
          {["30", "60", "90"].map((days) => (
            <option key={days} value={days}>
              {days} days
            </option>
          ))}
        </SettingsNativeSelect>
      </label>
    </div>
  );
}

export function BookingPolicyFields({
  disabled,
  prefix = "booking",
}: {
  disabled: boolean;
  prefix?: string;
}) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BookingsSettings>();
  const policy = BOOKING_CONTROL_GROUPS.find(
    (group) => group.id === "cancellation",
  )!;
  return (
    <div className="space-y-4">
      <BookingToggleRows group={policy} disabled={disabled} prefix={prefix} />
      <div className="grid grid-cols-2 gap-4">
        <label className="space-y-2 text-xs font-semibold">
          Cancellation Deadline (Hours)
          <Input
            type="number"
            min={0}
            disabled={disabled}
            {...register("cancellationDeadlineHours", { valueAsNumber: true })}
          />
          {errors.cancellationDeadlineHours && (
            <span role="alert" className="text-destructive">
              {errors.cancellationDeadlineHours.message}
            </span>
          )}
        </label>
        <label className="space-y-2 text-xs font-semibold">
          Cancellation Fee (Fixed)
          <Input
            type="number"
            min={0}
            disabled={disabled}
            {...register("cancellationFee", { valueAsNumber: true })}
          />
          {errors.cancellationFee && (
            <span role="alert" className="text-destructive">
              {errors.cancellationFee.message}
            </span>
          )}
        </label>
      </div>
      <label className="block space-y-2 text-xs font-semibold">
        Fee Currency
        <SettingsNativeSelect
          disabled={disabled}
          {...register("cancellationCurrency")}
        >
          {["NGN", "USD", "GBP"].map((currency) => (
            <option key={currency}>{currency}</option>
          ))}
        </SettingsNativeSelect>
      </label>
      <label className="block space-y-2 text-xs font-semibold">
        Refund Percentage
        <Input
          type="number"
          min={0}
          max={100}
          disabled={disabled}
          {...register("refundPercent", { valueAsNumber: true })}
        />
        {errors.refundPercent && (
          <span role="alert" className="text-destructive">
            {errors.refundPercent.message}
          </span>
        )}
      </label>
      <div className="flex justify-between gap-4">
        <label
          htmlFor={`${prefix}-policy-rescheduling`}
          className="text-xs font-semibold"
        >
          Allow Rescheduling
        </label>
        <Controller
          control={control}
          name="policyRescheduling"
          render={({ field }) => (
            <Switch
              id={`${prefix}-policy-rescheduling`}
              checked={field.value}
              disabled={disabled}
              onCheckedChange={field.onChange}
              className={field.value ? "bg-secondary" : ""}
            />
          )}
        />
      </div>
      <label className="block space-y-2 text-xs font-semibold">
        Rescheduling Deadline (Hours)
        <Input
          type="number"
          min={0}
          disabled={disabled}
          {...register("reschedulingDeadlineHours", { valueAsNumber: true })}
        />
        {errors.reschedulingDeadlineHours && (
          <span role="alert" className="text-destructive">
            {errors.reschedulingDeadlineHours.message}
          </span>
        )}
      </label>
    </div>
  );
}

export function BookingCapacityFields({ disabled }: { disabled: boolean }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<BookingsSettings>();
  return (
    <SettingsSection
      id="capacity"
      title="Group Capacity & Member Limits"
      banded
    >
      <div className="space-y-4">
        {(
          [
            ["minGroupSize", "Minimum Group Size", "Members"],
            ["maxGroupSize", "Maximum Group Size", "Members"],
            ["maxGroupsPerUser", "Maximum Groups per User", "Groups"],
            ["maxBookingMembers", "Maximum Members per Booking", "Members"],
          ] as const
        ).map(([name, label, unit]) => (
          <label key={name} className="block space-y-2 text-xs font-semibold">
            {label}
            <span className="relative block">
              <Input
                className="pr-20"
                type="number"
                min={1}
                disabled={disabled}
                {...register(name, { valueAsNumber: true })}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-muted-foreground">
                {unit}
              </span>
            </span>
            {errors[name] && (
              <span role="alert" className="text-destructive">
                {errors[name]?.message}
              </span>
            )}
          </label>
        ))}
      </div>
    </SettingsSection>
  );
}

export function BookingExpirationSection({ disabled }: { disabled: boolean }) {
  const { register } = useFormContext<BookingsSettings>();
  const group = BOOKING_CONTROL_GROUPS.find(
    (item) => item.id === "expiration",
  )!;
  return (
    <SettingsSection id="expiration" title={group.title} banded>
      <div className="space-y-5">
        <div className="grid grid-cols-2 items-start gap-10">
          <BookingToggleRows
            group={{ ...group, columns: 1, fields: group.fields.slice(0, 1) }}
            disabled={disabled}
          />
          <label className="block space-y-2 text-xs font-semibold">
            Expiration Time Window
            <SettingsNativeSelect
              disabled={disabled}
              {...register("expirationHours")}
            >
              {["12", "24", "48"].map((hours) => (
                <option key={hours} value={hours}>
                  {hours} hours
                </option>
              ))}
            </SettingsNativeSelect>
          </label>
        </div>
        <BookingToggleRows
          group={{ ...group, fields: group.fields.slice(1) }}
          disabled={disabled}
        />
      </div>
    </SettingsSection>
  );
}

export function BookingTypesTable({
  disabled,
  onEdit,
  onToggle,
}: {
  disabled: boolean;
  onEdit: (value: BookingTypeSettings) => void;
  onToggle: (index: number) => void;
}) {
  const { control } = useFormContext<BookingsSettings>();
  const types = useWatch({ control, name: "bookingTypes" });
  return (
    <SettingsSection
      id="booking-types"
      title="Supported Booking Types"
      banded
      action={
        <Button
          type="button"
          size="sm"
          disabled={disabled}
          onClick={() =>
            onEdit({
              id: crypto.randomUUID(),
              name: "",
              description: "",
              enabled: true,
              commissionPercent: 0,
              requirements: "",
            })
          }
        >
          <Plus className="size-3" />
          Add Booking Type
        </Button>
      }
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {[
              "Booking Type",
              "Description",
              "Status",
              "Rules & Commission",
              "Actions",
            ].map((label) => (
              <TableHead
                key={label}
                className="text-[10px] uppercase text-muted-foreground"
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {types.map((type, index) => (
            <TableRow key={type.id} className="text-xs">
              <TableCell className="font-semibold">{type.name}</TableCell>
              <TableCell className="max-w-[260px] whitespace-normal text-muted-foreground">
                {type.description}
              </TableCell>
              <TableCell>
                <span
                  className={`rounded px-2 py-1 text-[10px] font-semibold ${type.enabled ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}
                >
                  {type.enabled ? "Active" : "Disabled"}
                </span>
              </TableCell>
              <TableCell className="max-w-[240px] whitespace-normal">
                {type.commissionPercent}% Comm. | {type.requirements}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={disabled}
                  className="text-primary"
                  aria-label={`Edit ${type.name}`}
                  onClick={() => onEdit(type)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={disabled}
                  className={
                    type.enabled ? "text-destructive" : "text-secondary"
                  }
                  aria-label={`${type.enabled ? "Disable" : "Enable"} ${type.name}`}
                  onClick={() => onToggle(index)}
                >
                  {type.enabled ? "Disable" : "Enable"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {!types.length && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-8 text-center text-muted-foreground"
              >
                No booking types configured.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </SettingsSection>
  );
}
