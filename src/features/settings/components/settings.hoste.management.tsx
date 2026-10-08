"use client";

import { useState } from "react";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsHeader } from "./settings.header";
import { AccessConfirmDialog } from "./access.confirm.dialog";
import {
  HosteBadgeDialog,
  HosteCommissionEditor,
  HostePlanEditor,
  HosteRequirementEditor,
} from "./hoste.settings.editor";
import {
  HosteBadgeFields,
  HosteConfigurationTables,
  HosteControlGroup,
  HosteQuickActions,
  HosteSection,
} from "./hoste.settings.sections";
import { HOSTE_CONTROL_GROUPS } from "../data/settings.hoste.data";
import { mockHosteAdapter } from "../settings.hoste.adapter";
import { useHosteSettings } from "../hooks/settings.hoste.hooks";
import { hosteSettingsSchema } from "../schemas/settings.hoste.schema";
import type {
  HosteSettingsAdapter,
  HosteSnapshot,
  HosteSettings,
  HosteRequirement,
  HostePlan,
  HosteCommission,
} from "../settings.hoste.types";

export function HosteManagementPage({
  adapter = mockHosteAdapter,
}: {
  adapter?: HosteSettingsAdapter;
}) {
  const query = useHosteSettings(adapter);
  if (query.isPending)
    return (
      <div
        role="status"
        aria-label="Loading Hosté settings"
        className="space-y-5 p-8"
      >
        <div className="h-16 w-full animate-pulse rounded-lg bg-muted" />
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
        <h1 className="text-xl font-semibold">Unable to load Hosté settings</h1>
        <p className="my-3 text-sm text-muted-foreground">
          {query.error.message}
        </p>
        <Button onClick={() => query.refetch()}>Try Again</Button>
      </div>
    );
  return (
    <HosteManagementForm
      snapshot={query.data}
      saving={query.isSaving}
      onSave={query.save}
    />
  );
}

function HosteManagementForm({
  snapshot,
  saving,
  onSave,
}: {
  snapshot: HosteSnapshot;
  saving: boolean;
  onSave: (values: HosteSettings) => Promise<HosteSnapshot>;
}) {
  const form = useForm<HosteSettings>({
    resolver: zodResolver(hosteSettingsSchema),
    defaultValues: snapshot.settings,
  });
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState<
    | { kind: "requirement"; value: HosteRequirement }
    | { kind: "plan"; value: HostePlan }
    | { kind: "commission"; value: HosteCommission }
    | null
  >(null);
  const [badge, setBadge] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    title: string;
    description: string;
    action: string;
    confirm: () => void;
    destructive?: boolean;
  } | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const disabled = !snapshot.canManage || saving;
  const matches = (text: string) =>
    text.toLowerCase().includes(search.trim().toLowerCase());
  const tableVisible = matches(
    "Hosté Verification Configuration Requirements Subscription Plans Commission Rules " +
      JSON.stringify(form.getValues("requirements")) +
      JSON.stringify(form.getValues("plans")),
  );
  const groups = HOSTE_CONTROL_GROUPS.filter((group) =>
    matches(group.title + " " + group.fields.flat().join(" ")),
  );
  const badgeVisible = matches(
    "Hosté Verify Badge Fee Duration Verification Renewal",
  );
  const quickVisible = matches(
    "Quick Actions Navigation Directory Verification Requests Subscription Logs Badges Commission",
  );

  const applyRequirement = (value: HosteRequirement) => {
    const items = form.getValues("requirements");
    form.setValue(
      "requirements",
      items.some((item) => item.id === value.id)
        ? items.map((item) => (item.id === value.id ? value : item))
        : [...items, value],
      { shouldDirty: true, shouldValidate: true },
    );
    setEditor(null);
  };
  const applyPlan = (value: HostePlan) => {
    const items = form.getValues("plans");
    form.setValue(
      "plans",
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
          className="mx-auto max-w-[1440px] space-y-5 px-8 pb-8 pt-7"
          onSubmit={form.handleSubmit(async (values) => {
            setError("");
            setSaved(false);
            try {
              const response = await onSave(values);
              form.reset(response.settings);
              setSaved(true);
            } catch (cause) {
              setError(
                cause instanceof Error
                  ? cause.message
                  : "Unable to save settings.",
              );
            }
          })}
        >
          <header>
            <p className="mb-1 text-xs text-muted-foreground">
              <Link href="/settings" className="hover:underline">
                Settings
              </Link>{" "}
              / Hosté Management
            </p>
            <h1 className="text-2xl font-bold">Hosté Management</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Configure Hosté verification, subscriptions, badges, commissions,
              and requirements.
            </p>
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
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-xl font-bold">{stat.value}</p>
                  {stat.detail && (
                    <span
                      className={`rounded px-1.5 py-1 text-[10px] font-semibold ${stat.tone === "secondary" ? "bg-secondary/10 text-secondary" : stat.tone === "primary" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      {stat.detail}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
          {!snapshot.canManage && (
            <p role="status" className="text-xs text-muted-foreground">
              You have read-only access to these settings.
            </p>
          )}
          <div className="grid grid-cols-2 items-start gap-4">
            {groups
              .filter(
                (group) => group.title === "Registration & Approval Settings",
              )
              .map((group) => (
                <HosteControlGroup
                  key={group.title}
                  group={group}
                  disabled={disabled}
                />
              ))}
            {badgeVisible && (
              <HosteSection
                id="hoste-badge"
                title="Hosté Verify Badge"
                action={
                  <span className="rounded bg-secondary/10 px-2 py-1 text-[10px] font-semibold text-secondary">
                    Enabled
                  </span>
                }
              >
                <div className="space-y-4">
                  <HosteBadgeFields disabled={disabled} />
                  <Button
                    type="button"
                    disabled={disabled}
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    onClick={() => setBadge(true)}
                  >
                    Edit Badge Settings
                  </Button>
                </div>
              </HosteSection>
            )}
          </div>
          {tableVisible && (
            <HosteConfigurationTables
              disabled={disabled}
              onRequirement={(value) =>
                setEditor({ kind: "requirement", value })
              }
              onPlan={(value) => setEditor({ kind: "plan", value })}
              onCommission={(value) => setEditor({ kind: "commission", value })}
              onTogglePlan={(index) => {
                const plan = form.getValues(`plans.${index}`);
                if (!plan.enabled) {
                  form.setValue(`plans.${index}.enabled`, true, {
                    shouldDirty: true,
                  });
                  return;
                }
                setConfirmation({
                  title: "Deactivate Subscription Plan?",
                  description: `Deactivate ${plan.name}? New Hostés will no longer be able to select this plan after settings are saved. Existing subscription handling must be enforced by the backend.`,
                  action: "Deactivate Plan",
                  destructive: true,
                  confirm: () =>
                    form.setValue(`plans.${index}.enabled`, false, {
                      shouldDirty: true,
                    }),
                });
              }}
            />
          )}
          <div className="grid grid-cols-2 items-start gap-4">
            {groups
              .filter(
                (group) => group.title !== "Registration & Approval Settings",
              )
              .map((group) => (
                <HosteControlGroup
                  key={group.title}
                  group={group}
                  disabled={disabled}
                />
              ))}
            {quickVisible && <HosteQuickActions />}
          </div>
          {!groups.length &&
            !badgeVisible &&
            !tableVisible &&
            !quickVisible && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No settings match your search.
              </p>
            )}
          <footer className="sticky bottom-0 z-10 flex items-center justify-between gap-4 border border-border bg-card p-4">
            <div aria-live="polite">
              {error ? (
                <p role="alert" className="text-xs text-destructive">
                  {error}
                </p>
              ) : saved && !form.formState.isDirty ? (
                <p className="flex items-center gap-2 text-xs text-secondary">
                  <CheckCircle2 className="size-4" />
                  Settings saved in this preview. No live accounts or payments
                  were changed.
                </p>
              ) : form.formState.isDirty ? (
                <p className="text-xs text-muted-foreground">Unsaved changes</p>
              ) : null}
            </div>
            <div className="flex shrink-0 gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={disabled || !form.formState.isDirty}
                onClick={() =>
                  setConfirmation({
                    title: "Discard Changes?",
                    description:
                      "Your unsaved Hosté management changes will be lost.",
                    action: "Discard Changes",
                    confirm: () => {
                      form.reset(snapshot.settings);
                      setSaved(false);
                      setError("");
                    },
                  })
                }
              >
                <RotateCcw className="size-4" />
                Discard
              </Button>
              <Button
                type="submit"
                disabled={disabled || !form.formState.isDirty}
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save All Changes
              </Button>
            </div>
          </footer>
        </form>
      </div>
      {editor?.kind === "requirement" && (
        <HosteRequirementEditor
          value={editor.value}
          onClose={() => setEditor(null)}
          onApply={applyRequirement}
        />
      )}
      {editor?.kind === "plan" && (
        <HostePlanEditor
          value={editor.value}
          onClose={() => setEditor(null)}
          onApply={applyPlan}
        />
      )}
      {editor?.kind === "commission" && (
        <HosteCommissionEditor
          value={editor.value}
          onClose={() => setEditor(null)}
          onApply={(value) => {
            form.setValue(
              "commissions",
              form
                .getValues("commissions")
                .map((item) => (item.id === value.id ? value : item)),
              { shouldDirty: true, shouldValidate: true },
            );
            setEditor(null);
          }}
        />
      )}
      {badge && (
        <HosteBadgeDialog onClose={() => setBadge(false)}>
          <HosteBadgeFields disabled={disabled} prefix="badge-dialog" />
        </HosteBadgeDialog>
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
