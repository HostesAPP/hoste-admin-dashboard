"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SettingsHeader } from "./settings.header";
import { SettingsSection } from "./settings.section";
import {
  NotificationProviderDialog,
  NotificationTemplateEditor,
  NotificationEmailDialog,
  NotificationPreferencesDialog,
  NotificationConfirmDialog,
} from "./notifications.settings.dialogs";
import {
  NotificationActivityTable,
  NotificationDefaultFields,
  NotificationEventMatrix,
  NotificationPreferenceTable,
  NotificationTimingFields,
} from "./notifications.settings.sections";
import { notificationSettingsSchema } from "../schemas/settings.notifications.schema";
import { mockNotificationSettingsAdapter } from "../settings.notifications.adapter";
import { useNotificationSettings } from "../hooks/settings.notifications.hooks";
import type {
  NotificationChannel,
  NotificationSettings,
  NotificationSettingsAdapter,
  NotificationSettingsSnapshot,
  NotificationTemplate,
} from "../settings.notifications.types";

export function NotificationsSettingsPage({
  adapter = mockNotificationSettingsAdapter,
}: {
  adapter?: NotificationSettingsAdapter;
}) {
  const query = useNotificationSettings(adapter);
  if (query.isPending)
    return (
      <div
        role="status"
        aria-label="Loading notification settings"
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
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  if (query.isError)
    return (
      <div role="alert" className="p-8">
        <h1 className="text-xl font-semibold">
          Unable to load notification settings
        </h1>
        <p className="my-3 text-sm text-muted-foreground">
          {query.error.message}
        </p>
        <Button onClick={() => query.refetch()}>Try Again</Button>
      </div>
    );
  return (
    <NotificationsSettingsForm
      snapshot={query.data}
      saving={query.isSaving}
      onSave={query.save}
      onTestEmail={adapter.testEmail}
    />
  );
}

function NotificationsSettingsForm({
  snapshot,
  saving,
  onSave,
  onTestEmail,
}: {
  snapshot: NotificationSettingsSnapshot;
  saving: boolean;
  onSave: NotificationSettingsAdapter["save"];
  onTestEmail: NotificationSettingsAdapter["testEmail"];
}) {
  const form = useForm<NotificationSettings>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: snapshot.settings,
  });
  const channels = useWatch({ control: form.control, name: "channels" });
  const preferences = useWatch({
    control: form.control,
    name: "userPreferences",
  });
  const templates = useWatch({ control: form.control, name: "templates" });
  const [search, setSearch] = useState("");
  const [providerIndex, setProviderIndex] = useState<number | null>(null);
  const [preferenceIndex, setPreferenceIndex] = useState<number | null>(null);
  const [templateChannel, setTemplateChannel] = useState<
    NotificationChannel | "ALL" | null
  >(null);
  const [templateEditor, setTemplateEditor] =
    useState<NotificationTemplate | null>(null);
  const [activityOpen, setActivityOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<{
    title: string;
    description: string;
    action: string;
    destructive?: boolean;
    cancelLabel?: string;
    confirm: () => void;
  } | null>(null);
  const disabled = !snapshot.canManage || saving;
  const matches = (text: string) =>
    text.toLowerCase().includes(search.trim().toLowerCase());
  const groupMatches = (index: number) => {
    const group = snapshot.settings.eventGroups[index];
    return matches(
      `${group.title} ${group.events.map((event) => event.label).join(" ")}`,
    );
  };
  const sectionNames = [
    "Notification Channels Email Push SMS",
    "User Notification Preferences Platform Defaults",
    "Notification Timing Quiet Hours",
    "Platform Notification Defaults Retry Marketing",
    "Notification Templates",
    "Recent Notification Activity",
  ];
  const save = form.handleSubmit(async (values) => {
    setError("");
    setSuccess(false);
    try {
      const response = await onSave(values);
      form.reset(response.settings);
      setSuccess(true);
      toast.success("Changes saved successfully in preview.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to save notification settings.",
      );
    }
  });
  const discard = () =>
    setConfirmation({
      title: "Discard Changes?",
      description:
        "Your unsaved notification configuration and template changes will be lost.",
      action: "Discard",
      cancelLabel: "Keep Editing",
      confirm: () => {
        form.reset(snapshot.settings);
        setError("");
        setSuccess(false);
      },
    });
  const resetSettings = () =>
    setConfirmation({
      title: "Reset Notification Settings?",
      description:
        "This will restore the notification configuration to platform defaults. Current settings will be replaced in your draft.",
      action: "Reset Settings",
      destructive: true,
      confirm: () => {
        form.reset(snapshot.defaults, { keepDefaultValues: true });
        setError("");
        setSuccess(false);
      },
    });
  const templateList = templates.filter(
    (template) =>
      templateChannel === "ALL" || template.channel === templateChannel,
  );

  return (
    <FormProvider {...form}>
      <div className="min-w-[1024px] tracking-normal">
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast:
                "!rounded-full !border-secondary !bg-secondary !text-secondary-foreground",
              description: "!text-secondary-foreground",
            },
          }}
        />
        <SettingsHeader search={search} onSearch={setSearch} />
        <form
          onSubmit={save}
          className="mx-auto max-w-[1440px] space-y-5 px-8 pb-8 pt-7 [&_section]:rounded-lg"
        >
          <header className="flex items-center justify-between gap-5">
            <div>
              <p className="mb-1 text-xs text-muted-foreground">
                <Link href="/settings" className="hover:underline">
                  Settings
                </Link>{" "}
                / Notifications
              </p>
              <h1 className="text-2xl font-bold">Notifications Settings</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Configure platform notifications, delivery channels, alerts, and
                notification preferences
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
          {!snapshot.canManage && (
            <p className="text-xs text-muted-foreground">
              You have view-only access to notification settings.
            </p>
          )}
          {success && !form.formState.isDirty && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-md border border-secondary/30 bg-secondary/10 p-3 text-xs text-secondary"
            >
              <CheckCircle2 className="size-4" />
              Notification settings saved in this preview.
            </div>
          )}
          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
          <div className="grid grid-cols-6 gap-3">
            {snapshot.stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-lg border p-4 ${stat.tone === "warning" ? "border-warning-border bg-warning-surface" : "border-border bg-card"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] text-muted-foreground">
                    {stat.label}
                  </p>
                  {stat.detail && (
                    <span
                      className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${stat.tone === "destructive" ? "bg-destructive/10 text-destructive" : stat.tone === "secondary" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}
                    >
                      {stat.detail}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
          {matches(sectionNames[0]) && (
            <SettingsSection title="Notification Channels">
              <div className="grid grid-cols-3 gap-4">
                {channels.map((channel, index) => {
                  const meta = snapshot.channels.find(
                    (item) => item.id === channel.id,
                  );
                  const label = meta?.label ?? channel.id;
                  const status = !channel.enabled
                    ? "Disabled"
                    : !meta || meta.status === "Disabled"
                      ? "Enabled"
                      : meta.status;
                  return (
                    <div
                      key={channel.id}
                      className="rounded-md border border-border bg-muted/30 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xs font-medium">{label}</h3>
                        <Controller
                          control={form.control}
                          name={`channels.${index}.enabled`}
                          render={({ field }) => (
                            <Switch
                              aria-label={`Enable ${label}`}
                              checked={field.value}
                              disabled={disabled}
                              className={field.value ? "bg-secondary" : ""}
                              onCheckedChange={(enabled) => {
                                if (enabled) field.onChange(true);
                                else
                                  setConfirmation({
                                    title: `Disable ${label}?`,
                                    description: `This turns off the ${label} delivery channel for platform notifications.`,
                                    action: "Disable Channel",
                                    destructive: true,
                                    confirm: () => field.onChange(false),
                                  });
                              }}
                            />
                          )}
                        />
                      </div>
                      <p className="mt-2 min-h-10 text-[11px] leading-4 text-muted-foreground">
                        {meta?.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${channel.enabled ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}
                        >
                          {status}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs text-primary"
                          disabled={disabled}
                          onClick={() => setProviderIndex(index)}
                        >
                          Configure
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!channels.length && (
                <p className="py-5 text-xs text-muted-foreground">
                  No notification channels configured.
                </p>
              )}
            </SettingsSection>
          )}
          {matches(sectionNames[1]) && (
            <SettingsSection title="User Notification Preferences (Platform Defaults)">
              <p className="mb-4 text-xs text-muted-foreground">
                Control system-wide default channels available to each user
                archetype across Hosté.
              </p>
              {preferences.length ? (
                <NotificationPreferenceTable
                  disabled={disabled}
                  onManage={setPreferenceIndex}
                />
              ) : (
                <p className="py-5 text-xs text-muted-foreground">
                  No user preferences available.
                </p>
              )}
            </SettingsSection>
          )}
          <div className="grid grid-cols-2 items-start gap-5">
            {[0, 1].map((columnIndex) => (
              <div key={columnIndex} className="space-y-5">
                {snapshot.settings.eventGroups.map((group, index) =>
                  (index < Math.ceil(snapshot.settings.eventGroups.length / 2)
                    ? 0
                    : 1) === columnIndex && groupMatches(index) ? (
                    <SettingsSection key={group.id} title={group.title}>
                      {group.events.length ? (
                        <NotificationEventMatrix
                          index={index}
                          disabled={disabled}
                          onDisableBooking={(confirm) =>
                            setConfirmation({
                              title: "Disable Booking Alerts?",
                              description:
                                "Users will no longer receive this booking notification via Email.",
                              action: "Disable",
                              confirm,
                            })
                          }
                        />
                      ) : (
                        <p className="py-5 text-xs text-muted-foreground">
                          No notification events configured.
                        </p>
                      )}
                    </SettingsSection>
                  ) : null,
                )}
              </div>
            ))}
          </div>
          {matches(sectionNames[2]) && (
            <SettingsSection title="Notification Timing & Quiet Hours">
              <NotificationTimingFields disabled={disabled} />
            </SettingsSection>
          )}
          <div className="grid grid-cols-2 items-start gap-5">
            {matches(sectionNames[3]) && (
              <SettingsSection title="Platform Notification Defaults">
                <NotificationDefaultFields disabled={disabled} />
              </SettingsSection>
            )}
            {matches(sectionNames[4]) && (
              <SettingsSection
                title="Notification Templates"
                action={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary"
                    onClick={() => setTemplateChannel("ALL")}
                  >
                    Manage Templates
                    <ArrowRight className="size-3" />
                  </Button>
                }
              >
                <div className="space-y-2">
                  {snapshot.templateSummaries.map((summary) => (
                    <div
                      key={summary.channel}
                      className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 px-3 py-2"
                    >
                      <div>
                        <h3 className="text-xs font-medium">{summary.label}</h3>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {summary.summary}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-xs text-primary"
                        onClick={() => setTemplateChannel(summary.channel)}
                      >
                        Manage
                      </Button>
                    </div>
                  ))}
                </div>
                {!snapshot.templateSummaries.length && (
                  <p className="py-5 text-xs text-muted-foreground">
                    No notification templates available.
                  </p>
                )}
              </SettingsSection>
            )}
          </div>
          {matches(sectionNames[5]) && (
            <SettingsSection
              title="Recent Notification Activity"
              action={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-primary"
                  onClick={() => setActivityOpen(true)}
                >
                  View Notification Activity
                  <ArrowRight className="size-3" />
                </Button>
              }
            >
              {snapshot.activity.length ? (
                <NotificationActivityTable activity={snapshot.activity} />
              ) : (
                <p className="py-5 text-xs text-muted-foreground">
                  No recent notification activity.
                </p>
              )}
            </SettingsSection>
          )}
          {!sectionNames.some(matches) &&
            !snapshot.settings.eventGroups.some((_, index) =>
              groupMatches(index),
            ) && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No notification settings match your search.
              </p>
            )}
          <footer className="flex flex-wrap items-center gap-3 rounded-lg bg-primary/10 px-4 py-3">
            <span className="mr-2 text-xs font-medium">Quick Actions:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={resetSettings}
            >
              Reset Settings
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTemplateChannel("ALL")}
            >
              Manage Templates
            </Button>
            {channels.map((channel, index) => (
              <Button
                key={channel.id}
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={() => setProviderIndex(index)}
              >
                Configure{" "}
                {channel.id === "EMAIL"
                  ? "Email"
                  : channel.id === "PUSH"
                    ? "Push"
                    : "SMS"}
              </Button>
            ))}
            <Link
              href="/notifications"
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-2 text-xs hover:bg-muted"
            >
              View Notification Activity
              <ArrowRight className="size-3" />
            </Link>
          </footer>
          {form.formState.isDirty && (
            <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-lg">
              <span className="text-xs text-muted-foreground">
                You have unsaved notification settings.
              </span>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  onClick={discard}
                >
                  Discard Changes
                </Button>
                <Button type="submit" disabled={disabled}>
                  {saving && <Loader2 className="size-4 animate-spin" />}Save
                  Changes
                </Button>
              </div>
            </div>
          )}
        </form>
        {providerIndex !== null && channels[providerIndex].id === "EMAIL" && (
          <NotificationEmailDialog
            configuration={channels[providerIndex].configuration}
            status={
              snapshot.channels.find((channel) => channel.id === "EMAIL")
                ?.status ?? "Not verified"
            }
            onClose={() => setProviderIndex(null)}
            onTest={onTestEmail}
            onApply={(value) => {
              form.setValue(`channels.${providerIndex}.configuration`, value, {
                shouldDirty: true,
                shouldValidate: true,
              });
              setProviderIndex(null);
              toast.success("Email configuration updated in draft.");
            }}
          />
        )}
        {providerIndex !== null && channels[providerIndex].id !== "EMAIL" && (
          <NotificationProviderDialog
            label={
              snapshot.channels.find(
                (channel) => channel.id === channels[providerIndex].id,
              )?.label ?? channels[providerIndex].id
            }
            configuration={channels[providerIndex].configuration}
            onClose={() => setProviderIndex(null)}
            onApply={(value) => {
              form.setValue(`channels.${providerIndex}.configuration`, value, {
                shouldDirty: true,
                shouldValidate: true,
              });
              setProviderIndex(null);
            }}
          />
        )}
        {preferenceIndex !== null && (
          <NotificationPreferencesDialog
            preference={preferences[preferenceIndex]}
            onClose={() => setPreferenceIndex(null)}
            onApply={(categories) => {
              form.setValue(
                `userPreferences.${preferenceIndex}.categories`,
                categories,
                { shouldDirty: true, shouldValidate: true },
              );
              setPreferenceIndex(null);
              toast.success("Preferences updated in draft.");
            }}
          />
        )}
        {templateChannel !== null && (
          <Dialog
            open
            onOpenChange={(open) => {
              if (!open) setTemplateChannel(null);
            }}
          >
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Notification Templates</DialogTitle>
                <DialogDescription>
                  {templateChannel === "ALL" ? "All channels" : templateChannel}{" "}
                  templates
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                {templateList.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between gap-3 border-b py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{template.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {template.subject}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={disabled}
                      onClick={() => {
                        setTemplateChannel(null);
                        setTemplateEditor(template);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                ))}
                {!templateList.length && (
                  <p className="py-5 text-sm text-muted-foreground">
                    No templates available for this channel.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
        {templateEditor && (
          <NotificationTemplateEditor
            template={templateEditor}
            onClose={() => setTemplateEditor(null)}
            onApply={(value) => {
              form.setValue(
                "templates",
                templates.map((template) =>
                  template.id === value.id ? value : template,
                ),
                { shouldDirty: true, shouldValidate: true },
              );
              setTemplateEditor(null);
            }}
          />
        )}
        {activityOpen && (
          <Dialog open onOpenChange={setActivityOpen}>
            <DialogContent className="sm:max-w-[1050px]">
              <DialogHeader>
                <DialogTitle>Recent Notification Activity</DialogTitle>
                <DialogDescription>
                  Recent delivery records supplied by the platform.
                </DialogDescription>
              </DialogHeader>
              {snapshot.activity.length ? (
                <NotificationActivityTable activity={snapshot.activity} />
              ) : (
                <p className="py-5 text-xs text-muted-foreground">
                  No recent notification activity.
                </p>
              )}
              <Link
                href="/notifications"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                View All Notification Activity
                <ArrowRight className="size-3" />
              </Link>
            </DialogContent>
          </Dialog>
        )}
        {confirmation && (
          <NotificationConfirmDialog
            {...confirmation}
            onClose={() => setConfirmation(null)}
            onConfirm={confirmation.confirm}
          />
        )}
      </div>
    </FormProvider>
  );
}
