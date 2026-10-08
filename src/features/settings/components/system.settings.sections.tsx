"use client";
import { useId } from "react";
import {
  Controller,
  useFormContext,
  type FieldPathByValue,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SettingsNativeSelect } from "./settings.native.select";
import type {
  SystemSettings,
  SystemSettingsSnapshot,
} from "../settings.system.types";

export function SystemToggle({
  name,
  label,
  description,
  disabled,
  onDisable,
}: {
  name: FieldPathByValue<SystemSettings, boolean>;
  label: string;
  description?: string;
  disabled: boolean;
  onDisable?: (apply: () => void) => void;
}) {
  const id = useId();
  const { control } = useFormContext<SystemSettings>();
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div>
        <label htmlFor={id} className="text-xs font-semibold">
          {label}
        </label>
        {description && (
          <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
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
            checked={field.value}
            disabled={disabled}
            onCheckedChange={(enabled) => {
              if (!enabled && onDisable) onDisable(() => field.onChange(false));
              else field.onChange(enabled);
            }}
          />
        )}
      />
    </div>
  );
}
export function SystemTextField({
  name,
  label,
  disabled,
  readOnly = false,
  type = "text",
}: {
  name: FieldPathByValue<SystemSettings, string>;
  label: string;
  disabled: boolean;
  readOnly?: boolean;
  type?: "text" | "email" | "url" | "datetime-local";
}) {
  const { control } = useFormContext<SystemSettings>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <label className="block space-y-1.5 text-xs">
          <span className="font-semibold">{label}</span>
          <Input
            {...field}
            type={type}
            onInput={
              type === "datetime-local"
                ? (event) => field.onChange(event.currentTarget.value)
                : undefined
            }
            readOnly={readOnly}
            disabled={disabled}
            aria-invalid={!!fieldState.error}
            className={`h-9 text-xs ${readOnly ? "bg-muted/40" : ""}`}
          />
          {fieldState.error && (
            <span role="alert" className="block text-destructive">
              {fieldState.error.message}
            </span>
          )}
        </label>
      )}
    />
  );
}
export function SystemNumberField({
  name,
  label,
  disabled,
}: {
  name: FieldPathByValue<SystemSettings, number>;
  label: string;
  disabled: boolean;
}) {
  const { control } = useFormContext<SystemSettings>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <label className="block space-y-1.5 text-xs">
          <span className="font-semibold">{label}</span>
          <Input
            {...field}
            type="number"
            min={
              name === "estimatedMaintenanceHours" ||
              name === "maintenancePlan.leadHours"
                ? 0
                : 1
            }
            step={name === "estimatedMaintenanceHours" ? "any" : 1}
            value={Number.isNaN(field.value) ? "" : field.value}
            onChange={(event) =>
              field.onChange(
                event.target.value === "" ? NaN : Number(event.target.value),
              )
            }
            disabled={disabled}
            aria-invalid={!!fieldState.error}
            className="h-9 text-xs"
          />
          {fieldState.error && (
            <span role="alert" className="block text-destructive">
              {fieldState.error.message}
            </span>
          )}
        </label>
      )}
    />
  );
}
export function SystemSelect({
  name,
  label,
  options,
  numeric = false,
  disabled,
}: {
  name:
    | "timezone"
    | "dateFormat"
    | "timeFormat"
    | "cacheRefreshHours"
    | "backupFrequency"
    | "maintenancePlan.leadHours";
  label: string;
  options: readonly { value: string | number; label: string }[];
  numeric?: boolean;
  disabled: boolean;
}) {
  const { control } = useFormContext<SystemSettings>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <label className="block space-y-1.5 text-xs">
          <span className="font-semibold">{label}</span>
          <SettingsNativeSelect
            name={field.name}
            ref={field.ref}
            value={field.value}
            onBlur={field.onBlur}
            onChange={(event) =>
              field.onChange(
                numeric ? Number(event.target.value) : event.target.value,
              )
            }
            disabled={disabled}
            className="h-9 text-xs"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SettingsNativeSelect>
        </label>
      )}
    />
  );
}
export function SystemHealthInfo({
  health,
}: {
  health: SystemSettingsSnapshot["health"];
}) {
  return (
    <dl className="space-y-3 text-[11px]">
      {health.map((item) => (
        <div key={item.label} className="grid grid-cols-2 gap-4">
          <dt className="text-muted-foreground">{item.label}</dt>
          <dd
            className={
              item.healthy ? "font-semibold text-secondary" : "font-semibold"
            }
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
