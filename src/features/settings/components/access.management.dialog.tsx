"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AccessPermissionsMatrix } from "./access.permissions.matrix";
import { AccessConfirmDialog } from "./access.confirm.dialog";
import { accessRoleSchema } from "../schemas/settings.access.schema";
import type {
  AccessAdmin,
  AccessAccount,
  AccessRole,
  AccessSnapshot,
  AccessCommand,
  AccessPermissions,
} from "../settings.access.types";

export type AccessManagementView =
  "admins" | "invitations" | "accounts" | "roles" | "activity";
export function AccessManagementDialog({
  view,
  snapshot,
  onClose,
  onCommand,
  busy = false,
}: {
  view: AccessManagementView;
  snapshot: AccessSnapshot;
  onClose: () => void;
  onCommand: (command: AccessCommand) => Promise<void>;
  busy?: boolean;
}) {
  const canManage = snapshot.canManage && !busy;
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<{
    admin: AccessAdmin;
    mode: "role" | "permissions";
  } | null>(null);
  const [role, setRole] = useState<AccessRole | "new" | null>(null);
  const [confirmation, setConfirmation] = useState<{
    admin?: AccessAdmin;
    account?: AccessAccount;
  } | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const titles = {
    admins: "Admin Accounts & Roles",
    invitations: "Admin Invitations",
    accounts: "Manage Accounts",
    roles: "Roles & Permissions",
    activity: "Recent Access Activity",
  };
  const admins = snapshot.admins.filter(
    (admin) =>
      (view !== "invitations" || admin.status === "Invited") &&
      `${admin.name} ${admin.email} ${admin.status} ${admin.roleId}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const accounts = snapshot.accounts.filter((account) =>
    `${account.name} ${account.email} ${account.status} ${account.classification}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const roleRows = snapshot.roles.filter((item) =>
    `${item.name} ${item.description}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const activityRows = snapshot.activities.filter((item) =>
    `${item.name} ${item.activity}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const rows =
    view === "roles"
      ? roleRows
      : view === "accounts"
        ? accounts
        : view === "activity"
          ? activityRows
          : admins;
  return (
    <>
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open && !busy) onClose();
        }}
      >
        <DialogContent
          showCloseButton={!busy}
          className="max-h-[85vh] overflow-y-auto sm:max-w-[850px]"
        >
          <DialogHeader>
            <DialogTitle className="font-bold">{titles[view]}</DialogTitle>
            <DialogDescription className="text-xs">
              Review platform access records and account controls.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between gap-4">
            <Input
              aria-label={`Search ${titles[view]}`}
              placeholder="Search by name, email or status..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="max-w-sm text-xs"
            />
            {view === "roles" && canManage && (
              <Button onClick={() => setRole("new")} className="text-xs">
                Create Custom Role
              </Button>
            )}
          </div>
          <div className="divide-y divide-border">
            {(view === "admins" || view === "invitations") &&
              admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold">{admin.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {admin.email}
                    </p>
                    <p className="mt-1 text-[11px] text-secondary">
                      {
                        snapshot.roles.find((item) => item.id === admin.roleId)
                          ?.name
                      }{" "}
                      • {admin.status}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!canManage}
                      onClick={() => setEditing({ admin, mode: "role" })}
                    >
                      Change Role
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!canManage}
                      onClick={() => setEditing({ admin, mode: "permissions" })}
                    >
                      Permissions
                    </Button>
                    {admin.status === "Invited" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!canManage}
                        onClick={async () => {
                          try {
                            await onCommand({
                              type: "resend-invite",
                              id: admin.id,
                            });
                          } catch {
                            /* The parent displays mutation errors. */
                          }
                        }}
                      >
                        Resend
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      disabled={!canManage}
                      onClick={() => setConfirmation({ admin })}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            {view === "accounts" &&
              accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold">{account.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {account.email} • {account.classification}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs ${account.status === "Active" ? "text-secondary" : "text-destructive"}`}
                    >
                      {account.status}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={
                        !canManage ||
                        !["Active", "Suspended"].includes(account.status)
                      }
                      onClick={() => setConfirmation({ account })}
                    >
                      {account.status === "Active" ? "Suspend" : "Reactivate"}
                    </Button>
                  </div>
                </div>
              ))}
            {view === "roles" &&
              roleRows.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!canManage}
                    onClick={() => setRole(item)}
                  >
                    Manage
                  </Button>
                </div>
              ))}
            {view === "activity" &&
              activityRows.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="text-xs font-semibold">
                      {item.name} • {item.type}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.activity}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDetail(
                        `${item.name}\n${item.activity}\n${new Date(item.at).toLocaleString("en-GB", { timeZone: "Africa/Lagos" })}\n${item.status}`,
                      )
                    }
                  >
                    Details
                  </Button>
                </div>
              ))}
            {rows.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No records found.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {editing && (
        <AdminEditor
          key={`${editing.admin.id}-${editing.mode}`}
          {...editing}
          roles={snapshot.roles}
          onClose={() => setEditing(null)}
          onCommand={onCommand}
        />
      )}
      {role && (
        <RoleEditor
          key={role === "new" ? "new" : role.id}
          role={role}
          defaultPermissions={snapshot.roles[1].permissions}
          onClose={() => setRole(null)}
          onCommand={onCommand}
        />
      )}
      {confirmation && (
        <AccessConfirmDialog
          title={
            confirmation.admin
              ? "Remove Admin?"
              : confirmation.account?.status === "Active"
                ? "Suspend Account"
                : "Reactivate Account"
          }
          description={
            confirmation.admin
              ? `Remove dashboard access for ${confirmation.admin.name}.`
              : `${confirmation.account?.name} will ${confirmation.account?.status === "Active" ? "lose" : "regain"} platform access.`
          }
          action={
            confirmation.admin
              ? "Remove Admin"
              : confirmation.account?.status === "Active"
                ? "Suspend Account"
                : "Reactivate Account"
          }
          destructive={
            !!confirmation.admin || confirmation.account?.status === "Active"
          }
          reasonRequired={confirmation.account?.status === "Active"}
          onClose={() => setConfirmation(null)}
          onConfirm={async (reason) => {
            if (confirmation.admin)
              await onCommand({
                type: "remove-admin",
                id: confirmation.admin.id,
              });
            else if (confirmation.account)
              await onCommand({
                type: "account",
                id: confirmation.account.id,
                status:
                  confirmation.account.status === "Active"
                    ? "Suspended"
                    : "Active",
                reason,
              });
          }}
        />
      )}
      {detail && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) setDetail(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Access Activity Details</DialogTitle>
              <DialogDescription className="whitespace-pre-line text-xs leading-6">
                {detail}
              </DialogDescription>
            </DialogHeader>
            <Button variant="outline" onClick={() => setDetail(null)}>
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function AdminEditor({
  admin,
  mode,
  roles,
  onClose: close,
  onCommand,
}: {
  admin: AccessAdmin;
  mode: "role" | "permissions";
  roles: AccessRole[];
  onClose: () => void;
  onCommand: (command: AccessCommand) => Promise<void>;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: { roleId: admin.roleId, permissions: admin.permissions },
  });
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
          className={mode === "permissions" ? "sm:max-w-[650px]" : ""}
        >
          <form
            className="space-y-5"
            onSubmit={handleSubmit(async (values) => {
              try {
                await onCommand(
                  mode === "role"
                    ? {
                        type: "admin-role",
                        id: admin.id,
                        roleId: values.roleId,
                      }
                    : {
                        type: "permissions",
                        id: admin.id,
                        permissions: values.permissions,
                      },
                );
                close();
              } catch (cause) {
                setError(
                  cause instanceof Error
                    ? cause.message
                    : "Unable to update administrator.",
                );
              }
            })}
          >
            <DialogHeader>
              <DialogTitle className="font-bold">
                {mode === "role" ? "Change Admin Role" : "Manage Permissions"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Modify platform capabilities for this administrator account.
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-md border border-border bg-muted/20 p-3">
              <p className="text-sm font-semibold">{admin.name}</p>
              <p className="text-xs text-muted-foreground">{admin.email}</p>
            </div>
            {mode === "role" ? (
              <div className="space-y-2">
                <Label htmlFor="new-admin-role" className="text-xs">
                  Select New Role
                </Label>
                <select
                  id="new-admin-role"
                  {...register("roleId")}
                  className="h-10 w-full rounded-md border border-input bg-card px-3 text-xs"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
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
            )}
            <p className="rounded-md border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
              Changing access may change this administrator&apos;s permissions.
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
                Save Changes
              </Button>
            </footer>
          </form>
        </DialogContent>
      </Dialog>
      {discard && (
        <AccessConfirmDialog
          title="Discard Changes?"
          description="Any edits to this administrator's role or access permissions will be lost."
          action="Discard Changes"
          onClose={() => setDiscard(false)}
          onConfirm={async () => close()}
        />
      )}
    </>
  );
}

function RoleEditor({
  role,
  defaultPermissions,
  onClose: close,
  onCommand,
}: {
  role: AccessRole | "new";
  defaultPermissions: AccessPermissions;
  onClose: () => void;
  onCommand: (command: AccessCommand) => Promise<void>;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(accessRoleSchema),
    defaultValues:
      role === "new"
        ? { name: "", description: "", permissions: defaultPermissions }
        : {
            name: role.name,
            description: role.description,
            permissions: role.permissions,
          },
  });
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
          className="max-h-[90vh] overflow-y-auto sm:max-w-[650px]"
        >
          <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => {
              try {
                await onCommand({
                  type: "role",
                  role: {
                    id:
                      role === "new"
                        ? `custom-${crypto.randomUUID()}`
                        : role.id,
                    system: role !== "new" && role.system,
                    scope: role === "new" ? ["Custom Permissions"] : role.scope,
                    ...values,
                  },
                });
                close();
              } catch (cause) {
                setError(
                  cause instanceof Error
                    ? cause.message
                    : "Unable to save role.",
                );
              }
            })}
          >
            <DialogHeader>
              <DialogTitle className="font-bold">
                {role === "new" ? "Create Custom Role" : `Manage ${role.name}`}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Configure the role&apos;s platform access scope.
              </DialogDescription>
            </DialogHeader>
            <Label htmlFor="role-name">Role Name</Label>
            <Input
              id="role-name"
              {...register("name")}
              readOnly={role !== "new" && role.system}
            />
            {errors.name && (
              <p role="alert" className="text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
            <Label htmlFor="role-description">Description</Label>
            <Input id="role-description" {...register("description")} />
            {errors.description && (
              <p role="alert" className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
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
                Save Role
              </Button>
            </footer>
          </form>
        </DialogContent>
      </Dialog>
      {discard && (
        <AccessConfirmDialog
          title="Discard Changes?"
          description="Any unsaved edits to this role and its access permissions will be lost."
          action="Discard Changes"
          onClose={() => setDiscard(false)}
          onConfirm={async () => close()}
        />
      )}
    </>
  );
}
