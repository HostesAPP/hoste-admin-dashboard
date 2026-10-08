"use client";

import { useState } from "react";
import Link from "next/link";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, LockKeyhole, Loader2, Plus, Save } from "lucide-react";
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
import { AccessConfirmDialog } from "./access.confirm.dialog";
import {
  FinanceCommissionEditor,
  FinanceGatewayDialog,
} from "./finance.settings.dialogs";
import {
  FinanceActivityTable,
  FinanceEscrowFields,
  FinanceNotifications,
  FinancePayoutFields,
  FinanceRefundFields,
  FinanceTransactionFields,
} from "./finance.settings.sections";
import { financeSettingsSchema } from "../schemas/settings.finance.schema";
import { mockFinanceSettingsAdapter } from "../settings.finance.adapter";
import { useFinanceSettings } from "../hooks/settings.finance.hooks";
import type {
  FinanceCommission,
  FinanceSettings,
  FinanceSettingsAdapter,
  FinanceSettingsSnapshot,
} from "../settings.finance.types";

export function PaymentFinanceSettingsPage({
  adapter = mockFinanceSettingsAdapter,
}: {
  adapter?: FinanceSettingsAdapter;
}) {
  const query = useFinanceSettings(adapter);
  if (query.isPending)
    return (
      <div
        role="status"
        aria-label="Loading payment and finance settings"
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
          Unable to load finance settings
        </h1>
        <p className="my-3 text-sm text-muted-foreground">
          {query.error.message}
        </p>
        <Button onClick={() => query.refetch()}>Try Again</Button>
      </div>
    );
  return (
    <PaymentFinanceForm
      snapshot={query.data}
      saving={query.isSaving}
      onSave={query.save}
      onConfigure={query.configureGateway}
      onTest={query.testConnection}
    />
  );
}

function PaymentFinanceForm({
  snapshot,
  saving,
  onSave,
  onConfigure,
  onTest,
}: {
  snapshot: FinanceSettingsSnapshot;
  saving: boolean;
  onSave: FinanceSettingsAdapter["save"];
  onConfigure: FinanceSettingsAdapter["configureGateway"];
  onTest: FinanceSettingsAdapter["testConnection"];
}) {
  const form = useForm<FinanceSettings>({
    resolver: zodResolver(financeSettingsSchema),
    defaultValues: snapshot.settings,
  });
  const commissions = useWatch({ control: form.control, name: "commissions" });
  const methods = useWatch({ control: form.control, name: "methods" });
  const calculation = useWatch({
    control: form.control,
    name: "defaultCalculation",
  });
  const [search, setSearch] = useState("");
  const [gatewayOpen, setGatewayOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [editor, setEditor] = useState<FinanceCommission | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    title: string;
    description: string;
    action: string;
    destructive?: boolean;
    confirm: () => void;
  } | null>(null);
  const disabled = !snapshot.canManage || saving;
  const matches = (title: string) =>
    title.toLowerCase().includes(search.trim().toLowerCase());
  const save = form.handleSubmit(async (values) => {
    setError("");
    setNotice("");
    try {
      const response = await onSave(values);
      form.reset(response.settings);
      setNotice("Payment and finance settings saved in this preview.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to save finance settings.",
      );
    }
  });
  const discard = () =>
    setConfirmation({
      title: "Discard Changes?",
      description: "Your unsaved payment and finance settings will be lost.",
      action: "Discard Changes",
      confirm: () => {
        form.reset(snapshot.settings);
        setError("");
        setNotice("");
      },
    });
  const applyRule = (rule: FinanceCommission) => {
    const apply = () => {
      const current = form.getValues("commissions");
      form.setValue(
        "commissions",
        rule.id
          ? current.map((item) => (item.id === rule.id ? rule : item))
          : [...current, { ...rule, id: crypto.randomUUID() }],
        { shouldDirty: true, shouldValidate: true },
      );
    };
    setEditor(null);
    const previous = commissions.find((item) => item.id === rule.id);
    if (previous)
      setConfirmation({
        title: "Update Commission Rule?",
        description: `This change may affect future booking commissions. Current: ${previous.value}${previous.type === "PERCENTAGE" ? "%" : " NGN"}. New: ${rule.value}${rule.type === "PERCENTAGE" ? "%" : " NGN"}.`,
        action: "Confirm Change",
        confirm: apply,
      });
    else apply();
  };
  const testConnection = async () => {
    setChecking(true);
    setError("");
    setNotice("");
    try {
      setNotice(await onTest());
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Connection check failed.",
      );
    } finally {
      setChecking(false);
    }
  };
  const sectionNames = [
    "Payment Gateway Integration Paystack",
    "Supported Payment Methods",
    "Escrow Configuration",
    "Commission Rules",
    "Payout Settings",
    "Refund Configuration",
    "Transaction Rules",
    "Financial Notifications",
    "Payment & Finance Activity",
  ];

  return (
    <FormProvider {...form}>
      <div className="min-w-[1024px] tracking-normal">
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
                / Payment & Finance
              </p>
              <h1 className="text-2xl font-bold">Payment & Finance</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Manage payment processing, escrow, commissions, refunds,
                payouts, and financial rules
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
              You have view-only access to financial settings.
            </p>
          )}
          {notice && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-md border border-secondary/30 bg-secondary/10 p-3 text-xs text-secondary"
            >
              <CheckCircle2 className="size-4" />
              {notice}
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
                className={`rounded-lg border p-4 ${stat.highlight ? "border-warning/30 bg-warning/10" : "border-border bg-card"}`}
              >
                <p className="text-[11px] text-muted-foreground">
                  {stat.label}
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="text-xl font-bold">{stat.value}</p>
                  {stat.detail && (
                    <span className="rounded bg-secondary/10 px-1.5 py-0.5 text-[10px] font-semibold text-secondary">
                      {stat.detail}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {!sectionNames.some(matches) && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No settings match your search.
            </p>
          )}
          <div className="grid grid-cols-2 items-start gap-5">
            <div className="space-y-5">
              {matches(sectionNames[0]) && (
                <SettingsSection
                  id="finance-gateway"
                  title="Payment Gateway Integration"
                  action={
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${snapshot.gateway.connected ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}
                    >
                      {snapshot.gateway.connected
                        ? "Connected"
                        : "Not connected"}
                    </span>
                  }
                >
                  <dl className="grid grid-cols-[110px_1fr] gap-y-3 text-xs">
                    <dt className="text-muted-foreground">Provider:</dt>
                    <dd>{snapshot.gateway.provider}</dd>
                    <dt className="text-muted-foreground">Public Key:</dt>
                    <dd>{snapshot.gateway.publicKeySummary}</dd>
                    <dt className="text-muted-foreground">Secret Key:</dt>
                    <dd className="flex items-center gap-2">
                      {snapshot.gateway.secretKeySummary}
                      <LockKeyhole className="size-3.5 text-muted-foreground" />
                    </dd>
                    <dt className="text-muted-foreground">Webhook Status:</dt>
                    <dd className="text-secondary">
                      {snapshot.gateway.webhookActive
                        ? "Active"
                        : "Not verified"}
                    </dd>
                  </dl>
                  <div className="mt-4 flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={disabled}
                      onClick={() => setGatewayOpen(true)}
                    >
                      Update Config
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={disabled || checking}
                      onClick={testConnection}
                    >
                      {checking && (
                        <Loader2 className="size-3.5 animate-spin" />
                      )}
                      Test Connection
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-primary"
                      disabled={disabled}
                      onClick={() => setGatewayOpen(true)}
                    >
                      Re-connect
                    </Button>
                  </div>
                </SettingsSection>
              )}
              {matches(sectionNames[1]) && (
                <SettingsSection
                  id="finance-methods"
                  title="Supported Payment Methods"
                >
                  <div className="space-y-2">
                    {methods.map((method, index) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between gap-4 rounded-md border border-border bg-muted/30 px-3 py-2"
                      >
                        <div>
                          <label
                            htmlFor={`method-${method.id}`}
                            className="text-xs font-medium"
                          >
                            {method.label}
                          </label>
                          <p className="text-[11px] text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                        <Controller
                          control={form.control}
                          name={`methods.${index}.enabled`}
                          render={({ field }) => (
                            <Switch
                              id={`method-${method.id}`}
                              checked={field.value}
                              className={field.value ? "bg-secondary" : ""}
                              disabled={disabled}
                              onCheckedChange={(enabled) => {
                                if (enabled) field.onChange(true);
                                else
                                  setConfirmation({
                                    title: `Disable ${method.label}?`,
                                    description:
                                      "Customers will no longer be able to use this payment method for new transactions.",
                                    action: "Disable",
                                    destructive: true,
                                    confirm: () => field.onChange(false),
                                  });
                              }}
                            />
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </SettingsSection>
              )}
              {matches(sectionNames[2]) && (
                <SettingsSection title="Escrow Configuration">
                  <FinanceEscrowFields disabled={disabled} />
                </SettingsSection>
              )}
              {matches(sectionNames[3]) && (
                <SettingsSection
                  id="finance-commissions"
                  title="Commission Rules"
                  action={
                    <Button
                      type="button"
                      size="sm"
                      className="bg-secondary hover:bg-secondary/90"
                      disabled={disabled}
                      onClick={() =>
                        setEditor({
                          id: "",
                          status: "ACTIVE",
                          name: "",
                          category: "",
                          type: "PERCENTAGE",
                          value: 0,
                        })
                      }
                    >
                      <Plus className="size-3.5" />
                      Add Rule
                    </Button>
                  }
                >
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 text-[10px] uppercase text-muted-foreground">
                      <tr>
                        {[
                          "Booking / Hosté Type",
                          "Commission",
                          "Status",
                          "Actions",
                        ].map((label) => (
                          <th key={label} className="p-2 font-medium">
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {commissions.map((rule) => (
                        <tr key={rule.id} className="border-b border-border">
                          <td className="p-2.5">{rule.name}</td>
                          <td className="p-2.5">
                            {rule.type === "PERCENTAGE"
                              ? `${rule.value}%`
                              : `₦${rule.value.toLocaleString()}`}
                          </td>
                          <td className="p-2">
                            <span className="rounded bg-secondary/10 px-1.5 py-0.5 text-[10px] font-semibold text-secondary">
                              Active
                            </span>
                          </td>
                          <td>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-primary"
                              disabled={disabled}
                              onClick={() => setEditor(rule)}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!commissions.length && (
                    <p className="py-4 text-xs text-muted-foreground">
                      No commission rules configured.
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span>Global Calculation Default:</span>
                    <div
                      role="group"
                      aria-label="Global calculation default"
                      className="inline-flex rounded-md border p-1"
                    >
                      {(["PERCENTAGE", "FIXED"] as const).map((value) => (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={calculation === value}
                          disabled={disabled}
                          onClick={() =>
                            form.setValue("defaultCalculation", value, {
                              shouldDirty: true,
                            })
                          }
                          className={`rounded px-2 py-1 focus-visible:outline-2 focus-visible:outline-ring ${calculation === value ? "bg-muted font-semibold text-foreground" : ""}`}
                        >
                          {value === "PERCENTAGE"
                            ? "Percentage (%)"
                            : "Fixed Amount (₦)"}
                        </button>
                      ))}
                    </div>
                  </div>
                </SettingsSection>
              )}
            </div>
            <div className="space-y-5">
              {matches(sectionNames[4]) && (
                <SettingsSection title="Payout Settings">
                  <FinancePayoutFields disabled={disabled} />
                </SettingsSection>
              )}
              {matches(sectionNames[5]) && (
                <SettingsSection
                  title="Refund Configuration"
                  action={
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      disabled={disabled}
                      onClick={() => setPolicyOpen(true)}
                    >
                      Manage Policy
                    </Button>
                  }
                >
                  <FinanceRefundFields disabled={disabled} />
                </SettingsSection>
              )}
              {matches(sectionNames[6]) && (
                <SettingsSection title="Transaction Rules">
                  <FinanceTransactionFields disabled={disabled} />
                </SettingsSection>
              )}
              {matches(sectionNames[7]) && (
                <SettingsSection title="Financial Notifications">
                  <FinanceNotifications disabled={disabled} />
                </SettingsSection>
              )}
            </div>
          </div>
          {matches(sectionNames[8]) && (
            <SettingsSection
              id="finance-activity"
              title="Payment & Finance Activity"
              action={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                  onClick={() => setActivityOpen(true)}
                >
                  View Financial Activity
                </Button>
              }
            >
              {snapshot.activity.length ? (
                <FinanceActivityTable activity={snapshot.activity} />
              ) : (
                <p className="py-5 text-xs text-muted-foreground">
                  No financial activity recorded.
                </p>
              )}
            </SettingsSection>
          )}
          <footer className="flex flex-wrap items-center gap-2 rounded-lg bg-foreground px-4 py-3 text-xs text-background [&_button]:text-foreground">
            <span className="mr-3 font-semibold">Quick Actions:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => setGatewayOpen(true)}
            >
              Configure Paystack
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => {
                setSearch("");
                setEditor({
                  id: "",
                  status: "ACTIVE",
                  name: "",
                  category: "",
                  type: "PERCENTAGE",
                  value: 0,
                });
              }}
            >
              Manage Commission Rules
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => setPolicyOpen(true)}
            >
              Manage Refund Policy
            </Button>
            <Link
              href="/payments"
              className="rounded-md border border-background/30 px-3 py-2 hover:bg-background/10"
            >
              Manage Payouts
            </Link>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActivityOpen(true)}
            >
              View Financial Activity
            </Button>
          </footer>
          {form.formState.isDirty && (
            <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-lg">
              <span className="text-xs text-muted-foreground">
                You have unsaved payment and finance changes.
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
        {gatewayOpen && (
          <FinanceGatewayDialog
            gateway={snapshot.gateway}
            onClose={() => setGatewayOpen(false)}
            onConfigure={async (input) => {
              const result = await onConfigure(input);
              setNotice(
                "Gateway configuration saved in preview. Connection has not been verified.",
              );
              return result;
            }}
            onTest={onTest}
          />
        )}
        {editor && (
          <FinanceCommissionEditor
            rule={editor}
            onClose={() => setEditor(null)}
            onApply={applyRule}
          />
        )}
        {policyOpen && (
          <Dialog open onOpenChange={setPolicyOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Refund Policy</DialogTitle>
                <DialogDescription>
                  Manage refund approval and cancellation settings.
                </DialogDescription>
              </DialogHeader>
              <FinanceRefundFields disabled={disabled} />
              <Button type="button" onClick={() => setPolicyOpen(false)}>
                Done
              </Button>
            </DialogContent>
          </Dialog>
        )}
        {activityOpen && (
          <Dialog open onOpenChange={setActivityOpen}>
            <DialogContent className="sm:max-w-[1000px]">
              <DialogHeader>
                <DialogTitle>Financial Activity</DialogTitle>
                <DialogDescription>
                  Recent payment and finance configuration activity.
                </DialogDescription>
              </DialogHeader>
              {snapshot.activity.length ? (
                <FinanceActivityTable activity={snapshot.activity} />
              ) : (
                <p className="text-xs text-muted-foreground">
                  No financial activity recorded.
                </p>
              )}
            </DialogContent>
          </Dialog>
        )}
        {confirmation && (
          <AccessConfirmDialog
            title={confirmation.title}
            description={confirmation.description}
            action={confirmation.action}
            destructive={confirmation.destructive}
            onClose={() => setConfirmation(null)}
            onConfirm={async () => confirmation.confirm()}
          />
        )}
      </div>
    </FormProvider>
  );
}
