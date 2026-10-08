"use client";
import { useState } from "react";
import Link from "next/link";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Info, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SettingsHeader } from "./settings.header";
import { SettingsSection } from "./settings.section";
import { AccessConfirmDialog } from "./access.confirm.dialog";
import {
  SecurityIpDialog,
  SecurityLockoutDialog,
  SecurityTwoFactorDialog,
} from "./security.settings.dialogs";
import {
  SecurityActivityTable,
  SecurityDuration,
  SecurityNotificationsMatrix,
  SecurityNumber,
  SecuritySessionsTable,
  SecurityStatus,
  SecurityToggleRows,
} from "./security.settings.sections";
import { SECURITY_CONTROL_GROUPS } from "../data/settings.security.data";
import { securitySettingsSchema } from "../schemas/settings.security.schema";
import { mockSecuritySettingsAdapter } from "../settings.security.adapter";
import { useSecuritySettings } from "../hooks/settings.security.hooks";
import type {
  SecurityIpRestrictions,
  SecuritySettings,
  SecuritySettingsAdapter,
  SecuritySettingsSnapshot,
} from "../settings.security.types";

export function SecuritySettingsPage({
  adapter = mockSecuritySettingsAdapter,
}: {
  adapter?: SecuritySettingsAdapter;
}) {
  const query = useSecuritySettings(adapter);
  if (query.isPending)
    return (
      <div
        role="status"
        aria-label="Loading security settings"
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
          Unable to load security settings
        </h1>
        <p className="my-3 text-sm text-muted-foreground">
          {query.error.message}
        </p>
        <Button onClick={() => query.refetch()}>Try Again</Button>
      </div>
    );
  return (
    <SecuritySettingsForm
      snapshot={query.data}
      saving={query.isSaving}
      onSave={query.save}
      onRevoke={query.revokeSession}
      onSignOutOthers={query.signOutOthers}
    />
  );
}
function SecuritySettingsForm({
  snapshot,
  saving,
  onSave,
  onRevoke,
  onSignOutOthers,
}: {
  snapshot: SecuritySettingsSnapshot;
  saving: boolean;
  onSave: SecuritySettingsAdapter["save"];
  onRevoke: SecuritySettingsAdapter["revokeSession"];
  onSignOutOthers: SecuritySettingsAdapter["signOutOthers"];
}) {
  const form = useForm<SecuritySettings>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: snapshot.settings,
  });
  const notifications = useWatch({
    control: form.control,
    name: "notifications",
  });
  const [search, setSearch] = useState("");
  const [ipDraft, setIpDraft] = useState<SecurityIpRestrictions | null>(null);
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);
  const [lockoutOpen, setLockoutOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<{
    title: string;
    description: string;
    action: string;
    destructive?: boolean;
    confirm: () => Promise<void>;
  } | null>(null);
  const disabled = !snapshot.canManage || saving;
  const matches = (text: string) =>
    text.toLowerCase().includes(search.trim().toLowerCase());
  const group = (id: string) =>
    SECURITY_CONTROL_GROUPS.find((item) => item.id === id)!;
  const groupMatches = (id: string) => {
    const item = group(id);
    return matches(
      `${item.title} ${item.fields.map((field) => field.label).join(" ")}`,
    );
  };
  const toggles = (id: string, start = 0, end?: number) => (
    <SecurityToggleRows
      group={{ ...group(id), fields: group(id).fields.slice(start, end) }}
      disabled={disabled}
      onDisableLockout={() => setLockoutOpen(true)}
    />
  );
  const save = form.handleSubmit(async (settings) => {
    setError("");
    try {
      const response = await onSave(settings);
      form.reset(response.settings);
      toast.success("Security settings saved in this preview.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to save security settings.",
      );
    }
  });
  const revoke = (id: string) => {
    setSessionsOpen(false);
    setConfirmation({
      title: "Revoke Session?",
      description:
        "This signs out the selected device. Your current session will remain active.",
      action: "Revoke Session",
      destructive: true,
      confirm: async () => {
        await onRevoke(id);
        toast.success("Session revoked in this preview.");
      },
    });
  };
  const signOut = () => {
    setSessionsOpen(false);
    setConfirmation({
      title: "Sign Out All Other Sessions?",
      description:
        "All other devices will be signed out. Your current session will remain active.",
      action: "Sign Out Other Sessions",
      destructive: true,
      confirm: async () => {
        await onSignOutOthers();
        toast.success("Other sessions signed out in this preview.");
      },
    });
  };
  const discard = () =>
    setConfirmation({
      title: "Discard Changes?",
      description: "Your unsaved security configuration will be lost.",
      action: "Discard Changes",
      confirm: async () => {
        form.reset(snapshot.settings);
        setError("");
      },
    });
  const reset = () =>
    setConfirmation({
      title: "Reset Security Defaults?",
      description:
        "This replaces your security configuration draft with the platform defaults. Save Changes to apply the draft.",
      action: "Reset Defaults",
      destructive: true,
      confirm: async () => {
        form.reset(snapshot.defaults, { keepDefaultValues: true });
        setError("");
      },
    });
  const sessions = (
    <>
      {snapshot.sessions.length ? (
        <SecuritySessionsTable
          sessions={snapshot.sessions}
          disabled={disabled}
          onRevoke={revoke}
        />
      ) : (
        <p className="py-5 text-xs text-muted-foreground">
          No sessions available.
        </p>
      )}
      <Button
        type="button"
        size="sm"
        variant="destructive"
        className="mt-8 w-full text-xs"
        disabled={
          disabled ||
          !snapshot.sessions.some((session) => session.status !== "Current")
        }
        onClick={signOut}
      >
        Sign Out All Other Sessions
      </Button>
    </>
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
                / Security
              </p>
              <h1 className="text-2xl font-bold">Security Settings</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Manage authentication, password policies, login protection,
                sessions, and platform security controls.
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
              You have view-only access to security settings.
            </p>
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
                className="rounded-lg border border-border bg-card p-4"
              >
                <p className="text-[11px] text-muted-foreground">
                  {stat.label}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {stat.label === "Security Status" ? (
                    <SecurityStatus status={stat.value} />
                  ) : (
                    <p className="text-lg font-bold">{stat.value}</p>
                  )}
                  <p
                    className={`text-[10px] ${stat.tone === "secondary" ? "text-secondary" : stat.tone === "primary" ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {stat.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[minmax(0,3fr)_minmax(360px,2fr)] items-start gap-5">
            <div className="space-y-5">
              {groupMatches("authentication") && (
                <SettingsSection title="Authentication Security">
                  {toggles("authentication")}
                </SettingsSection>
              )}
              {(groupMatches("password") ||
                matches(
                  "Minimum Password Length Password Expiration Password History Requirement",
                )) && (
                <SettingsSection title="Password Policy">
                  <SecurityNumber
                    name="minimumPasswordLength"
                    label="Minimum Password Length"
                    disabled={disabled}
                  />
                  {toggles("password", 0, 4)}
                  <SecurityDuration
                    name="passwordExpiryDays"
                    label="Password Expiration"
                    options={[
                      { value: 30, label: "30 days" },
                      { value: 60, label: "60 days" },
                      { value: 90, label: "90 days" },
                      { value: 180, label: "180 days" },
                    ]}
                    disabled={disabled}
                  />
                  {toggles("password", 4)}
                  <SecurityNumber
                    name="passwordHistory"
                    label="Password History Requirement"
                    disabled={disabled}
                  />
                  <div className="mt-4 flex items-start gap-2 rounded-md border border-warning-border bg-warning-surface p-3 text-[11px]">
                    <Info className="size-4 shrink-0 text-primary" />
                    <p>
                      Strong password requirements help protect administrator
                      and platform accounts from unauthorized access.
                    </p>
                  </div>
                </SettingsSection>
              )}
              {(groupMatches("login") ||
                matches("Maximum Failed Login Attempts Lockout Duration")) && (
                <SettingsSection title="Login Protection">
                  <SecurityNumber
                    name="maximumFailedLogins"
                    label="Maximum Failed Login Attempts"
                    disabled={disabled}
                  />
                  {toggles("login", 0, 1)}
                  <SecurityDuration
                    name="lockoutMinutes"
                    label="Lockout Duration"
                    options={[
                      { value: 15, label: "15 minutes" },
                      { value: 30, label: "30 minutes" },
                      { value: 60, label: "1 hour" },
                    ]}
                    disabled={disabled}
                  />
                  {toggles("login", 1)}
                </SettingsSection>
              )}
              {(groupMatches("session") ||
                matches(
                  "Session Timeout Maximum Active Sessions per Admin",
                )) && (
                <SettingsSection title="Session Security">
                  <SecurityDuration
                    name="sessionTimeoutMinutes"
                    label="Session Timeout"
                    options={[
                      { value: 30, label: "30 minutes" },
                      { value: 60, label: "1 hour" },
                      { value: 120, label: "2 hours" },
                    ]}
                    disabled={disabled}
                  />
                  {toggles("session", 0, 1)}
                  <SecurityNumber
                    name="maxActiveSessions"
                    label="Maximum Active Sessions per Admin"
                    disabled={disabled}
                  />
                  {toggles("session", 1)}
                </SettingsSection>
              )}
              {(groupMatches("accounts") ||
                matches("Restrict Admin Access by IP Address")) && (
                <SettingsSection title="Admin & Account Protection">
                  {toggles("accounts", 0, 4)}
                  <div className="flex items-center justify-between gap-5 py-2.5">
                    <label
                      htmlFor="security-ip-access"
                      className="text-xs font-semibold"
                    >
                      Restrict Admin Access by IP Address
                    </label>
                    <Controller
                      control={form.control}
                      name="ipRestrictions.enabled"
                      render={({ field }) => (
                        <Switch
                          id="security-ip-access"
                          checked={field.value}
                          disabled={disabled}
                          onCheckedChange={(enabled) => {
                            if (enabled)
                              setIpDraft({
                                ...form.getValues("ipRestrictions"),
                                enabled: true,
                              });
                            else
                              setConfirmation({
                                title: "Disable IP Restrictions?",
                                description:
                                  "Administrators will no longer be restricted to the configured IP addresses.",
                                action: "Disable Restrictions",
                                destructive: true,
                                confirm: async () => field.onChange(false),
                              });
                          }}
                        />
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mb-1 text-xs text-primary"
                    disabled={disabled}
                    onClick={() => setIpDraft(form.getValues("ipRestrictions"))}
                  >
                    Configure IP Access
                  </Button>
                  {toggles("accounts", 4)}
                </SettingsSection>
              )}
              {matches(
                "Security Notifications Matrix Suspicious Login Failed Login New Admin Password Email Account Locked",
              ) && (
                <SettingsSection title="Security Notifications Matrix">
                  {notifications.length ? (
                    <SecurityNotificationsMatrix disabled={disabled} />
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No security notifications configured.
                    </p>
                  )}
                </SettingsSection>
              )}
            </div>
            <aside className="space-y-5">
              <SettingsSection title="Security Quick Actions">
                <p className="mb-3 text-xs text-muted-foreground">
                  Administrative security controls
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setSessionsOpen(true)}
                  >
                    Manage Sessions
                  </Button>
                  <Link
                    href="/audit-logs"
                    className="rounded-md border border-border bg-background px-3 py-2 text-center text-xs font-medium hover:bg-muted"
                  >
                    Review Audit Logs
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    disabled={disabled}
                    onClick={() => setTwoFactorOpen(true)}
                  >
                    Configure 2FA
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="text-xs"
                    disabled={disabled}
                    onClick={reset}
                  >
                    Reset Defaults
                  </Button>
                </div>
              </SettingsSection>
              {matches("Active Sessions Device IP Location Revoke") && (
                <SettingsSection title="Active Sessions">
                  {sessions}
                </SettingsSection>
              )}
              {matches("Recent Security Activity Logs Event User") && (
                <SettingsSection title="Recent Security Activity">
                  {snapshot.activity.length ? (
                    <SecurityActivityTable activity={snapshot.activity} />
                  ) : (
                    <p className="py-5 text-xs text-muted-foreground">
                      No security activity recorded.
                    </p>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="mt-5 w-full text-xs"
                    onClick={() => setActivityOpen(true)}
                  >
                    View Full Security Activity Logs
                    <ArrowRight className="size-3" />
                  </Button>
                </SettingsSection>
              )}
            </aside>
          </div>
          {search &&
            !SECURITY_CONTROL_GROUPS.some((item) => groupMatches(item.id)) &&
            !matches(
              "Minimum Password Length Password Expiration Password History Maximum Failed Login Attempts Lockout Duration Session Timeout Maximum Active Sessions per Admin Restrict Admin Access IP Address Security Notifications Matrix Active Sessions Device IP Location Revoke Recent Security Activity Logs",
            ) && (
              <p className="py-5 text-center text-xs text-muted-foreground">
                No security settings match your search.
              </p>
            )}
          {form.formState.isDirty && (
            <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-lg">
              <span className="text-xs text-muted-foreground">
                You have unsaved security settings.
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
        {ipDraft && (
          <SecurityIpDialog
            restriction={ipDraft}
            currentIp={
              snapshot.sessions.find((session) => session.status === "Current")
                ?.ip ?? null
            }
            onClose={() => setIpDraft(null)}
            onApply={(restriction) => {
              form.setValue("ipRestrictions", restriction, {
                shouldDirty: true,
                shouldValidate: true,
              });
              setIpDraft(null);
            }}
          />
        )}
        {twoFactorOpen && (
          <SecurityTwoFactorDialog
            configuration={form.getValues("twoFactor")}
            onClose={() => setTwoFactorOpen(false)}
            onApply={(configuration) => {
              form.setValue("twoFactor", configuration, {
                shouldDirty: true,
                shouldValidate: true,
              });
              setTwoFactorOpen(false);
            }}
          />
        )}
        {lockoutOpen && (
          <SecurityLockoutDialog
            onClose={() => setLockoutOpen(false)}
            onConfirm={() =>
              form.setValue("accountLockout", false, { shouldDirty: true })
            }
          />
        )}
        {sessionsOpen && (
          <Dialog open onOpenChange={setSessionsOpen}>
            <DialogContent className="tracking-normal sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Manage Sessions</DialogTitle>
                <DialogDescription>
                  Active administrator devices and sessions.
                </DialogDescription>
              </DialogHeader>
              {sessions}
            </DialogContent>
          </Dialog>
        )}
        {activityOpen && (
          <Dialog open onOpenChange={setActivityOpen}>
            <DialogContent className="tracking-normal sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Security Activity Logs</DialogTitle>
                <DialogDescription>
                  Recent security events supplied by the platform.
                </DialogDescription>
              </DialogHeader>
              {snapshot.activity.length ? (
                <SecurityActivityTable activity={snapshot.activity} />
              ) : (
                <p className="text-xs text-muted-foreground">
                  No security activity recorded.
                </p>
              )}
              <Link
                href="/audit-logs"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                View All Audit Logs
                <ArrowRight className="size-3" />
              </Link>
            </DialogContent>
          </Dialog>
        )}
        {confirmation && (
          <AccessConfirmDialog
            {...confirmation}
            onClose={() => setConfirmation(null)}
            onConfirm={confirmation.confirm}
          />
        )}
      </div>
    </FormProvider>
  );
}
