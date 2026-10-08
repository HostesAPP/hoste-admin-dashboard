"use client";
import { useState } from "react";
import Link from "next/link";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Database, Info, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/sonner";
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
  SystemToggle,
  SystemTextField,
  SystemNumberField,
  SystemSelect,
  SystemHealthInfo,
} from "./system.settings.sections";
import {
  SystemRestoreDialog,
  SystemDisableModuleDialog,
  SystemGatewayDialog,
} from "./system.settings.dialogs";
import { systemSettingsSchema } from "../schemas/settings.system.schema";
import { mockSystemSettingsAdapter } from "../settings.system.adapter";
import { mockFinanceSettingsAdapter } from "../settings.finance.adapter";
import { useSystemSettings } from "../hooks/settings.system.hooks";
import type { FinanceSettingsAdapter } from "../settings.finance.types";
import type {
  SystemBackup,
  SystemOperation,
  SystemSettings,
  SystemSettingsAdapter,
  SystemSettingsSnapshot,
} from "../settings.system.types";

export function SystemSettingsPage({
  adapter = mockSystemSettingsAdapter,
  gatewayAdapter = mockFinanceSettingsAdapter,
}: {
  adapter?: SystemSettingsAdapter;
  gatewayAdapter?: FinanceSettingsAdapter;
}) {
  const query = useSystemSettings(adapter);
  if (query.isPending)
    return (
      <div
        role="status"
        aria-label="Loading system settings"
        className="space-y-5 p-8"
      >
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
        <div className="h-24 animate-pulse rounded-lg bg-muted" />
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  if (query.isError)
    return (
      <div role="alert" className="p-8">
        <h1 className="text-xl font-semibold">
          Unable to load system settings
        </h1>
        <p className="my-3 text-sm text-muted-foreground">
          {query.error.message}
        </p>
        <Button onClick={() => query.refetch()}>Try Again</Button>
      </div>
    );
  return (
    <SystemSettingsForm
      snapshot={query.data}
      saving={query.isSaving}
      onSave={query.save}
      onOperate={query.operate}
      gatewayAdapter={gatewayAdapter}
    />
  );
}
function SystemSettingsForm({
  snapshot,
  saving,
  onSave,
  onOperate,
  gatewayAdapter,
}: {
  snapshot: SystemSettingsSnapshot;
  saving: boolean;
  onSave: SystemSettingsAdapter["save"];
  onOperate: SystemSettingsAdapter["operate"];
  gatewayAdapter: FinanceSettingsAdapter;
}) {
  const form = useForm<SystemSettings>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: snapshot.settings,
  });
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [gatewayOpen, setGatewayOpen] = useState(false);
  const [backupsOpen, setBackupsOpen] = useState(false);
  const [healthOpen, setHealthOpen] = useState(false);
  const [restore, setRestore] = useState<SystemBackup | null>(null);
  const [module, setModule] = useState<{
    label: string;
    isGroups: boolean;
    apply: () => void;
  } | null>(null);
  const [confirmation, setConfirmation] = useState<{
    title: string;
    description: string;
    action: string;
    confirm: () => Promise<void>;
  } | null>(null);
  const disabled = !snapshot.canManage || saving;
  const matches = (text: string) =>
    text.toLowerCase().includes(search.trim().toLowerCase());
  const operate = async (operation: SystemOperation) => {
    const result = await onOperate(operation);
    toast.success(result.message);
  };
  const run = async (operation: SystemOperation) => {
    setError("");
    try {
      await operate(operation);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to complete this action.",
      );
    }
  };
  const save = form.handleSubmit(async (settings) => {
    setError("");
    try {
      const result = await onSave(settings);
      form.reset(result.settings);
      toast.success("System settings saved in this preview.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to save system settings.",
      );
    }
  });
  const maintenance = () =>
    setConfirmation({
      title: "Enable Maintenance Mode?",
      description:
        "Public access will be restricted while maintenance is enabled. This change is staged until you save settings.",
      action: "Enable Maintenance",
      confirm: async () => {
        form.setValue("maintenanceMode", true, { shouldDirty: true });
      },
    });
  const discard = () =>
    setConfirmation({
      title: "Discard Changes?",
      description: "Your unsaved system configuration will be lost.",
      action: "Discard Changes",
      confirm: async () => {
        form.reset(snapshot.settings);
        setError("");
      },
    });
  const action = (label: string, operation: SystemOperation) =>
    setConfirmation({
      title: `${label}?`,
      description:
        "This preview does not run infrastructure operations or change live platform data.",
      action: label,
      confirm: () => operate(operation),
    });
  const lastBackup = snapshot.backups[0];
  const link = (label: string, href: string) => (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
    >
      {label}
      <ArrowRight className="size-3" />
    </Link>
  );
  const section = (
    title: string,
    children: React.ReactNode,
    actionNode?: React.ReactNode,
  ) =>
    matches(title) ? (
      <SettingsSection title={title} action={actionNode}>
        {children}
      </SettingsSection>
    ) : null;
  const text = (
    name: Parameters<typeof SystemTextField>[0]["name"],
    label: string,
    readOnly = false,
  ) => (
    <SystemTextField
      name={name}
      label={label}
      disabled={disabled}
      readOnly={readOnly}
    />
  );
  const number = (
    name: Parameters<typeof SystemNumberField>[0]["name"],
    label: string,
  ) => <SystemNumberField name={name} label={label} disabled={disabled} />;
  const toggle = (
    name: Parameters<typeof SystemToggle>[0]["name"],
    label: string,
    description?: string,
  ) => (
    <SystemToggle
      name={name}
      label={label}
      description={description}
      disabled={disabled}
    />
  );
  return (
    <div className="min-w-[1024px] tracking-normal">
      <SettingsHeader search={search} onSearch={setSearch} />
      <FormProvider {...form}>
        <form onSubmit={save} className="space-y-5 p-8 [&_section]:rounded-lg">
          <header className="flex items-center justify-between gap-5">
            <div>
              <p className="text-xs text-muted-foreground">
                <Link href="/settings">Settings</Link> /{" "}
                <span className="text-primary">System</span>
              </p>
              <h1 className="mt-1 text-2xl font-bold">System</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Manage platform configuration, system status, maintenance,
                integrations, and operational settings.
              </p>
            </div>
            <Button
              type="submit"
              disabled={disabled || !form.formState.isDirty}
            >
              <Save className="size-4" />
              Save Changes
            </Button>
          </header>
          {!snapshot.canManage && (
            <p role="status" className="text-xs text-muted-foreground">
              You have read-only access to system settings.
            </p>
          )}
          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
          <div className="grid grid-cols-6 gap-3">
            {snapshot.stats.map((stat, index) => (
              <div
                key={stat.label}
                className="min-w-0 rounded-lg border border-border bg-card p-3"
              >
                <p className="text-[11px] text-muted-foreground">
                  {stat.label}
                </p>
                {index === 0 ? (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-1 text-[11px] font-semibold text-secondary">
                    <CheckCircle2 className="size-3" />
                    {stat.value}
                  </span>
                ) : (
                  <p className="mt-2 text-base font-bold">{stat.value}</p>
                )}
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[minmax(0,3fr)_minmax(340px,2fr)] items-start gap-5">
            <div className="space-y-5">
              {section(
                "Platform Status & Maintenance Control",
                <div className="space-y-3">
                  <Controller
                    control={form.control}
                    name="maintenanceMode"
                    render={({ field }) => (
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <label
                            htmlFor="system-maintenance"
                            className="text-xs font-semibold"
                          >
                            Maintenance Mode
                          </label>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            Temporarily disable platform access for regular
                            users.
                          </p>
                        </div>
                        <Switch
                          id="system-maintenance"
                          checked={field.value}
                          disabled={disabled}
                          onCheckedChange={(enabled) =>
                            enabled ? maintenance() : field.onChange(false)
                          }
                        />
                      </div>
                    )}
                  />
                  {text("maintenanceMessage", "Maintenance Message")}
                  <div className="grid grid-cols-2 gap-4">
                    {number(
                      "estimatedMaintenanceHours",
                      "Estimated Maintenance Duration (Hours)",
                    )}
                    {toggle(
                      "allowAdminAccess",
                      "Allow Admin Access During Maintenance",
                    )}
                  </div>
                  <Notice>
                    Enabling maintenance mode prevents public bookings and
                    listings from being updated.
                  </Notice>
                </div>,
              )}
              {section(
                "Platform Configuration",
                <div className="grid grid-cols-2 gap-4">
                  {text("platformName", "Platform Name")}
                  {text("platformUrl", "Platform URL")}
                  <SystemSelect
                    name="timezone"
                    label="Default Time Zone"
                    disabled={disabled}
                    options={[
                      {
                        value: "Africa/Lagos",
                        label: "Africa/Lagos (WAT, UTC+1)",
                      },
                    ]}
                  />
                  {text("currency", "Default Currency", true)}
                  <SystemSelect
                    name="dateFormat"
                    label="Date Format"
                    disabled={disabled}
                    options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].map(
                      (value) => ({ value, label: value }),
                    )}
                  />
                  <SystemSelect
                    name="timeFormat"
                    label="Time Format"
                    disabled={disabled}
                    options={[
                      { value: "12_HOUR", label: "12-hour (e.g. 01:01 PM)" },
                      { value: "24_HOUR", label: "24-hour (e.g. 13:01)" },
                    ]}
                  />
                  {text("language", "Language", true)}
                  {text("country", "Primary Country", true)}
                </div>,
              )}
              {section(
                "System Performance & Operational Controls",
                <div className="space-y-3">
                  {toggle(
                    "redisCaching",
                    "Redis Application Caching",
                    "Cache query responses for listings, search results, and static data.",
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <SystemSelect
                      name="cacheRefreshHours"
                      label="Cache Refresh Interval"
                      numeric
                      disabled={disabled}
                      options={[1, 6, 12, 24].map((value) => ({
                        value,
                        label: `Every ${value} Hours`,
                      }))}
                    />
                    {toggle(
                      "backgroundProcessing",
                      "Automatic Background Processing",
                      "Queue system jobs asynchronously.",
                    )}
                  </div>
                  {toggle(
                    "healthMonitoring",
                    "System Health & Performance Monitoring",
                  )}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={disabled}
                      onClick={() =>
                        action("Clear Cache", { type: "CLEAR_CACHE" })
                      }
                    >
                      Clear Cache
                    </Button>
                    <span className="text-[11px] text-muted-foreground">
                      Flush all Redis memory keys safely.
                    </span>
                  </div>
                </div>,
              )}
              {section(
                "Connected Platform Integrations",
                <div className="space-y-2">
                  {snapshot.integrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="flex items-center gap-3 rounded-md border border-border bg-muted/30 p-3"
                    >
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-bold ${integration.tone === "primary" ? "bg-primary text-primary-foreground" : integration.tone === "secondary" ? "bg-secondary text-secondary-foreground" : "bg-foreground text-background"}`}
                      >
                        {integration.label[0]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold">
                          {integration.label}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {integration.description}
                        </p>
                      </div>
                      <span className="rounded-full bg-secondary/10 px-2 py-1 text-[10px] font-semibold text-secondary">
                        {integration.status}
                      </span>
                      {integration.id === "paystack" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={disabled}
                          onClick={() => setGatewayOpen(true)}
                        >
                          Configure
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          nativeButton={false}
                          render={<Link href="/settings/notifications" />}
                        >
                          Configure
                        </Button>
                      )}
                    </div>
                  ))}
                </div>,
              )}
              {section(
                "System Email Defaults & Storage",
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    {text("senderName", "Sender Name")}
                    <SystemTextField
                      name="senderEmail"
                      label="Sender Email"
                      type="email"
                      disabled={disabled}
                    />
                    <SystemTextField
                      name="replyTo"
                      label="Reply-To Email"
                      type="email"
                      disabled={disabled}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={disabled}
                      className="self-end"
                      onClick={async () => {
                        if (await form.trigger(["senderEmail", "replyTo"]))
                          await run({
                            type: "TEST_EMAIL",
                            senderEmail: form.getValues("senderEmail"),
                            replyTo: form.getValues("replyTo"),
                          });
                      }}
                    >
                      Send Test Email
                    </Button>
                  </div>
                  <h3 className="text-xs font-semibold">
                    Database & File Storage Status
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {snapshot.storage.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-md border border-border bg-muted/30 p-3"
                      >
                        <p className="text-[10px] text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-secondary">
                          {item.status}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {toggle("automaticBackup", "Automatic Database Backup")}
                    <SystemSelect
                      name="backupFrequency"
                      label="Backup Frequency"
                      disabled={disabled}
                      options={[
                        { value: "DAILY_0200", label: "Daily at 02:00 UTC" },
                        { value: "WEEKLY", label: "Weekly" },
                        { value: "MANUAL", label: "Manual" },
                      ]}
                    />
                  </div>
                </div>,
              )}
              {section(
                "Platform Feature Controls",
                <div>
                  {snapshot.settings.modules.map((item, index) => (
                    <SystemToggle
                      key={item.id}
                      name={`modules.${index}.enabled`}
                      label={item.label}
                      description={item.description}
                      disabled={disabled}
                      onDisable={(apply) =>
                        setModule({
                          label: item.label,
                          isGroups: item.id === "groups",
                          apply,
                        })
                      }
                    />
                  ))}
                </div>,
              )}
            </div>
            <div className="space-y-5">
              {matches("System Quick Actions") && (
                <section className="bg-foreground p-5 text-background">
                  <h2 className="text-sm font-semibold">
                    System Quick Actions
                  </h2>
                  <p className="mt-1 text-[11px] opacity-70">
                    Immediate platform operations
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button
                      variant="secondary"
                      className="border border-background/20 bg-background/10 text-background hover:bg-background/20"
                      size="sm"
                      disabled={disabled}
                      onClick={maintenance}
                    >
                      Enable Maintenance
                    </Button>
                    <Button
                      variant="secondary"
                      className="border border-background/20 bg-background/10 text-background hover:bg-background/20"
                      size="sm"
                      disabled={disabled}
                      onClick={() =>
                        action("Clear Cache", { type: "CLEAR_CACHE" })
                      }
                    >
                      Clear Cache
                    </Button>
                    <Button
                      variant="secondary"
                      className="border border-background/20 bg-background/10 text-background hover:bg-background/20"
                      size="sm"
                      disabled={disabled}
                      onClick={() =>
                        action("Create Backup", { type: "CREATE_BACKUP" })
                      }
                    >
                      Create Backup
                    </Button>
                    <Button size="sm" onClick={() => setHealthOpen(true)}>
                      System Health
                    </Button>
                  </div>
                </section>
              )}
              {section(
                "Backup & Recovery Control",
                <div className="space-y-4">
                  {lastBackup ? (
                    <div className="rounded-md border border-border bg-muted/30 p-3">
                      <p className="text-[10px] text-muted-foreground">
                        LAST SUCCESSFUL BACKUP
                      </p>
                      <p className="mt-1 text-xs font-semibold">
                        {lastBackup.date}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        Size: {lastBackup.size} · Type: {lastBackup.type}
                      </p>
                      <span className="mt-2 inline-block rounded-full bg-secondary/10 px-2 py-1 text-[10px] text-secondary">
                        {lastBackup.status}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No backups available.
                    </p>
                  )}
                  {number("backupRetentionDays", "Keep Backups For (Days)")}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      disabled={disabled}
                      onClick={() =>
                        action("Create Backup Now", { type: "CREATE_BACKUP" })
                      }
                    >
                      Create Backup Now
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setBackupsOpen(true)}
                    >
                      Manage Backups
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-destructive/30 bg-destructive/10 text-destructive"
                    disabled={disabled || !lastBackup}
                    onClick={() => setRestore(lastBackup)}
                  >
                    Restore System Backup
                  </Button>
                </div>,
              )}
              {section(
                "Scheduled Maintenance Planner",
                <div className="space-y-4">
                  {toggle(
                    "maintenancePlan.enabled",
                    "Scheduled Maintenance Enabled",
                  )}
                  <div className="grid gap-3">
                    <SystemTextField
                      name="maintenancePlan.startUtc"
                      label="Start Date & Time (UTC)"
                      type="datetime-local"
                      disabled={disabled}
                    />
                    <SystemTextField
                      name="maintenancePlan.endUtc"
                      label="End Date & Time (UTC)"
                      type="datetime-local"
                      disabled={disabled}
                    />
                  </div>
                  {toggle(
                    "maintenancePlan.notifyUsers",
                    "Notify Users Before Maintenance",
                  )}
                  <SystemSelect
                    name="maintenancePlan.leadHours"
                    label="Notification Lead Time"
                    numeric
                    disabled={disabled}
                    options={[
                      { value: 24, label: "24 Hours Prior Banner" },
                      { value: 48, label: "48 Hours Prior Banner" },
                      { value: 1, label: "1 Hour Prior Banner" },
                    ]}
                  />
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={disabled}
                    onClick={async () => {
                      if (await form.trigger("maintenancePlan")) {
                        const plan = form.getValues("maintenancePlan");
                        if (!plan.enabled) {
                          setError(
                            "Enable scheduled maintenance before scheduling a window.",
                          );
                          return;
                        }
                        await run({ type: "SCHEDULE_MAINTENANCE", plan });
                      }
                    }}
                  >
                    Schedule Maintenance Window
                  </Button>
                </div>,
              )}
              {section(
                "System Logs & Health Info",
                <div className="space-y-5">
                  <dl className="space-y-2 rounded-md border border-border bg-muted/30 p-3">
                    {snapshot.logSummary.map((item) => (
                      <div
                        key={item.label}
                        className="flex justify-between gap-3 text-[11px]"
                      >
                        <dt>{item.label}</dt>
                        <dd
                          className={`font-semibold ${item.tone === "primary" ? "text-primary" : "text-secondary"}`}
                        >
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="flex flex-wrap gap-4">
                    {link("System Logs", "/audit-logs")}
                    {link("Error Logs", "/audit-logs")}
                    {link("Audit Trail", "/audit-logs")}
                  </div>
                  <h3 className="text-xs font-semibold">
                    Infrastructure Health & Metadata
                  </h3>
                  <SystemHealthInfo health={snapshot.health} />
                </div>,
              )}
              {section(
                "Audit Log",
                <div className="space-y-4">
                  <Database className="size-6 text-primary" />
                  <p className="text-xs leading-5 text-muted-foreground">
                    View administrative activity, configuration changes, and
                    platform events.
                  </p>
                  {link("View Audit Log", "/audit-logs")}
                </div>,
              )}
            </div>
          </div>
          {search && (
            <p role="status" className="text-xs text-muted-foreground">
              Sections matching: {search}
            </p>
          )}
          <footer className="flex items-center justify-between border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              {form.formState.isDirty
                ? "You have unsaved system settings."
                : "All changes saved."}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                disabled={disabled || !form.formState.isDirty}
                onClick={discard}
              >
                Discard
              </Button>
              <Button
                type="submit"
                disabled={disabled || !form.formState.isDirty}
              >
                <Save className="size-4" />
                Save All Changes
              </Button>
            </div>
          </footer>
        </form>
      </FormProvider>
      {confirmation && (
        <AccessConfirmDialog
          title={confirmation.title}
          description={confirmation.description}
          action={confirmation.action}
          onClose={() => setConfirmation(null)}
          onConfirm={confirmation.confirm}
        />
      )}
      {module && (
        <SystemDisableModuleDialog
          label={module.label}
          isGroups={module.isGroups}
          onClose={() => setModule(null)}
          onConfirm={() => {
            module.apply();
            setModule(null);
          }}
        />
      )}
      {restore && (
        <SystemRestoreDialog
          backup={restore}
          onClose={() => setRestore(null)}
          onRestore={() =>
            operate({ type: "RESTORE_BACKUP", backupId: restore.id })
          }
        />
      )}
      {gatewayOpen && (
        <SystemGatewayDialog
          adapter={gatewayAdapter}
          onClose={() => setGatewayOpen(false)}
        />
      )}
      {backupsOpen && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) setBackupsOpen(false);
          }}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>System Backups</DialogTitle>
              <DialogDescription>Available backup snapshots.</DialogDescription>
            </DialogHeader>
            {snapshot.backups.length ? (
              snapshot.backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between gap-4 border-b border-border py-3"
                >
                  <div>
                    <p className="text-xs font-semibold">{backup.date}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {backup.size} · {backup.status}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    onClick={() => {
                      setBackupsOpen(false);
                      setRestore(backup);
                    }}
                  >
                    Restore
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                No backups available.
              </p>
            )}
          </DialogContent>
        </Dialog>
      )}
      {healthOpen && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) setHealthOpen(false);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>System Health</DialogTitle>
              <DialogDescription>
                Infrastructure status from the current settings snapshot.
              </DialogDescription>
            </DialogHeader>
            <SystemHealthInfo health={snapshot.health} />
          </DialogContent>
        </Dialog>
      )}
      <Toaster
        toastOptions={{
          classNames: {
            toast:
              "!rounded-full !border-secondary !bg-secondary !text-secondary-foreground",
          },
        }}
      />
    </div>
  );
}
function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 rounded-md border border-warning-border bg-warning-surface p-3 text-[11px] leading-4">
      <Info className="size-4 shrink-0 text-primary" />
      <p>{children}</p>
    </div>
  );
}
