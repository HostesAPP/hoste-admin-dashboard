"use client";

import { useState } from "react";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsHeader } from "./settings.header";
import { SettingsSection } from "./settings.section";
import { AccessConfirmDialog } from "./access.confirm.dialog";
import {
  BookingPolicyDialog,
  BookingTypeEditor,
} from "./bookings.settings.dialogs";
import {
  BookingCapacityFields,
  BookingControlSection,
  BookingExpirationSection,
  BookingPolicyFields,
  BookingRequestFields,
  BookingTypesTable,
} from "./bookings.settings.sections";
import { BOOKING_CONTROL_GROUPS } from "../data/settings.bookings.data";
import { mockBookingsSettingsAdapter } from "../settings.bookings.adapter";
import { useBookingsSettings } from "../hooks/settings.bookings.hooks";
import { bookingsSettingsSchema } from "../schemas/settings.bookings.schema";
import type {
  BookingTypeSettings,
  BookingsSettings,
  BookingsSettingsAdapter,
  BookingsSettingsSnapshot,
} from "../settings.bookings.types";

export function BookingsGroupsSettingsPage({
  adapter = mockBookingsSettingsAdapter,
}: {
  adapter?: BookingsSettingsAdapter;
}) {
  const query = useBookingsSettings(adapter);
  if (query.isPending)
    return (
      <div
        role="status"
        aria-label="Loading booking and group settings"
        className="space-y-5 p-8"
      >
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-6 gap-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  if (query.isError)
    return (
      <div role="alert" className="p-8">
        <h1 className="text-xl font-semibold">
          Unable to load booking settings
        </h1>
        <p className="my-3 text-sm text-muted-foreground">
          {query.error.message}
        </p>
        <Button onClick={() => query.refetch()}>Try Again</Button>
      </div>
    );
  return (
    <BookingsGroupsSettingsForm
      snapshot={query.data}
      saving={query.isSaving}
      onSave={query.save}
    />
  );
}

function BookingsGroupsSettingsForm({
  snapshot,
  saving,
  onSave,
}: {
  snapshot: BookingsSettingsSnapshot;
  saving: boolean;
  onSave: (settings: BookingsSettings) => Promise<BookingsSettingsSnapshot>;
}) {
  const form = useForm<BookingsSettings>({
    resolver: zodResolver(bookingsSettingsSchema),
    defaultValues: snapshot.settings,
  });
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState<BookingTypeSettings | null>(null);
  const [policy, setPolicy] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    title: string;
    description: string;
    action: string;
    destructive?: boolean;
    confirm: () => void;
  } | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const disabled = !snapshot.canManage || saving;
  const matches = (text: string) =>
    text.toLowerCase().includes(search.trim().toLowerCase());
  const group = (id: string) =>
    BOOKING_CONTROL_GROUPS.find((item) => item.id === id)!;
  const groupMatches = (id: string) => {
    const item = group(id);
    return matches(
      item.title +
        " " +
        item.fields
          .map((field) => field.label + " " + (field.description ?? ""))
          .join(" "),
    );
  };
  const requirementsVisible =
    groupMatches("request-requirements") ||
    matches("Minimum Booking Lead Time Maximum Advance Booking Period");
  const policyVisible =
    groupMatches("cancellation") ||
    matches(
      "Cancellation Deadline Fee Currency Refund Percentage Rescheduling Deadline",
    );
  const capacityVisible = matches(
    "Group Capacity Member Limits Minimum Maximum Group Size Groups per User Members per Booking",
  );
  const typesVisible = matches(
    "Supported Booking Types " +
      snapshot.settings.bookingTypes.map((item) => item.name).join(" "),
  );
  const anyVisible =
    requirementsVisible ||
    policyVisible ||
    capacityVisible ||
    typesVisible ||
    [
      "general-bookings",
      "group-rules",
      "group-bookings",
      "assignment",
      "expiration",
    ].some(groupMatches);
  const save = form.handleSubmit(async (values) => {
    setError("");
    setSuccess(false);
    try {
      const response = await onSave(values);
      form.reset(response.settings);
      setSuccess(true);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to save booking settings.",
      );
    }
  });
  const discard = () =>
    setConfirmation({
      title: "Discard Changes?",
      description: "Your unsaved booking and group settings will be lost.",
      action: "Discard Changes",
      confirm: () => {
        form.reset(snapshot.settings);
        setError("");
        setSuccess(false);
      },
    });
  const applyType = (value: BookingTypeSettings) => {
    const items = form.getValues("bookingTypes");
    form.setValue(
      "bookingTypes",
      items.some((item) => item.id === value.id)
        ? items.map((item) => (item.id === value.id ? value : item))
        : [...items, value],
      { shouldDirty: true, shouldValidate: true },
    );
    setEditor(null);
  };

  return (
    <FormProvider {...form}>
      <div className="min-w-[1024px] tracking-normal">
        <SettingsHeader search={search} onSearch={setSearch} />
        <form
          onSubmit={save}
          className="mx-auto max-w-[1440px] space-y-5 px-8 pb-8 pt-7"
        >
          {success && !form.formState.isDirty && (
            <div
              role="status"
              className="flex items-center gap-3 rounded-md border border-secondary/30 bg-secondary/10 px-4 py-3 text-xs font-semibold text-secondary"
            >
              <CheckCircle2 className="size-4" />
              Booking and group settings saved in this preview.
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="ml-auto text-secondary"
                aria-label="Dismiss success message"
                onClick={() => setSuccess(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
          )}
          <header className="flex items-center justify-between gap-5">
            <div>
              <p className="mb-1 text-xs text-muted-foreground">
                <Link href="/settings" className="hover:underline">
                  Settings
                </Link>{" "}
                / Bookings & Groups
              </p>
              <h1 className="text-2xl font-bold">Bookings & Groups Settings</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Configure platform-wide booking rules, cancellation policies,
                group settings, and operational preferences.
              </p>
            </div>
            <Button
              type="submit"
              disabled={disabled || !form.formState.isDirty}
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save Changes
            </Button>
          </header>
          <div className="grid grid-cols-6 gap-3">
            {snapshot.stats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-lg border border-border bg-card p-4"
              >
                <p className="text-[11px] font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`text-xl font-bold ${stat.tone === "primary" ? "text-primary" : stat.tone === "destructive" ? "text-destructive" : stat.label === "Confirmed Bookings" ? "text-secondary" : ""}`}
                  >
                    {stat.value}
                  </span>
                  <span
                    className={`text-[10px] font-semibold ${stat.tone === "secondary" ? "text-secondary" : stat.tone === "primary" ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {stat.detail}
                  </span>
                </div>
              </article>
            ))}
          </div>
          {!snapshot.canManage && (
            <p role="status" className="text-xs text-muted-foreground">
              You have read-only access to these settings.
            </p>
          )}
          <nav
            aria-label="Booking settings quick actions"
            className="flex flex-wrap items-center gap-2 rounded-md border border-primary/30 bg-primary/5 p-4"
          >
            <span className="mr-2 text-[11px] font-bold uppercase">
              Quick Actions:
            </span>
            {[
              ["Manage Booking Types", "#booking-types"],
              ["Manage Cancellation Policy", "#cancellation"],
              ["Manage Group Rules", "#group-rules"],
              ["View Booking Settings", "#general-bookings"],
              ["View Group Management", "/groups"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="rounded-md border border-border bg-card px-3 py-2 text-[11px] font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {label}
              </Link>
            ))}
          </nav>
          {groupMatches("general-bookings") && (
            <BookingControlSection
              group={group("general-bookings")}
              disabled={disabled}
            />
          )}
          {typesVisible && (
            <BookingTypesTable
              disabled={disabled}
              onEdit={setEditor}
              onToggle={(index) => {
                const item = form.getValues(`bookingTypes.${index}`);
                if (!item.enabled) {
                  form.setValue(`bookingTypes.${index}.enabled`, true, {
                    shouldDirty: true,
                  });
                  return;
                }
                setConfirmation({
                  title: "Disable Booking Type?",
                  description: `Disable ${item.name} for new booking requests after saving these settings?`,
                  action: "Disable Type",
                  destructive: true,
                  confirm: () =>
                    form.setValue(`bookingTypes.${index}.enabled`, false, {
                      shouldDirty: true,
                    }),
                });
              }}
            />
          )}
          <div className="grid grid-cols-2 items-start gap-5">
            {requirementsVisible && (
              <BookingControlSection
                group={group("request-requirements")}
                disabled={disabled}
              >
                <BookingRequestFields disabled={disabled} />
              </BookingControlSection>
            )}
            {policyVisible && (
              <SettingsSection
                id="cancellation"
                title="Cancellation & Rescheduling Policies"
                banded
              >
                <BookingPolicyFields disabled={disabled} />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-5 w-full border-primary/30 text-primary"
                  disabled={disabled}
                  onClick={() => setPolicy(true)}
                >
                  Manage Cancellation Policy
                </Button>
              </SettingsSection>
            )}
          </div>
          {groupMatches("group-rules") && (
            <BookingControlSection
              group={group("group-rules")}
              disabled={disabled}
              onDisableGroups={() =>
                setConfirmation({
                  title: "Disable Groups Platform-Wide?",
                  description:
                    "New group creation and management will be disabled after saving. Existing group availability remains subject to the backend's access policy.",
                  action: "Disable Groups",
                  destructive: true,
                  confirm: () =>
                    form.setValue("groupsEnabled", false, {
                      shouldDirty: true,
                    }),
                })
              }
            />
          )}
          <div className="grid grid-cols-2 items-start gap-5">
            {groupMatches("group-bookings") && (
              <BookingControlSection
                group={group("group-bookings")}
                disabled={disabled}
              />
            )}
            {capacityVisible && <BookingCapacityFields disabled={disabled} />}
          </div>
          {groupMatches("assignment") && (
            <BookingControlSection
              group={group("assignment")}
              disabled={disabled}
            />
          )}
          {groupMatches("expiration") && (
            <BookingExpirationSection disabled={disabled} />
          )}
          {!anyVisible && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No settings match your search.
            </p>
          )}
          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
          {Object.keys(form.formState.errors).length > 0 && (
            <p role="alert" className="text-xs text-destructive">
              Review the highlighted settings before saving.
            </p>
          )}
          {form.formState.isDirty && (
            <footer className="sticky bottom-0 z-10 flex items-center justify-between gap-4 rounded-lg bg-foreground p-4 text-background">
              <p className="text-xs">
                You have unsaved changes in Booking & Group rules.
              </p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  className="border-background/40 bg-transparent text-background hover:bg-background/10 hover:text-background"
                  onClick={discard}
                >
                  Cancel / Discard
                </Button>
                <Button type="submit" disabled={disabled}>
                  {saving && <Loader2 className="size-4 animate-spin" />}Save
                  Changes
                </Button>
              </div>
            </footer>
          )}
        </form>
      </div>
      {editor && (
        <BookingTypeEditor
          value={editor}
          onClose={() => setEditor(null)}
          onApply={applyType}
        />
      )}
      {policy && (
        <BookingPolicyDialog
          disabled={disabled}
          onClose={() => setPolicy(false)}
        />
      )}
      {confirmation && (
        <AccessConfirmDialog
          {...confirmation}
          onClose={() => setConfirmation(null)}
          onConfirm={async () => confirmation.confirm()}
        />
      )}
    </FormProvider>
  );
}
