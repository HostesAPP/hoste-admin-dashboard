"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Info, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AccessPermissionsMatrix } from "./access.permissions.matrix";
import { AccessConfirmDialog } from "./access.confirm.dialog";
import {
  addAccessAdminSchema,
  createAccessAdminSchema,
  type AddAccessAdminValues,
  type CreateAccessAdminValues,
} from "../schemas/settings.access.schema";
import type { AccessCommand, AccessRole } from "../settings.access.types";

export function AccessAdminForm({
  mode,
  roles,
  onClose,
  onSubmit,
}: {
  mode: "invite" | "create";
  roles: AccessRole[];
  onClose: () => void;
  onSubmit: (command: AccessCommand) => Promise<void>;
}) {
  return mode === "invite" ? (
    <InviteForm roles={roles} onClose={onClose} onSubmit={onSubmit} />
  ) : (
    <CreateForm roles={roles} onClose={onClose} onSubmit={onSubmit} />
  );
}

function InviteForm({
  roles,
  onClose,
  onSubmit,
}: Omit<Parameters<typeof AccessAdminForm>[0], "mode">) {
  const defaultRole =
    roles.find((role) => role.id === "OPERATIONS") ?? roles[0];
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddAccessAdminValues>({
    resolver: zodResolver(addAccessAdminSchema),
    defaultValues: { name: "", email: "", roleId: defaultRole.id },
  });
  const roleId = useWatch({ control, name: "roleId" });
  const role = roles.find((item) => item.id === roleId);
  const [error, setError] = useState("");
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <DialogContent
        showCloseButton={!isSubmitting}
        className="sm:max-w-[440px]"
      >
        <form
          noValidate
          onSubmit={handleSubmit(async (values) => {
            try {
              await onSubmit({ type: "invite", ...values });
              onClose();
            } catch (cause) {
              setError(
                cause instanceof Error
                  ? cause.message
                  : "Unable to send invitation.",
              );
            }
          })}
          className="space-y-5"
        >
          <DialogHeader>
            <DialogTitle className="font-bold">Add Admin</DialogTitle>
            <DialogDescription className="text-xs">
              Invite a new administrator to the Hosté Admin Dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="invite-name" className="text-xs">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="invite-name"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-email" className="text-xs">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="invite-email"
                type="email"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-role" className="text-xs">
                Role
              </Label>
              <select
                id="invite-role"
                {...register("roleId")}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-xs"
              >
                {roles.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="rounded-md border border-border bg-muted/20 p-3 text-xs">
            <h3 className="font-semibold">Default Permissions</h3>
            <p className="mt-2 font-medium">{role?.name} role includes:</p>
            <p className="mt-1 text-muted-foreground">
              {role?.scope.join(" • ")}
            </p>
          </div>
          <p className="flex gap-2 rounded-md border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
            <Info className="size-4 shrink-0 text-primary" />
            Invitation destination: the administrator&apos;s email address.
          </p>
          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
          <footer className="flex justify-end gap-3 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}Send
              Invitation
            </Button>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CreateForm({
  roles,
  onClose: close,
  onSubmit,
}: Omit<Parameters<typeof AccessAdminForm>[0], "mode">) {
  const defaultRole =
    roles.find((role) => role.id === "OPERATIONS") ?? roles[0];
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CreateAccessAdminValues>({
    resolver: zodResolver(createAccessAdminSchema),
    defaultValues: {
      name: "",
      email: "",
      roleId: defaultRole.id,
      temporaryPassword: "",
      confirmPassword: "",
      permissions: defaultRole.permissions,
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [discard, setDiscard] = useState(false);
  const onClose = () => {
    if (isDirty) setDiscard(true);
    else close();
  };
  const [error, setError] = useState("");
  return (
    <>
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open && !isSubmitting) onClose();
        }}
      >
        <DialogContent
          showCloseButton={!isSubmitting}
          className="max-h-[90vh] overflow-y-auto sm:max-w-[900px]"
        >
          <form
            noValidate
            onSubmit={handleSubmit(async (values) => {
              try {
                await onSubmit({
                  type: "create",
                  name: values.name,
                  email: values.email,
                  roleId: values.roleId,
                  temporaryPassword: values.temporaryPassword,
                  permissions: values.permissions,
                });
                close();
              } catch (cause) {
                setError(
                  cause instanceof Error
                    ? cause.message
                    : "Unable to create account.",
                );
              }
            })}
            className="space-y-5"
          >
            <DialogHeader>
              <DialogTitle className="font-bold">
                Create Admin Account
              </DialogTitle>
              <DialogDescription className="text-xs">
                Create an admin account and assign the appropriate role and
                permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-5">
                <section className="rounded-lg border border-border p-4">
                  <h3 className="mb-4 text-sm font-semibold">
                    Personal Information
                  </h3>
                  {(
                    [
                      { name: "name", label: "Full Name" },
                      { name: "email", label: "Email Address" },
                    ] as const
                  ).map((field) => (
                    <div key={field.name} className="mb-4 space-y-1.5">
                      <Label
                        htmlFor={`create-${field.name}`}
                        className="text-xs"
                      >
                        {field.label}{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`create-${field.name}`}
                        type={field.name === "email" ? "email" : "text"}
                        {...register(field.name)}
                        aria-invalid={!!errors[field.name]}
                      />
                      {errors[field.name] && (
                        <p role="alert" className="text-xs text-destructive">
                          {errors[field.name]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </section>
                <section className="rounded-lg border border-border p-4">
                  <h3 className="mb-4 text-sm font-semibold">
                    Login Credentials
                  </h3>
                  {(
                    [
                      {
                        name: "temporaryPassword",
                        label: "Temporary Password",
                      },
                      { name: "confirmPassword", label: "Confirm Password" },
                    ] as const
                  ).map((field) => (
                    <div key={field.name} className="mb-4 space-y-1.5">
                      <Label htmlFor={field.name} className="text-xs">
                        {field.label}{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id={field.name}
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          {...register(field.name)}
                          aria-invalid={!!errors[field.name]}
                          className="pr-10"
                        />
                        {field.name === "temporaryPassword" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            className="absolute right-1 top-1"
                            onClick={() =>
                              setShowPassword((previous) => !previous)
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </Button>
                        )}
                      </div>
                      {errors[field.name] && (
                        <p role="alert" className="text-xs text-destructive">
                          {errors[field.name]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                  <p className="text-[11px] text-muted-foreground">
                    Use 8+ characters with a mix of letters, numbers & symbols.
                  </p>
                </section>
              </div>
              <section className="rounded-lg border border-border p-4">
                <h3 className="mb-4 text-sm font-semibold">
                  Role & Access Permissions
                </h3>
                <Label htmlFor="create-role" className="text-xs">
                  Assign Admin Role
                </Label>
                <select
                  id="create-role"
                  {...register("roleId", {
                    onChange: (event) => {
                      const role = roles.find(
                        (item) => item.id === event.target.value,
                      );
                      if (role)
                        setValue("permissions", role.permissions, {
                          shouldDirty: true,
                        });
                    },
                  })}
                  className="mb-4 mt-2 h-10 w-full rounded-md border border-input bg-card px-3 text-xs"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <Controller
                  name="permissions"
                  control={control}
                  render={({ field }) => (
                    <AccessPermissionsMatrix
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </section>
            </div>
            {error && (
              <p role="alert" className="text-xs text-destructive">
                {error}
              </p>
            )}
            <footer className="flex justify-end gap-3 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Create Admin Account
              </Button>
            </footer>
          </form>
        </DialogContent>
      </Dialog>
      {discard && (
        <AccessConfirmDialog
          title="Discard Changes?"
          description="You have unsaved account and permission changes. Are you sure you want to leave without saving?"
          action="Discard Changes"
          onClose={() => setDiscard(false)}
          onConfirm={async () => close()}
        />
      )}
    </>
  );
}
