"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  notificationProviderSchema,
  notificationTemplateSchema,
  notificationEmailSchema,
  notificationPreferencesSchema,
} from "../schemas/settings.notifications.schema";
import type {
  NotificationProvider,
  NotificationTemplate,
  NotificationEmailConfiguration,
  NotificationSettings,
} from "../settings.notifications.types";

export function NotificationEmailDialog({
  configuration,
  status,
  onClose,
  onApply,
  onTest,
}: {
  configuration: NotificationProvider;
  status: string;
  onClose: () => void;
  onApply: (value: NotificationEmailConfiguration) => void;
  onTest: (value: NotificationEmailConfiguration) => Promise<string>;
}) {
  const form = useForm<NotificationEmailConfiguration>({
    resolver: zodResolver(notificationEmailSchema),
    defaultValues: {
      ...configuration,
      senderEmail: configuration.senderEmail ?? "",
      replyTo: configuration.replyTo ?? "",
    },
  });
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const field = (name: keyof NotificationEmailConfiguration, label: string) => (
    <label className="block space-y-1.5 text-xs">
      <span className="font-semibold">{label}</span>
      <Input
        {...form.register(name)}
        type={name === "senderEmail" || name === "replyTo" ? "email" : "text"}
        aria-invalid={!!form.formState.errors[name]}
        className="h-9 text-xs"
      />
      {form.formState.errors[name] && (
        <span role="alert" className="text-destructive">
          {form.formState.errors[name]?.message}
        </span>
      )}
    </label>
  );
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !testing) onClose();
      }}
    >
      <DialogContent
        showCloseButton={!testing}
        className="overflow-hidden p-0 sm:max-w-[560px]"
      >
        <form noValidate onSubmit={form.handleSubmit(onApply)}>
          <DialogHeader className="border-b bg-muted/30 px-5 py-4">
            <DialogTitle className="text-sm font-medium">
              Configure Email Notifications
            </DialogTitle>
            <DialogDescription className="sr-only">
              Email sender, reply-to address, and delivery provider settings.
            </DialogDescription>
          </DialogHeader>
          <fieldset disabled={testing} className="space-y-4 px-5 pt-5">
            {field("sender", "Sender Name")}
            {field("senderEmail", "Sender Email Address")}
            <div className="grid grid-cols-2 gap-4">
              {field("replyTo", "Reply-To Email")}
              {field("provider", "Email Provider")}
            </div>
            <p className="rounded-md bg-secondary/10 px-3 py-2 text-xs font-semibold text-secondary">
              Status: {status}
            </p>
            {result && (
              <p role="status" className="text-xs text-secondary">
                {result}
              </p>
            )}
            {error && (
              <p role="alert" className="text-xs text-destructive">
                {error}
              </p>
            )}
          </fieldset>
          <footer className="flex justify-end gap-2 px-5 pb-5 pt-3">
            <Button
              type="button"
              variant="outline"
              className="mr-auto"
              disabled={testing}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={testing}
              onClick={form.handleSubmit(async (value) => {
                setTesting(true);
                setResult("");
                setError("");
                try {
                  setResult(await onTest(value));
                } catch (cause) {
                  setError(
                    cause instanceof Error
                      ? cause.message
                      : "Unable to test email settings.",
                  );
                } finally {
                  setTesting(false);
                }
              })}
            >
              {testing && <Loader2 className="size-3.5 animate-spin" />}Test
              Email
            </Button>
            <Button type="submit" disabled={testing}>
              Save Config
            </Button>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function NotificationPreferencesDialog({
  preference,
  onClose,
  onApply,
}: {
  preference: NotificationSettings["userPreferences"][number];
  onClose: () => void;
  onApply: (
    categories: NotificationSettings["userPreferences"][number]["categories"],
  ) => void;
}) {
  const form = useForm<{
    categories: NotificationSettings["userPreferences"][number]["categories"];
  }>({
    resolver: zodResolver(notificationPreferencesSchema),
    defaultValues: { categories: preference.categories },
  });
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="overflow-hidden p-0 sm:max-w-[560px]">
        <form
          onSubmit={form.handleSubmit((value) => onApply(value.categories))}
        >
          <DialogHeader className="border-b bg-muted/30 px-5 py-4">
            <DialogTitle className="text-sm font-medium">
              Notification Preferences: {preference.label.split(" (")[0]}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Choose default delivery channels for each notification category.
            </DialogDescription>
          </DialogHeader>
          <div className="p-5">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-[10px] uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Category</th>
                  {["Email", "Push", "SMS"].map((channel) => (
                    <th key={channel} className="w-16 text-center font-medium">
                      {channel}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preference.categories.map((category, index) => (
                  <tr key={category.id} className="border-b last:border-0">
                    <td className="px-3 py-3">{category.label}</td>
                    {(["email", "push", "sms"] as const).map((channel) => (
                      <td key={channel} className="text-center">
                        <Controller
                          control={form.control}
                          name={`categories.${index}.${channel}`}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              ref={field.ref}
                              aria-label={`${category.label} ${channel}`}
                              className="peer-checked:border-secondary peer-checked:bg-secondary"
                            />
                          )}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {!preference.categories.length && (
              <p className="py-5 text-xs text-muted-foreground">
                No notification categories available.
              </p>
            )}
          </div>
          <footer className="flex justify-between px-5 pb-5">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary">
              Save Preferences
            </Button>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function NotificationConfirmDialog({
  title,
  description,
  action,
  cancelLabel = "Cancel",
  destructive = false,
  onClose,
  onConfirm,
}: {
  title: string;
  description: string;
  action: string;
  cancelLabel?: string;
  destructive?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent showCloseButton={false} className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle className="text-sm font-medium">{title}</DialogTitle>
          <DialogDescription className="text-xs leading-5">
            {description}
          </DialogDescription>
        </DialogHeader>
        <footer className="mt-4 flex gap-3">
          <Button
            type="button"
            variant={cancelLabel === "Keep Editing" ? "default" : "outline"}
            className="flex-1"
            onClick={onClose}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={cancelLabel === "Keep Editing" ? "outline" : "default"}
            className={`flex-1 ${destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {action}
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}

export function NotificationProviderDialog({
  label,
  configuration,
  onClose,
  onApply,
}: {
  label: string;
  configuration: NotificationProvider;
  onClose: () => void;
  onApply: (value: NotificationProvider) => void;
}) {
  const form = useForm<NotificationProvider>({
    resolver: zodResolver(notificationProviderSchema),
    defaultValues: configuration,
  });
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[460px]">
        <form className="space-y-5" onSubmit={form.handleSubmit(onApply)}>
          <DialogHeader>
            <DialogTitle>Configure {label}</DialogTitle>
            <DialogDescription>
              Notification channel configuration.
            </DialogDescription>
          </DialogHeader>
          {(["provider", "sender"] as const).map((name) => (
            <label key={name} className="block space-y-1.5 text-xs">
              <span className="font-medium">
                {name === "provider" ? "Provider" : "Sender Name / Identifier"}
              </span>
              <Input
                {...form.register(name)}
                aria-invalid={!!form.formState.errors[name]}
              />
              {form.formState.errors[name] && (
                <span role="alert" className="text-destructive">
                  {form.formState.errors[name]?.message}
                </span>
              )}
            </label>
          ))}
          <footer className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Apply Changes</Button>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function NotificationTemplateEditor({
  template,
  onClose,
  onApply,
}: {
  template: NotificationTemplate;
  onClose: () => void;
  onApply: (value: NotificationTemplate) => void;
}) {
  const form = useForm<NotificationTemplate>({
    resolver: zodResolver(notificationTemplateSchema),
    defaultValues: template,
  });
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={form.handleSubmit(onApply)} className="space-y-5">
          <DialogHeader>
            <DialogTitle>{template.name}</DialogTitle>
            <DialogDescription>
              {template.channel} notification template
            </DialogDescription>
          </DialogHeader>
          <label className="block space-y-1.5 text-xs">
            <span className="font-medium">Template Title</span>
            <Input
              {...form.register("subject")}
              aria-invalid={!!form.formState.errors.subject}
            />
            {form.formState.errors.subject && (
              <span role="alert" className="text-destructive">
                {form.formState.errors.subject.message}
              </span>
            )}
          </label>
          <label className="block space-y-1.5 text-xs">
            <span className="font-medium">Message</span>
            <Textarea
              {...form.register("body")}
              className="min-h-32 text-xs"
              aria-invalid={!!form.formState.errors.body}
            />
            {form.formState.errors.body && (
              <span role="alert" className="text-destructive">
                {form.formState.errors.body.message}
              </span>
            )}
          </label>
          <footer className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Apply Changes</Button>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}
