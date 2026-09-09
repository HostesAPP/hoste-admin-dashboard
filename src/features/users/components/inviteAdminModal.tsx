"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  inviteAdminSchema,
  type InviteAdminFormValues,
} from "../schemas/users.schema";
import { Info, ChevronDown, CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface InviteAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccessInvite: (email: string) => void;
}

const roleDescriptions: Record<string, string> = {
  "Operations Admin":
    "Full management of platform bookings, user profiles, and routine property operations.",
  "Super Admin":
    "Unrestricted access to all system controls, financial payouts, role assignments, and platform settings.",
  "Verification Officer":
    "Review and verify Hosté KYC documentation, identity records, and verification circle approvals.",
  Moderator:
    "Review community standards, flagged profiles, blog posts, and handle user suspensions.",
  "Customer Support":
    "Manage customer tickets, respond to user inquiries, and monitor ongoing dispute escalations.",
  "Finance Officer":
    "Oversee escrow accounts, monitor revenue metrics, review payouts, and manage refunds.",
};

const defaultPermissionsByRole: Record<string, string[]> = {
  "Operations Admin": [
    "Manage Profiles",
    "Manage Users",
    "Manage Bookings",
    "Support Tickets",
  ],
  "Super Admin": [
    "Manage Profiles",
    "Manage Users",
    "Manage Bookings",
    "Manage Payments",
    "Manage Groups",
    "Manage Reports",
    "Notifications",
    "Support Tickets",
    "Manage Settings",
  ],
  "Verification Officer": ["Manage Profiles", "Manage Users", "Notifications"],
  Moderator: ["Manage Profiles", "Manage Users", "Notifications", "Support Tickets"],
  "Customer Support": ["Manage Bookings", "Support Tickets", "Notifications"],
  "Finance Officer": ["Manage Payments", "Manage Reports", "Manage Bookings"],
};

const allPermissionsList = [
  "Manage Profiles",
  "Manage Users",
  "Manage Bookings",
  "Manage Payments",
  "Manage Groups",
  "Manage Reports",
  "Notifications",
  "Support Tickets",
  "Manage Settings",
];

export function InviteAdminModal({
  open,
  onOpenChange,
  onSuccessInvite,
}: InviteAdminModalProps) {
  const [selectedRole, setSelectedRole] = useState("Operations Admin");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InviteAdminFormValues>({
    resolver: zodResolver(inviteAdminSchema),
    defaultValues: {
      fullName: "",
      email: "admin@email.com",
      phoneNumber: "",
      role: "Operations Admin",
      permissions: defaultPermissionsByRole["Operations Admin"],
      message: "",
    },
  });

  const currentPermissions = watch("permissions") || [];

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setValue("role", role);
    const inherited = defaultPermissionsByRole[role] || [];
    setValue("permissions", inherited);
  };

  const togglePermission = (perm: string) => {
    const next = currentPermissions.includes(perm)
      ? currentPermissions.filter((p) => p !== perm)
      : [...currentPermissions, perm];
    setValue("permissions", next);
  };

  const onSubmit = (data: InviteAdminFormValues) => {
    onSuccessInvite(data.email);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-card border-border p-6 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-lg font-bold text-foreground">
              Invite Admin
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Give a trusted team member access to the Hosté Admin Dashboard.
            </DialogDescription>
          </DialogHeader>

          {/* Full Name */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="fullName" className="text-xs font-semibold text-foreground">
              Full Name
            </Label>
            <Input
              id="fullName"
              {...register("fullName")}
              placeholder="Enter admin's full name"
              className="h-9 text-xs bg-card border-border/80 focus-visible:ring-primary focus-visible:ring-1"
            />
            {errors.fullName && (
              <span className="text-[11px] text-destructive">
                {errors.fullName.message}
              </span>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="email" className="text-xs font-semibold text-foreground">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="admin@email.com"
              className="h-9 text-xs bg-card border-primary focus-visible:ring-primary focus-visible:ring-1"
            />
            {errors.email && (
              <span className="text-[11px] text-destructive">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="phoneNumber" className="text-xs font-semibold text-foreground">
              Phone Number (Optional)
            </Label>
            <Input
              id="phoneNumber"
              {...register("phoneNumber")}
              placeholder="+234 000 000 0000"
              className="h-9 text-xs bg-card border-border/80 focus-visible:ring-primary focus-visible:ring-1"
            />
          </div>

          {/* Admin Role */}
          <div className="space-y-1.5 text-left">
            <Label className="text-xs font-semibold text-foreground">
              Admin Role
            </Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full h-9 px-3 text-xs font-medium border border-border/80 bg-card hover:bg-muted/50 rounded-md inline-flex items-center justify-between text-foreground cursor-pointer">
                    <span>{field.value || selectedRole}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[490px] text-xs">
                    {Object.keys(roleDescriptions).map((role) => (
                      <DropdownMenuItem
                        key={role}
                        onClick={() => handleRoleChange(role)}
                        className="py-2 flex flex-col items-start gap-0.5"
                      >
                        <span className="font-semibold text-xs text-foreground">
                          {role}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {roleDescriptions[role]}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            />

            {/* Role helper */}
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
              <Info className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
              <span>
                {roleDescriptions[selectedRole] ||
                  "Full management of platform bookings, user profiles, and routine property operations."}
              </span>
            </div>
          </div>

          {/* Permissions 3x3 Card Grid */}
          <div className="space-y-1.5 text-left">
            <Label className="text-xs font-semibold text-foreground">
              Permissions
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {allPermissionsList.map((perm) => {
                const isChecked = currentPermissions.includes(perm);
                const isInherited =
                  defaultPermissionsByRole[selectedRole]?.includes(perm);

                return (
                  <div
                    key={perm}
                    onClick={() => togglePermission(perm)}
                    className={cn(
                      "p-2.5 rounded-md border flex items-start gap-2 transition-colors cursor-pointer text-left select-none",
                      isChecked
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/70 hover:bg-muted/30"
                    )}
                  >
                    <div className="pt-0.5">
                      {isChecked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-primary fill-primary text-primary-foreground" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-foreground leading-tight truncate">
                        {perm}
                      </span>
                      {isChecked && isInherited && (
                        <span className="text-[9px] text-muted-foreground mt-0.5">
                          Inherited
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Invitation Message */}
          <div className="space-y-1.5 text-left">
            <Label htmlFor="message" className="text-xs font-semibold text-foreground">
              Invitation Message (Optional)
            </Label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder="Add a personal note to the invitation email..."
              rows={3}
              className="text-xs bg-card border-border/80 focus-visible:ring-primary focus-visible:ring-1 resize-none"
            />
          </div>

          <DialogFooter className="flex sm:justify-end gap-2 pt-3 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs font-medium h-9 px-4"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm h-9 px-5 rounded-lg cursor-pointer"
            >
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
