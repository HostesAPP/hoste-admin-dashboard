"use client";
import { useId } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SettingsNativeSelect } from "./settings.native.select";
import type {
  SecurityControlGroup,
  SecuritySettings,
  SecuritySettingsSnapshot,
} from "../settings.security.types";

type NumberName = {
  [Key in keyof SecuritySettings]: SecuritySettings[Key] extends number
    ? Key
    : never;
}[keyof SecuritySettings];
export function SecurityToggleRows({
  group,
  disabled,
  onDisableLockout,
}: {
  group: SecurityControlGroup;
  disabled: boolean;
  onDisableLockout: () => void;
}) {
  return (
    <div>
      {group.fields.map((field) => (
        <SecurityToggle
          key={field.name}
          field={field}
          disabled={disabled}
          onDisableLockout={onDisableLockout}
        />
      ))}
    </div>
  );
}
function SecurityToggle({
  field: definition,
  disabled,
  onDisableLockout,
}: {
  field: SecurityControlGroup["fields"][number];
  disabled: boolean;
  onDisableLockout: () => void;
}) {
  const id = useId();
  const { control } = useFormContext<SecuritySettings>();
  return (
    <div className="flex items-center justify-between gap-5 py-2.5">
      <div>
        <label htmlFor={id} className="text-xs font-semibold">
          {definition.label}
        </label>
        {definition.description && (
          <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
            {definition.description}
          </p>
        )}
      </div>
      <Controller
        control={control}
        name={definition.name}
        render={({ field }) => (
          <Switch
            id={id}
            title={
              definition.required ? "Required for administrators" : undefined
            }
            disabled={disabled || definition.required}
            checked={field.value}
            onCheckedChange={(enabled) => {
              if (definition.name === "accountLockout" && !enabled)
                onDisableLockout();
              else field.onChange(enabled);
            }}
          />
        )}
      />
    </div>
  );
}
export function SecurityNumber({
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
  } = useFormContext<SecuritySettings>();
  return (
    <div>
      <label className="flex items-center justify-between gap-4 py-2.5 text-xs font-semibold">
        <span>{label}</span>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              min={1}
              step={1}
              value={Number.isNaN(field.value) ? "" : field.value}
              onChange={(event) =>
                field.onChange(
                  event.target.value === "" ? NaN : Number(event.target.value),
                )
              }
              disabled={disabled}
              aria-invalid={!!errors[name]}
              className="h-9 w-32 text-xs"
            />
          )}
        />
      </label>
      {errors[name] && (
        <p role="alert" className="text-xs text-destructive">
          {errors[name]?.message}
        </p>
      )}
    </div>
  );
}
export function SecurityDuration({
  name,
  label,
  options,
  disabled,
}: {
  name: "passwordExpiryDays" | "lockoutMinutes" | "sessionTimeoutMinutes";
  label: string;
  options: readonly { value: number; label: string }[];
  disabled: boolean;
}) {
  const { control } = useFormContext<SecuritySettings>();
  return (
    <label className="flex items-center justify-between gap-4 py-2.5 text-xs font-semibold">
      <span>{label}</span>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <SettingsNativeSelect
            name={field.name}
            ref={field.ref}
            onBlur={field.onBlur}
            value={field.value}
            onChange={(event) => field.onChange(Number(event.target.value))}
            disabled={disabled}
            wrapperClassName="w-40"
            className="h-9 font-normal"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SettingsNativeSelect>
        )}
      />
    </label>
  );
}
export function SecurityStatus({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${status === "Failed" ? "bg-destructive/10 text-destructive" : status === "Idle" ? "bg-warning-surface text-warning" : status === "Revoked" ? "bg-muted text-muted-foreground" : "bg-secondary/10 text-secondary"}`}
    >
      {status}
    </span>
  );
}
export function SecuritySessionsTable({
  sessions,
  disabled,
  onRevoke,
}: {
  sessions: SecuritySettingsSnapshot["sessions"];
  disabled: boolean;
  onRevoke: (id: string) => void;
}) {
  return (
    <table className="w-full text-left text-[11px]">
      <thead className="bg-muted/40 text-[10px] uppercase text-muted-foreground">
        <tr>
          {["Device / IP", "Location", "Status", "Action"].map((label) => (
            <th key={label} className="px-2 py-2 font-medium">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sessions.map((session) => (
          <tr key={session.id} className="border-b last:border-0">
            <td className="px-2 py-3">
              <p className="font-semibold">{session.device}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {session.ip}
              </p>
            </td>
            <td className="px-2">{session.location}</td>
            <td className="px-2">
              <SecurityStatus status={session.status} />
            </td>
            <td>
              {session.status === "Current" ? (
                <span
                  aria-label="Current session cannot be revoked"
                  className="px-2 text-muted-foreground"
                >
                  —
                </span>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-[11px] text-primary"
                  disabled={disabled}
                  onClick={() => onRevoke(session.id)}
                >
                  Revoke
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export function SecurityActivityTable({
  activity,
}: {
  activity: SecuritySettingsSnapshot["activity"];
}) {
  return (
    <table className="w-full text-left text-[11px]">
      <thead className="bg-muted/40 text-[10px] uppercase text-muted-foreground">
        <tr>
          {["Event", "User", "Status"].map((label) => (
            <th key={label} className="px-2 py-2 font-medium">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {activity.map((item) => (
          <tr key={item.id} className="border-b last:border-0">
            <td className="px-2 py-3">
              <p className="font-semibold">{item.event}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {item.detail}
              </p>
            </td>
            <td className="px-2">{item.user}</td>
            <td className="px-2">
              <SecurityStatus status={item.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export function SecurityNotificationsMatrix({
  disabled,
}: {
  disabled: boolean;
}) {
  const { control } = useFormContext<SecuritySettings>();
  const notifications = useWatch({ control, name: "notifications" });
  return (
    <table className="w-full text-left text-xs">
      <thead className="border-b text-[10px] uppercase text-muted-foreground">
        <tr>
          <th className="py-2 font-medium">Event Trigger</th>
          <th className="w-20 text-center font-medium">Email</th>
          <th className="w-20 text-center font-medium">Push</th>
        </tr>
      </thead>
      <tbody>
        {notifications.map((notification, index) => (
          <tr key={notification.id}>
            <td className="py-2.5">{notification.label}</td>
            {(["email", "push"] as const).map((channel) => (
              <td key={channel} className="text-center">
                <Controller
                  control={control}
                  name={`notifications.${index}.${channel}`}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label={`${notification.label} ${channel}`}
                      disabled={disabled}
                      className="peer-checked:border-secondary peer-checked:bg-secondary"
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
