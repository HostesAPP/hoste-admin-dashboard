"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { SettingsNativeSelect } from "./settings.native.select";
import { AccessConfirmDialog } from "./access.confirm.dialog";
import { BookingPolicyFields } from "./bookings.settings.sections";
import { bookingTypeSettingsSchema } from "../schemas/settings.bookings.schema";
import type { BookingTypeSettings } from "../settings.bookings.types";

export function BookingTypeEditor({
  value,
  onApply,
  onClose,
}: {
  value: BookingTypeSettings;
  onApply: (value: BookingTypeSettings) => void;
  onClose: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<BookingTypeSettings>({
    resolver: zodResolver(bookingTypeSettingsSchema),
    defaultValues: value,
  });
  const [discard, setDiscard] = useState(false);
  const close = () => (isDirty ? setDiscard(true) : onClose());
  return (
    <>
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <form className="space-y-4" onSubmit={handleSubmit(onApply)}>
            <DialogHeader>
              <DialogTitle>
                {value.name ? "Edit Booking Type" : "Add Booking Type"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Configure booking requirements and commission settings.
              </DialogDescription>
            </DialogHeader>
            <label className="block space-y-2 text-xs font-semibold">
              Booking Type Name
              <Input
                {...register("name")}
                placeholder="e.g. VIP Concierge Service"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <span role="alert" className="text-destructive">
                  {errors.name.message}
                </span>
              )}
            </label>
            <label className="block space-y-2 text-xs font-semibold">
              Description
              <Textarea
                {...register("description")}
                placeholder="Briefly describe the operational scope of this booking type"
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <span role="alert" className="text-destructive">
                  {errors.description.message}
                </span>
              )}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="space-y-2 text-xs font-semibold">
                Status
                <Controller
                  control={control}
                  name="enabled"
                  render={({ field }) => (
                    <SettingsNativeSelect
                      value={field.value ? "active" : "disabled"}
                      onChange={(event) =>
                        field.onChange(event.target.value === "active")
                      }
                    >
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </SettingsNativeSelect>
                  )}
                />
              </label>
              <label className="space-y-2 text-xs font-semibold">
                Commission Rule (%)
                <Input
                  type="number"
                  min={0}
                  max={100}
                  {...register("commissionPercent", { valueAsNumber: true })}
                  aria-invalid={!!errors.commissionPercent}
                />
                {errors.commissionPercent && (
                  <span role="alert" className="text-destructive">
                    {errors.commissionPercent.message}
                  </span>
                )}
              </label>
            </div>
            <label className="block space-y-2 text-xs font-semibold">
              Booking Requirements
              <Input
                {...register("requirements")}
                placeholder="e.g. Requires Admin Approval, ID Verification"
                aria-invalid={!!errors.requirements}
              />
              {errors.requirements && (
                <span role="alert" className="text-destructive">
                  {errors.requirements.message}
                </span>
              )}
            </label>
            <footer className="flex justify-end gap-3 border-t border-border pt-4">
              <Button type="button" variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button type="submit">Apply Booking Type</Button>
            </footer>
          </form>
        </DialogContent>
      </Dialog>
      {discard && (
        <AccessConfirmDialog
          title="Discard Changes?"
          description="Your unsaved booking type edits will be lost."
          action="Discard Changes"
          onClose={() => setDiscard(false)}
          onConfirm={async () => onClose()}
        />
      )}
    </>
  );
}

export function BookingPolicyDialog({
  disabled,
  onClose,
}: {
  disabled: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Cancellation & Rescheduling Policy</DialogTitle>
          <DialogDescription className="text-xs">
            Changes remain pending until you save the page settings.
          </DialogDescription>
        </DialogHeader>
        <BookingPolicyFields disabled={disabled} prefix="policy-dialog" />
        <Button onClick={onClose}>Done</Button>
      </DialogContent>
    </Dialog>
  );
}
