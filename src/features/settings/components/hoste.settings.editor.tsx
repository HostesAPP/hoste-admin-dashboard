"use client";

import { useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SettingsNativeSelect } from "./settings.native.select";
import { AccessConfirmDialog } from "./access.confirm.dialog";
import {
  hostePlanSchema,
  hosteRequirementSchema,
  hosteCommissionSchema,
} from "../schemas/settings.hoste.schema";
import type {
  HostePlan,
  HosteRequirement,
  HosteCommission,
} from "../settings.hoste.types";

const SELECT_CLASS =
  "h-10";

function EditorShell({
  title,
  children,
  dirty,
  onClose,
  onSubmit,
}: {
  title: string;
  children: ReactNode;
  dirty: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  const [discard, setDiscard] = useState(false);
  const close = () => (dirty ? setDiscard(true) : onClose());
  return (
    <>
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <DialogContent className="sm:max-w-[460px]">
          <form onSubmit={onSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="text-xs">
                Changes are applied when you save all settings.
              </DialogDescription>
            </DialogHeader>
            {children}
            <footer className="flex justify-end gap-3 border-t border-border pt-4">
              <Button type="button" variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button type="submit">Apply Changes</Button>
            </footer>
          </form>
        </DialogContent>
      </Dialog>
      {discard && (
        <AccessConfirmDialog
          title="Discard Changes?"
          description="Your unsaved edits will be lost."
          action="Discard Changes"
          onClose={() => setDiscard(false)}
          onConfirm={async () => onClose()}
        />
      )}
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-medium">{label}</span>
      {children}
      {error && (
        <span role="alert" className="block text-xs text-destructive">
          {error}
        </span>
      )}
    </label>
  );
}

export function HostePlanEditor({
  value,
  onClose,
  onApply,
}: {
  value: HostePlan;
  onClose: () => void;
  onApply: (value: HostePlan) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<HostePlan>({
    resolver: zodResolver(hostePlanSchema),
    defaultValues: value,
  });
  return (
    <EditorShell
      title="Add / Edit Subscription Plan"
      dirty={isDirty}
      onClose={onClose}
      onSubmit={handleSubmit(onApply)}
    >
      <Field label="Plan Name" error={errors.name?.message}>
        <Input {...register("name")} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (NGN)" error={errors.price?.message}>
          <Input
            type="number"
            min={0}
            {...register("price", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Duration">
          <SettingsNativeSelect className={SELECT_CLASS} {...register("duration")}>
            {["14 Days", "1 Month", "3 Months", "12 Months"].map((duration) => (
              <option key={duration}>{duration}</option>
            ))}
          </SettingsNativeSelect>
        </Field>
      </div>
      <label className="flex items-center gap-2 text-xs">
        <Controller name="enabled" control={control} render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />} />
        Plan Active
      </label>
      <Field label="Internal Note">
        <Textarea {...register("note")} />
      </Field>
    </EditorShell>
  );
}

export function HosteRequirementEditor({
  value,
  onClose,
  onApply,
}: {
  value: HosteRequirement;
  onClose: () => void;
  onApply: (value: HosteRequirement) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<HosteRequirement>({
    resolver: zodResolver(hosteRequirementSchema),
    defaultValues: value,
  });
  return (
    <EditorShell
      title="Verification Requirement"
      dirty={isDirty}
      onClose={onClose}
      onSubmit={handleSubmit(onApply)}
    >
      <Field label="Document Name" error={errors.name?.message}>
        <Input {...register("name")} />
      </Field>
      <label className="flex items-center gap-2 text-xs">
        <Controller name="required" control={control} render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />} />
        Required Document
      </label>
      <label className="flex items-center gap-2 text-xs">
        <Controller name="enabled" control={control} render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />} />
        Requirement Active
      </label>
    </EditorShell>
  );
}

export function HosteCommissionEditor({
  value,
  onClose,
  onApply,
}: {
  value: HosteCommission;
  onClose: () => void;
  onApply: (value: HosteCommission) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<HosteCommission>({
    resolver: zodResolver(hosteCommissionSchema),
    defaultValues: value,
  });
  return (
    <EditorShell
      title="Edit Commission Rule"
      dirty={isDirty}
      onClose={onClose}
      onSubmit={handleSubmit(onApply)}
    >
      <Field label="Hosté Category">
        <Input value={value.category} readOnly />
      </Field>
      <Field label="Commission Type">
        <SettingsNativeSelect className={SELECT_CLASS} {...register("type")}>
          <option>Percentage (%)</option>
          <option>Fixed Amount (NGN)</option>
        </SettingsNativeSelect>
      </Field>
      <Field label="Commission Value" error={errors.value?.message}>
        <Input
          type="number"
          min={0}
          {...register("value", { valueAsNumber: true })}
        />
      </Field>
      <p className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
        <AlertTriangle className="size-4 shrink-0 text-primary" />
        Changes may affect future booking share configuration.
      </p>
    </EditorShell>
  );
}

export function HosteBadgeDialog({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Badge Settings</DialogTitle>
          <DialogDescription className="text-xs">
            Manage badge pricing, duration, and verification.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">{children}</div>
        <Button onClick={onClose}>Done</Button>
      </DialogContent>
    </Dialog>
  );
}
