"use client";

import { Controller, type Control } from "react-hook-form";
import { Check, Minus, Plus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { AccessSettings, AccessSnapshot } from "../settings.access.types";
import type { AccessManagementView } from "./access.management.dialog";
import { AccessRolesTable } from "./access.tables";

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/50 py-3 last:border-0">
      <div className="min-w-0">
        <p className="text-xs font-semibold">{title}</p>
        <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function AccessSettingsPanels({
  control,
  settings,
  snapshot,
  disabled,
  onManage,
  onToggle,
  search,
}: {
  control: Control<AccessSettings>;
  settings: AccessSettings;
  snapshot: AccessSnapshot;
  disabled: boolean;
  onManage: (view: AccessManagementView) => void;
  onToggle: (name: keyof AccessSettings, checked: boolean) => void;
  search: string;
}) {
  const matches = (text: string) =>
    text.toLowerCase().includes(search.trim().toLowerCase());
  const toggle = (name: keyof AccessSettings, title: string) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Switch
          aria-label={title}
          checked={field.value === true}
          onCheckedChange={(checked) => onToggle(name, checked)}
          disabled={disabled}
          className={
            field.value === true && name !== "loginAlerts"
              ? "bg-secondary"
              : undefined
          }
        />
      )}
    />
  );
  const select = (
    name: "sessionDuration" | "idleTimeout" | "passwordExpiry",
    label: string,
    options: { value: string; label: string }[],
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <select
          {...field}
          aria-label={label}
          disabled={disabled}
          className="h-8 rounded-md border border-input bg-background px-3 text-xs"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    />
  );
  return (
    <>
      <div className="grid grid-cols-2 gap-5">
        <section
          hidden={
            !matches(
              "administrator access admin accounts roles invitations session duration maximum login attempts dashboard onboarding",
            )
          }
        >
          <h2 className="text-sm font-bold">Administrator Access</h2>
          <p className="mb-3 mt-1 text-[11px] text-muted-foreground">
            Configure internal management accounts, invitations & session
            parameters.
          </p>
          <div className="rounded-lg border border-border bg-card p-4">
            <SettingRow
              title="Admin Accounts & Roles"
              description="Manage active internal administrator accounts & permissions."
            >
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={disabled}
                className="text-primary"
                onClick={() => onManage("admins")}
              >
                <UserRound className="size-3" />
                Manage
              </Button>
            </SettingRow>
            <SettingRow
              title="Admin Invitations"
              description="View, resend, or revoke pending staff onboarding invitations."
            >
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={disabled}
                className="text-secondary"
                onClick={() => onManage("invitations")}
              >
                <Check className="size-3" />
                Manage
              </Button>
            </SettingRow>
            <SettingRow
              title="Session Duration"
              description="Set maximum inactivity time before staff session expires."
            >
              {select("sessionDuration", "Session Duration", [
                { value: "1", label: "1 Hour" },
                { value: "2", label: "2 Hours" },
                { value: "4", label: "4 Hours" },
              ])}
            </SettingRow>
            <SettingRow
              title="Maximum Login Attempts"
              description="Number of failed attempts allowed before temporary lockout."
            >
              <Controller
                control={control}
                name="maxLoginAttempts"
                render={({ field }) => (
                  <div className="flex h-8 items-center overflow-hidden rounded-md border border-input">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Decrease maximum login attempts"
                      disabled={disabled || field.value <= 1}
                      onClick={() =>
                        field.onChange(Math.max(1, field.value - 1))
                      }
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span
                      className="w-7 text-center text-xs"
                      aria-label="Maximum login attempts"
                    >
                      {field.value}
                    </span>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Increase maximum login attempts"
                      disabled={disabled}
                      onClick={() => field.onChange(field.value + 1)}
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                )}
              />
            </SettingRow>
            <SettingRow
              title="Admin Dashboard Onboarding"
              description="Control whether newly added administrators can log into admin panel."
            >
              {toggle("adminOnboarding", "Admin Dashboard Onboarding")}
            </SettingRow>
          </div>
        </section>
        <section
          hidden={
            !matches(
              "access security settings idle session timeout password expiry policy two-factor authentication 2fa remember trusted devices unrecognized login alerts ip-bound staff sessions",
            )
          }
        >
          <h2 className="text-sm font-bold">Access Security Settings</h2>
          <p className="mb-3 mt-1 text-[11px] text-muted-foreground">
            Enforce platform authentication rules and credential protection
            policies.
          </p>
          <div className="rounded-lg border border-border bg-card p-4">
            <SettingRow
              title="Idle Session Timeout"
              description="Global automatic logout time for idle platform sessions."
            >
              {select("idleTimeout", "Idle Session Timeout", [
                { value: "15", label: "15 minutes" },
                { value: "30", label: "30 minutes" },
                { value: "60", label: "60 minutes" },
              ])}
            </SettingRow>
            <SettingRow
              title="Password Expiry Policy"
              description="Force administrators to rotate credentials periodically."
            >
              {select("passwordExpiry", "Password Expiry Policy", [
                { value: "30", label: "30 days" },
                { value: "60", label: "60 days" },
                { value: "90", label: "90 days" },
              ])}
            </SettingRow>
            <SettingRow
              title="Two-Factor Authentication (2FA)"
              description="Require 2FA via SMS/Authenticator for Super Admins & Staff."
            >
              {toggle("twoFactor", "Two-Factor Authentication (2FA)")}
            </SettingRow>
            <SettingRow
              title="Remember Trusted Devices"
              description="Bypass 2FA challenge for 30 days on verified user browsers."
            >
              {toggle("trustedDevices", "Remember Trusted Devices")}
            </SettingRow>
            <SettingRow
              title="Unrecognized Login Alerts"
              description="Send immediate email notifications on logins from new IP/location."
            >
              {toggle("loginAlerts", "Unrecognized Login Alerts")}
            </SettingRow>
            <SettingRow
              title="IP-Bound Staff Sessions"
              description="Invalidate admin session immediately if client IP address changes."
            >
              {toggle("ipBoundSessions", "IP-Bound Staff Sessions")}
            </SettingRow>
          </div>
        </section>
      </div>
      <AccessRolesTable
        snapshot={snapshot}
        onManage={onManage}
        search={search}
      />
      <section
        hidden={
          !matches(
            "platform user access customers hostés brand users event planners registrations",
          )
        }
      >
        <h2 className="text-sm font-bold">Platform User Access</h2>
        <p className="mb-3 mt-1 text-[11px] text-muted-foreground">
          Control access statuses, registration availability, and user limits
          for Hosté platform account classifications.
        </p>
        <div className="grid grid-cols-4 gap-4">
          {snapshot.populations.map((population) => (
            <article
              key={population.id}
              className={`overflow-hidden rounded-lg border border-border border-t-[12px] bg-card ${population.tone === "secondary" ? "border-t-secondary" : population.tone === "primary" ? "border-t-primary" : "border-t-muted-foreground/60"}`}
            >
              <div className="p-4">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold">{population.name}</h3>
                  <span className="rounded bg-muted px-1.5 py-1 text-[8px] text-muted-foreground">
                    {population.badge}
                  </span>
                </div>
                <dl className="space-y-1 text-[10px] text-muted-foreground">
                  <div>
                    Active Users:{" "}
                    <span className="font-semibold text-foreground">
                      {population.active.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    Suspended:{" "}
                    <span className="font-semibold text-destructive">
                      {population.suspended}
                    </span>
                  </div>
                  <div>
                    Registration Status:{" "}
                    <span
                      className={`font-semibold ${settings[population.id] ? "text-secondary" : "text-destructive"}`}
                    >
                      {settings[population.id] ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div>
                    Access Status:{" "}
                    <span className="font-semibold text-secondary">
                      {population.access}
                    </span>
                  </div>
                </dl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`mt-3 w-full justify-between border-t border-border px-0 text-[10px] ${population.tone === "secondary" ? "text-secondary" : "text-primary"}`}
                  disabled={disabled}
                  onClick={() => onManage("accounts")}
                >
                  Manage {population.name}
                  <span aria-hidden="true">›</span>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <div className="grid grid-cols-2 gap-5">
        <section
          hidden={
            !matches(
              "registration account controls allow customer hosté brand user event planner registrations require email verification account approval",
            )
          }
        >
          <h2 className="text-sm font-bold">Registration & Account Controls</h2>
          <p className="mb-3 mt-1 text-[11px] text-muted-foreground">
            Platform-wide rules governing public user signup and verification
            requirements.
          </p>
          <div className="rounded-lg border border-border bg-card p-4">
            {(
              [
                {
                  name: "customers",
                  title: "Allow Customer Registrations",
                  description:
                    "Enable public signup for standard customer guest accounts.",
                },
                {
                  name: "hosts",
                  title: "Allow Hosté Registrations",
                  description:
                    "Allow property hosts to register and create new listings.",
                },
                {
                  name: "brands",
                  title: "Allow Brand User Registrations",
                  description:
                    "Enable corporate brand partnerships self-service onboarding.",
                },
                {
                  name: "planners",
                  title: "Allow Event Planner Registrations",
                  description:
                    "Permit specialized event managers to register directly.",
                },
                {
                  name: "emailVerification",
                  title: "Require Email Verification",
                  description:
                    "Mandate links or OTP verification before account activation.",
                },
                {
                  name: "accountApproval",
                  title: "Require Account Approval",
                  description:
                    "Require Super Admin approval for new Hosté & Brand accounts.",
                },
              ] as const
            ).map((row) => (
              <SettingRow
                key={row.name}
                title={row.title}
                description={row.description}
              >
                {toggle(row.name, row.title)}
              </SettingRow>
            ))}
          </div>
        </section>
        <section
          hidden={
            !matches(
              "account status management active suspended blocked deactivated accounts",
            )
          }
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">Account Status Management</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => onManage("accounts")}
            >
              Manage Accounts
            </Button>
          </div>
          <p className="mb-3 mt-1 text-[11px] text-muted-foreground">
            Operational states for platform accounts and administrative action
            triggers.
          </p>
          <div className="rounded-lg border border-border bg-card p-4">
            {(
              [
                {
                  status: "Active",
                  title: "Active Accounts",
                  description:
                    "Fully operational user accounts with standard access rights.",
                },
                {
                  status: "Suspended",
                  title: "Suspended Accounts",
                  description:
                    "Temporarily restricted due to policy investigation or disputes.",
                },
                {
                  status: "Blocked",
                  title: "Blocked Accounts",
                  description:
                    "Permanently banned accounts; identity blacklisted from platform.",
                },
                {
                  status: "Deactivated",
                  title: "Deactivated Accounts",
                  description:
                    "Self-closed or dormant accounts retained for audit compliance.",
                },
              ] as const
            ).map((row) => (
              <SettingRow
                key={row.status}
                title={row.title}
                description={row.description}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-2 py-1 text-[10px] font-semibold ${row.status === "Active" ? "bg-secondary/10 text-secondary" : row.status === "Suspended" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}
                  >
                    {snapshot.accountTotals[row.status].toLocaleString()}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    onClick={() => onManage("accounts")}
                  >
                    Manage
                  </Button>
                </div>
              </SettingRow>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
