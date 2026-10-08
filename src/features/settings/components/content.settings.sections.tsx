"use client";
import { useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type {
  ContentControlGroup,
  ContentDocument,
  ContentSettings,
  ContentSettingsSnapshot,
} from "../settings.content.types";

export function ContentToggleRows({
  group,
  disabled,
  onDisableBlog,
}: {
  group: ContentControlGroup;
  disabled: boolean;
  onDisableBlog: (apply: () => void) => void;
}) {
  const { control } = useFormContext<ContentSettings>();
  return (
    <div className="divide-y divide-border">
      {group.fields.map((item) => (
        <ContentToggle
          key={item.name}
          item={item}
          disabled={disabled}
          control={control}
          onDisableBlog={onDisableBlog}
        />
      ))}
    </div>
  );
}
function ContentToggle({
  item,
  disabled,
  control,
  onDisableBlog,
}: {
  item: ContentControlGroup["fields"][number];
  disabled: boolean;
  control: ReturnType<typeof useFormContext<ContentSettings>>["control"];
  onDisableBlog: (apply: () => void) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-5 py-3">
      <div>
        <label htmlFor={id} className="text-xs font-semibold">
          {item.label}
        </label>
        {item.description && (
          <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
      <Controller
        control={control}
        name={item.name}
        render={({ field }) => (
          <Switch
            id={id}
            checked={field.value}
            disabled={disabled}
            className={field.value ? "bg-secondary" : ""}
            onCheckedChange={(enabled) => {
              if (
                !enabled &&
                (item.name === "showBlog" || item.name === "blogEnabled")
              )
                onDisableBlog(() => field.onChange(false));
              else field.onChange(enabled);
            }}
          />
        )}
      />
    </div>
  );
}
export function ContentNumber({
  name,
  label,
  disabled,
}: {
  name: "maxActiveBanners" | "postsPerPage";
  label: string;
  disabled: boolean;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext<ContentSettings>();
  return (
    <div>
      <label className="flex items-center justify-between gap-4 py-3 text-xs font-semibold">
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
              className="h-8 w-20 text-center text-xs"
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
export function ContentStatus({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${status === "Draft" ? "bg-warning-surface text-warning" : status === "Unpublished" ? "bg-destructive/10 text-destructive" : "bg-secondary/10 text-secondary"}`}
    >
      {status}
    </span>
  );
}
export function ContentDocumentsTable({
  documents,
  disabled,
  onEdit,
}: {
  documents: ContentDocument[];
  disabled: boolean;
  onEdit: (document: ContentDocument) => void;
}) {
  return (
    <table className="w-full text-left text-xs">
      <thead className="bg-muted/50 text-[10px] uppercase text-muted-foreground">
        <tr>
          {["Page Title", "Status", "Last Updated", "Action"].map((label) => (
            <th key={label} className="px-3 py-2 font-medium">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {documents.map((item) => (
          <tr key={item.id} className="border-b border-border last:border-0">
            <td className="px-3 py-3 font-semibold">{item.title}</td>
            <td className="px-3">
              <ContentStatus status={item.status} />
            </td>
            <td className="px-3 text-[11px] text-muted-foreground">
              {item.updatedAt}
            </td>
            <td className="px-3">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-xs text-primary"
                disabled={disabled}
                onClick={() => onEdit(item)}
              >
                Edit
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export function ContentActivityTable({
  activity,
}: {
  activity: ContentSettingsSnapshot["activity"];
}) {
  return (
    <table className="w-full text-left text-xs">
      <thead className="bg-muted/50 text-[10px] uppercase text-muted-foreground">
        <tr>
          {["Content Title", "Type", "Admin", "Date & Time", "Status"].map(
            (label) => (
              <th key={label} className="px-3 py-2 font-medium">
                {label}
              </th>
            ),
          )}
        </tr>
      </thead>
      <tbody>
        {activity.map((item) => (
          <tr key={item.id} className="border-b border-border last:border-0">
            <td className="px-3 py-3 font-semibold">{item.title}</td>
            <td className="px-3 text-muted-foreground">{item.type}</td>
            <td className="px-3 text-muted-foreground">{item.admin}</td>
            <td className="whitespace-nowrap px-3 text-[11px] text-muted-foreground">
              {item.date}
            </td>
            <td className="px-3">
              <ContentStatus status={item.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
