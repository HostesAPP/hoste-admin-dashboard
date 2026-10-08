"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { accessReasonSchema } from "../schemas/settings.access.schema";

export function AccessConfirmDialog({
  title,
  description,
  action,
  reasonRequired = false,
  destructive = false,
  onClose,
  onConfirm,
}: {
  title: string;
  description: string;
  action: string;
  reasonRequired?: boolean;
  destructive?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ reason: string }>({
    resolver: reasonRequired ? zodResolver(accessReasonSchema) : undefined,
    defaultValues: { reason: "" },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !saving) onClose();
      }}
    >
      <DialogContent showCloseButton={!saving} className="sm:max-w-[440px]">
        <form
          className="space-y-5"
          onSubmit={handleSubmit(async ({ reason }) => {
            setSaving(true);
            try {
              await onConfirm(reason);
              onClose();
            } catch (cause) {
              setError(
                cause instanceof Error
                  ? cause.message
                  : "Unable to confirm this change.",
              );
            } finally {
              setSaving(false);
            }
          })}
        >
          <DialogHeader>
            <div className="flex items-center gap-3">
              <AlertCircle
                className={`size-6 ${destructive ? "text-destructive" : "text-primary"}`}
              />
              <DialogTitle className="font-bold">{title}</DialogTitle>
            </div>
            <DialogDescription className="text-xs leading-5">
              {description}
            </DialogDescription>
          </DialogHeader>
          {reasonRequired && (
            <div className="space-y-2">
              <Label htmlFor="access-reason" className="text-xs">
                Reason <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="access-reason"
                {...register("reason")}
                aria-invalid={!!errors.reason}
                placeholder="Enter the reason for this change"
                className="min-h-24 text-xs"
              />
              {errors.reason && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.reason.message}
                </p>
              )}
            </div>
          )}
          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
          <footer className="flex justify-end gap-3 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={destructive ? "destructive" : "default"}
              disabled={saving}
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              {action}
            </Button>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}
