"use client";

import { SettingsSection as HosteSection } from "./settings.section";
export { SettingsSection as HosteSection } from "./settings.section";
import Link from "next/link";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { SettingsNativeSelect } from "./settings.native.select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HOSTE_CONTROL_GROUPS } from "../data/settings.hoste.data";
import type {
  HosteSettings,
  HostePlan,
  HosteRequirement,
  HosteCommission,
} from "../settings.hoste.types";

export const HOSTE_SELECT_CLASS = "h-9";
export const hosteMoney = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

export function HosteStatus({
  enabled,
  disabledLabel = "Inactive",
}: {
  enabled: boolean;
  disabledLabel?: string;
}) {
  return (
    <span
      className={`inline-flex rounded px-2 py-1 text-[10px] font-semibold ${enabled ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}
    >
      {enabled ? "Active" : disabledLabel}
    </span>
  );
}

export function HosteControlGroup({
  group,
  disabled,
}: {
  group: (typeof HOSTE_CONTROL_GROUPS)[number];
  disabled: boolean;
}) {
  const { control } = useFormContext<HosteSettings>();
  return (
    <HosteSection title={group.title}>
      <div className="space-y-4">
        {group.fields.map(([name, label, description]) => (
          <div
            key={name}
            className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0"
          >
            <label htmlFor={`hoste-${name}`} className="min-w-0">
              <span className="block text-xs font-medium">{label}</span>
              <span className="mt-1 block text-[11px] text-muted-foreground">
                {description}
              </span>
            </label>
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <Switch
                  id={`hoste-${name}`}
                  disabled={disabled}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className={`shrink-0 ${field.value ? "bg-secondary" : ""}`}
                />
              )}
            />
          </div>
        ))}
      </div>
      {group.title === "Expiry Alerts & Automation" && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium">Reminder Schedule</p>
          <Controller
            control={control}
            name="reminderDays"
            render={({ field }) => (
              <div className="flex flex-wrap gap-4">
                {[30, 14, 7, 1].map((day) => (
                  <label
                    key={day}
                    className="flex items-center gap-2 text-[11px]"
                  >
                    <Checkbox
                      disabled={disabled}
                      checked={field.value.includes(day)}
                      onCheckedChange={(checked) =>
                        field.onChange(
                          checked
                            ? [...field.value, day]
                            : field.value.filter((value) => value !== day),
                        )
                      }
                    />
                    {day} {day === 1 ? "Day" : "Days"} Before
                  </label>
                ))}
              </div>
            )}
          />
        </div>
      )}
    </HosteSection>
  );
}

export function HosteBadgeFields({
  disabled,
  prefix = "badge",
}: {
  disabled: boolean;
  prefix?: string;
}) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<HosteSettings>();
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <label
          className="space-y-2 text-xs font-medium"
          htmlFor={`${prefix}-fee`}
        >
          Badge Fee (NGN)
          <Input
            id={`${prefix}-fee`}
            disabled={disabled}
            type="number"
            min={0}
            {...register("badgeFee", { valueAsNumber: true })}
          />
          {errors.badgeFee && (
            <span role="alert" className="text-destructive">
              {errors.badgeFee.message}
            </span>
          )}
        </label>
        <label
          className="space-y-2 text-xs font-medium"
          htmlFor={`${prefix}-duration`}
        >
          Badge Duration
          <SettingsNativeSelect
            id={`${prefix}-duration`}
            disabled={disabled}
            {...register("badgeDuration")}
            className={`${HOSTE_SELECT_CLASS} w-full`}
          >
            {["1 Month", "3 Months", "12 Months"].map((duration) => (
              <option key={duration}>{duration}</option>
            ))}
          </SettingsNativeSelect>
        </label>
      </div>
      {(
        [
          ["badgeVerification", "Require Verification Before Badge"],
          ["badgeRenewal", "Auto-Renew Badge"],
        ] as const
      ).map(([name, label]) => (
        <div
          key={name}
          className="flex items-center justify-between border-t border-border pt-4"
        >
          <label className="text-xs font-medium" htmlFor={`${prefix}-${name}`}>
            {label}
          </label>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Switch
                id={`${prefix}-${name}`}
                disabled={disabled}
                checked={field.value}
                onCheckedChange={field.onChange}
                className={field.value ? "bg-secondary" : ""}
              />
            )}
          />
        </div>
      ))}
    </>
  );
}

function Headers({ labels }: { labels: string[] }) {
  return (
    <TableHeader>
      <TableRow className="bg-muted/50">
        {labels.map((label) => (
          <TableHead
            key={label}
            className="h-9 text-[10px] uppercase text-muted-foreground"
          >
            {label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

export function HosteConfigurationTables({
  disabled,
  onRequirement,
  onPlan,
  onCommission,
  onTogglePlan,
}: {
  disabled: boolean;
  onRequirement: (value: HosteRequirement) => void;
  onPlan: (value: HostePlan) => void;
  onCommission: (value: HosteCommission) => void;
  onTogglePlan: (index: number) => void;
}) {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<HosteSettings>();
  const requirements = useWatch({ control, name: "requirements" });
  const plans = useWatch({ control, name: "plans" });
  const commissions = useWatch({ control, name: "commissions" });
  return (
    <div className="space-y-4">
      <HosteSection
        id="verification"
        title="Hosté Verification Configuration"
        action={
          <Button
            type="button"
            disabled={disabled}
            size="sm"
            variant="ghost"
            className="text-primary"
            onClick={() =>
              onRequirement({
                id: crypto.randomUUID(),
                name: "",
                required: true,
                enabled: true,
              })
            }
          >
            <Plus className="size-3" />
            Add Requirement
          </Button>
        }
      >
        <div className="mb-4 flex items-center gap-4">
          <label className="whitespace-nowrap text-xs" htmlFor="hoste-review">
            Verification Review Method
          </label>
          <SettingsNativeSelect
            id="hoste-review"
            disabled={disabled}
            wrapperClassName="w-auto"
            className={`${HOSTE_SELECT_CLASS} w-40`}
            {...register("reviewMethod")}
          >
            <option>Manual Review</option>
          </SettingsNativeSelect>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() =>
              document
                .getElementById("verification-table")
                ?.scrollIntoView({ block: "center", behavior: "smooth" })
            }
          >
            Manage Requirements
          </Button>
        </div>
        <Table id="verification-table">
          <Headers
            labels={["Document Name", "Requirement Type", "Status", "Actions"]}
          />
          <TableBody>
            {requirements.map((requirement, index) => (
              <TableRow key={requirement.id} className="text-xs">
                <TableCell className="font-medium">
                  {requirement.name}
                </TableCell>
                <TableCell>
                  {requirement.required ? "Required" : "Optional"}
                </TableCell>
                <TableCell>
                  <HosteStatus enabled={requirement.enabled} />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Button
                    type="button"
                    disabled={disabled}
                    size="sm"
                    variant="ghost"
                    className="text-primary"
                    aria-label={`Edit ${requirement.name}`}
                    onClick={() => onRequirement(requirement)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    disabled={disabled}
                    size="sm"
                    variant="ghost"
                    className={
                      requirement.enabled
                        ? "text-destructive"
                        : "text-secondary"
                    }
                    aria-label={`${requirement.enabled ? "Disable" : "Enable"} ${requirement.name}`}
                    onClick={() =>
                      setValue(
                        `requirements.${index}.enabled`,
                        !requirement.enabled,
                        { shouldDirty: true },
                      )
                    }
                  >
                    {requirement.enabled ? "Disable" : "Enable"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!requirements.length && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-muted-foreground"
                >
                  No verification requirements.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </HosteSection>
      <HosteSection
        id="subscriptions"
        title="Hosté Subscription Plans"
        action={
          <Button
            type="button"
            size="sm"
            disabled={disabled}
            onClick={() =>
              onPlan({
                id: crypto.randomUUID(),
                name: "",
                duration: "1 Month",
                price: 0,
                activeHosts: 0,
                enabled: true,
                note: "",
              })
            }
          >
            <Plus className="size-3" />
            Add Plan
          </Button>
        }
      >
        <Table>
          <Headers
            labels={[
              "Plan Name",
              "Duration",
              "Price",
              "Active Hostés",
              "Status",
              "Actions",
            ]}
          />
          <TableBody>
            {plans.map((plan, index) => (
              <TableRow key={plan.id} className="text-xs">
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>{plan.duration}</TableCell>
                <TableCell>
                  {plan.price === 0 ? "Free" : hosteMoney(plan.price)}
                </TableCell>
                <TableCell>{plan.activeHosts} Hostés</TableCell>
                <TableCell>
                  <HosteStatus
                    enabled={plan.enabled}
                    disabledLabel="Disabled"
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Button
                    type="button"
                    disabled={disabled}
                    size="sm"
                    variant="ghost"
                    className="text-primary"
                    aria-label={`Edit ${plan.name}`}
                    onClick={() => onPlan(plan)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    disabled={disabled}
                    size="sm"
                    variant="ghost"
                    className={
                      plan.enabled ? "text-destructive" : "text-secondary"
                    }
                    aria-label={`${plan.enabled ? "Deactivate" : "Enable"} ${plan.name}`}
                    onClick={() => onTogglePlan(index)}
                  >
                    {plan.enabled ? "Deactivate" : "Enable"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!plans.length && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No subscription plans.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </HosteSection>
      <HosteSection id="commissions" title="Hosté Commission Rules">
        <div className="mb-4 flex items-end gap-4">
          <label
            className="space-y-2 text-xs font-medium"
            htmlFor="hoste-default"
          >
            Default Platform Commission
            <Input
              id="hoste-default"
              className="w-44"
              type="number"
              min={0}
              disabled={disabled}
              {...register("defaultCommission", { valueAsNumber: true })}
            />
          </label>
          <label
            className="space-y-2 text-xs font-medium"
            htmlFor="hoste-default-type"
          >
            Commission Type
            <SettingsNativeSelect
              id="hoste-default-type"
              className={`${HOSTE_SELECT_CLASS} block h-10`}
              disabled={disabled}
              {...register("defaultCommissionType")}
            >
              <option>Percentage (%)</option>
              <option>Fixed Amount (NGN)</option>
            </SettingsNativeSelect>
          </label>
        </div>
        {errors.defaultCommission && (
          <p role="alert" className="mb-3 text-xs text-destructive">
            {errors.defaultCommission.message}
          </p>
        )}
        <Table>
          <Headers
            labels={[
              "Hosté Type / Category",
              "Commission Rate",
              "Status",
              "Actions",
            ]}
          />
          <TableBody>
            {commissions.map((rule) => (
              <TableRow key={rule.id} className="text-xs">
                <TableCell className="font-medium">{rule.category}</TableCell>
                <TableCell>
                  {rule.type === "Percentage (%)"
                    ? `${rule.value}%`
                    : hosteMoney(rule.value)}
                </TableCell>
                <TableCell>
                  {rule.status === "Active" ? (
                    <HosteStatus enabled />
                  ) : (
                    <span className="text-muted-foreground">Default</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={disabled}
                    className="text-primary"
                    aria-label={`Edit ${rule.category}`}
                    onClick={() => onCommission(rule)}
                  >
                    Edit Rule
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!commissions.length && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-muted-foreground"
                >
                  No commission rules.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </HosteSection>
    </div>
  );
}

export function HosteQuickActions() {
  return (
    <HosteSection title="Quick Actions & Navigation">
      <div className="grid grid-cols-2 gap-3">
        {[
          ["Manage Hostés Directory", "/profiles"],
          ["Verification Requirements", "#verification"],
          ["Subscription Plans", "#subscriptions"],
          ["Verify Badges", "#hoste-badge"],
          ["Manage Commission Rules", "#commissions"],
        ].map(([label, href]) => (
          <Link
            key={label}
            href={href}
            className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-3 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {label}
            <ArrowRight className="size-3 shrink-0" />
          </Link>
        ))}
      </div>
    </HosteSection>
  );
}
