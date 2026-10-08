"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { SettingsHeader } from "./settings.header";
import { AccessSettingsPanels } from "./access.settings.panels";
import { AccessActivityTable } from "./access.tables";
import { accessSettingsSchema } from "../schemas/settings.access.schema";
import { AccessAdminForm } from "./access.admin.form";
import {
  AccessManagementDialog,
  type AccessManagementView,
} from "./access.management.dialog";
import { AccessConfirmDialog } from "./access.confirm.dialog";
import { mockAccessAdapter } from "../settings.access.adapter";
import { useAccessSettings } from "../hooks/settings.access.hooks";
import type {
  AccessAdapter,
  AccessCommand,
  AccessSettings,
  AccessSnapshot,
} from "../settings.access.types";

export function UsersAccessPage({
  adapter = mockAccessAdapter,
}: {
  adapter?: AccessAdapter;
}) {
  const { data, isPending, isError, refetch, execute, isSaving } =
    useAccessSettings(adapter);
  if (isPending)
    return (
      <div
        role="status"
        aria-label="Loading Users and Access"
        className="space-y-5 p-8"
      >
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="h-80 animate-pulse rounded-lg bg-muted" />
          <div className="h-80 animate-pulse rounded-lg bg-muted" />
        </div>
        <span className="sr-only">Loading access settings...</span>
      </div>
    );
  if (isError || !data)
    return (
      <div role="alert" className="p-8">
        <h1 className="text-xl font-bold">Unable to load Users & Access</h1>
        <p className="my-4 text-sm text-muted-foreground">
          Please retry loading the access settings.
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  return (
    <AccessContent snapshot={data} execute={execute} isSaving={isSaving} />
  );
}

function AccessContent({
  snapshot,
  execute,
  isSaving,
}: {
  snapshot: AccessSnapshot;
  execute: (command: AccessCommand) => Promise<AccessSnapshot>;
  isSaving: boolean;
}) {
  const [search, setSearch] = useState("");
  const [changeReason, setChangeReason] = useState("");
  const [adminForm, setAdminForm] = useState<"invite" | "create" | null>(null);
  const [management, setManagement] = useState<AccessManagementView | null>(
    null,
  );
  const [confirmation, setConfirmation] = useState<{
    title: string;
    description: string;
    name?: keyof AccessSettings;
    value?: boolean;
    discard?: boolean;
  } | null>(null);
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm<AccessSettings>({
    resolver: zodResolver(accessSettingsSchema),
    defaultValues: snapshot.settings,
  });
  const settings = useWatch({ control }) as AccessSettings;
  const disabled = !snapshot.canManage || isSaving;
  const command = async (values: AccessCommand) => {
    try {
      await execute(values);
      toast.success("Access change saved for this preview only.");
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : "Unable to save access change.",
      );
      throw cause;
    }
  };
  const save = handleSubmit(async (values) => {
    try {
      const response = await execute({
        type: "settings",
        values,
        reason: changeReason || undefined,
      });
      reset(response.settings);
      setChangeReason("");
      toast.success("Access settings saved for this preview only.");
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : "Unable to save access settings.",
      );
    }
  });
  const onToggle = (name: keyof AccessSettings, checked: boolean) => {
    const registration = snapshot.populations.find(
      (population) => population.id === name,
    );
    if (!checked && (registration || name === "twoFactor"))
      setConfirmation({
        title: registration
          ? `Disable ${registration.name} Registrations?`
          : "Disable Two-Factor Authentication?",
        description: registration
          ? "You are changing a platform-wide registration rule. Existing registered users will maintain their access."
          : "Removing this requirement may reduce administrator account protection.",
        name,
        value: checked,
      });
    else setValue(name, checked, { shouldDirty: true });
  };
  const stats = [
    {
      title: "Total Admins",
      value: snapshot.admins.length,
      badge: "Staff",
      tone: "text-foreground",
    },
    {
      title: "Active Admins",
      value: snapshot.admins.filter((admin) => admin.status === "Active")
        .length,
      badge: "Active",
      tone: "text-secondary",
    },
    {
      title: "Pending Invites",
      value: snapshot.admins.filter((admin) => admin.status === "Invited")
        .length,
      badge: "Pending",
      tone: "text-primary",
    },
    {
      title: "Total Roles",
      value: snapshot.roles.length,
      badge: "System & Custom",
      tone: "text-foreground",
    },
    {
      title: "Active Users",
      value: snapshot.accountTotals.Active,
      badge: "Public",
      tone: "text-foreground",
    },
    {
      title: "Suspended Users",
      value: snapshot.accountTotals.Suspended,
      badge: "Restricted",
      tone: "text-destructive",
    },
  ];
  return (
    <div className="min-w-[1024px] font-normal tracking-normal">
      <SettingsHeader search={search} onSearch={setSearch} />
      <div className="mx-auto max-w-[1440px] space-y-6 px-8 pb-10 pt-7">
        <div className="flex items-center justify-between">
          <div>
            <nav aria-label="Breadcrumb" className="mb-1 flex gap-2 text-xs">
              <Link
                href="/settings"
                className="text-muted-foreground hover:underline"
              >
                Settings
              </Link>
              <span>/</span>
              <span className="font-semibold text-primary">Users & Access</span>
            </nav>
            <h1 className="text-2xl font-bold">Users & Access</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Manage administrators, roles, permissions, user access, and
              account controls
            </p>
          </div>
          <div className="flex gap-2">
            {isDirty && (
              <>
                <Button
                  variant="outline"
                  disabled={disabled}
                  className="text-xs"
                  onClick={() =>
                    setConfirmation({
                      title: "Discard Changes?",
                      description:
                        "You have unsaved changes. Any edits to access settings will be lost.",
                      discard: true,
                    })
                  }
                >
                  Discard Changes
                </Button>
                <Button disabled={disabled} className="text-xs" onClick={save}>
                  {isSaving && <Loader2 className="size-4 animate-spin" />}Save
                  Changes
                </Button>
              </>
            )}
            <Button
              disabled={disabled}
              onClick={() => setAdminForm("invite")}
              className="text-xs"
            >
              <Plus className="size-4" />
              Add Admin
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {stats.map((stat) => (
            <article
              key={stat.title}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-[10px] font-semibold text-muted-foreground">
                  {stat.title}
                </h2>
                <span className="rounded bg-muted px-1 py-0.5 text-[8px] text-muted-foreground">
                  {stat.badge}
                </span>
              </div>
              <p className={`mt-2 text-2xl font-bold ${stat.tone}`}>
                {stat.value.toLocaleString()}
              </p>
            </article>
          ))}
        </div>
        {!snapshot.canManage && (
          <p role="status" className="text-xs text-muted-foreground">
            Your account has read-only access to these settings.
          </p>
        )}
        <AccessSettingsPanels
          control={control}
          settings={settings}
          snapshot={snapshot}
          disabled={disabled}
          onManage={setManagement}
          onToggle={onToggle}
          search={search}
        />
        <AccessActivityTable
          snapshot={{
            ...snapshot,
            activities: "recent access activity".includes(search.toLowerCase())
              ? snapshot.activities
              : snapshot.activities.filter((activity) =>
                  `${activity.name} ${activity.type} ${activity.activity}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
                ),
          }}
          onManage={setManagement}
        />
        <section>
          <h2 className="text-sm font-bold">Quick Actions</h2>
          <p className="mb-3 mt-1 text-[11px] text-muted-foreground">
            Direct access triggers for key administrative tasks and modal
            management flows.
          </p>
          <div className="flex gap-3 rounded-lg border border-border bg-card p-4">
            <Button
              disabled={disabled}
              onClick={() => setAdminForm("create")}
              className="text-xs"
            >
              <Plus className="size-3" />
              Create an Admin Account
            </Button>
            <Button
              variant="outline"
              disabled={disabled}
              onClick={() => setManagement("roles")}
              className="text-xs"
            >
              Manage Roles
            </Button>
            <Button
              variant="outline"
              disabled={disabled}
              onClick={() => setManagement("admins")}
              className="text-xs"
            >
              Manage Permissions
            </Button>
            <Button
              variant="outline"
              disabled={disabled}
              onClick={() => setManagement("accounts")}
              className="text-xs"
            >
              Manage Accounts
            </Button>
            <Button
              variant="outline"
              onClick={() => setManagement("activity")}
              className="text-xs"
            >
              View Access Activity →
            </Button>
          </div>
        </section>
      </div>
      {adminForm && (
        <AccessAdminForm
          mode={adminForm}
          roles={snapshot.roles}
          onClose={() => setAdminForm(null)}
          onSubmit={command}
        />
      )}
      {management && (
        <AccessManagementDialog
          view={management}
          snapshot={snapshot}
          onClose={() => setManagement(null)}
          onCommand={command}
          busy={isSaving}
        />
      )}
      {confirmation && (
        <AccessConfirmDialog
          title={confirmation.title}
          description={confirmation.description}
          action={confirmation.discard ? "Discard Changes" : "Confirm Change"}
          destructive={confirmation.discard}
          reasonRequired={!confirmation.discard}
          onClose={() => setConfirmation(null)}
          onConfirm={async (reason) => {
            if (confirmation.discard) {
              reset(snapshot.settings);
              setChangeReason("");
            } else if (confirmation.name) {
              setChangeReason(reason);
              setValue(confirmation.name, confirmation.value!, {
                shouldDirty: true,
              });
            }
          }}
        />
      )}
      <Toaster />
    </div>
  );
}
