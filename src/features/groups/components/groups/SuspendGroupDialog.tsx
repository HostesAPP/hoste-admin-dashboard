"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { Group } from "@/features/groups";
import { AlertTriangle } from "lucide-react";


// suspend group schema
const suspendGroupSchema = z.object({
  reason: z
    .string()
    .min(5, { message: "Please provide a reason (at least 5 characters)." })
    .max(500, { message: "Reason cannot exceed 500 characters." }),
});


// suspend group form values type
type SuspendGroupFormValues = z.infer<typeof suspendGroupSchema>;


// props interface
export type SuspendGroupDialogProps = {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// main component
export const SuspendGroupDialog: React.FC<SuspendGroupDialogProps> = ({
  group,
  open,
  onOpenChange,
}) => {


  // form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SuspendGroupFormValues>({
    resolver: zodResolver(suspendGroupSchema),
    defaultValues: {
      reason: "",
    },
  });

  // Reset form when dialog closes or opened group changes
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);


  // on submit
  const onSubmit = (data: SuspendGroupFormValues) => {
    // TODO: connect to backend suspend-group mutation with data.reason
    console.log("Suspending group:", group.id, "Reason:", data.reason);
    reset();
    onOpenChange(false);
  };


  // on cancel
  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden sm:max-w-md">
        <DialogHeader className="gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg font-bold">
                Suspend &ldquo;{group.name}&rdquo;?
              </DialogTitle>
              <span className="text-sm text-muted-foreground">
                Group ID: {group.id}
              </span>
            </div>
          </div>

          <DialogDescription className="text-sm text-muted-foreground pt-2">
            You are about to suspend{" "}
            <span className="font-semibold text-foreground">
              {group.name}
            </span>
            . This will prevent the group from receiving new booking requests or operating on the Hoste platform.
          </DialogDescription>
        </DialogHeader>

        {/* reason for suspension form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field data-invalid={!!errors.reason}>
            <FieldLabel htmlFor="suspension-reason">
              Reason for suspension <span className="text-destructive">*</span>
            </FieldLabel>
            <Textarea
              id="suspension-reason"
              placeholder="Enter clear explanation for group leader..."
              aria-invalid={!!errors.reason}
              className="resize-none"
              rows={4}
              {...register("reason")}
            />
            {errors.reason && (
              <FieldError errors={[{ message: errors.reason.message }]} />
            )}
          </Field>

          <DialogFooter className="space-x-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-medium cursor-pointer"
              disabled={isSubmitting}
            >
              Suspend Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
