"use client";

import { Check } from "lucide-react";
import type { User } from "../types/users.types";

interface UserPermissionsCardProps {
  user: User;
  onManagePermissions?: () => void;
}

const defaultAdminPermissions = [
  { id: "1", name: "Manage Profiles", granted: true },
  { id: "2", name: "Manage Users", granted: true },
  { id: "3", name: "Manage Bookings", granted: true },
  { id: "4", name: "Manage Payments", granted: true },
  { id: "5", name: "Manage Groups", granted: true },
  { id: "6", name: "Manage Reports", granted: true },
  { id: "7", name: "Manage Notifications", granted: true },
  { id: "8", name: "Manage Support Tickets", granted: true },
  { id: "9", name: "Manage Settings", granted: true },
];

export function UserPermissionsCard({
  user,
  onManagePermissions,
}: UserPermissionsCardProps) {
  const permissions = user.permissions || defaultAdminPermissions;
  const roleTitle = user.roleSubtitle || user.type;

  return (
    <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-bold text-foreground mb-4">Role & Permissions</h3>

        {/* Role row */}
        <div className="flex items-center justify-between text-xs pb-2.5 border-b border-border/50">
          <span className="text-muted-foreground">Role</span>
          <span className="font-bold text-foreground">{roleTitle}</span>
        </div>

        {/* Permissions list */}
        <div className="space-y-2 text-xs pt-2.5">
          {permissions.map((perm) => (
            <div
              key={perm.id}
              className="flex items-center justify-between text-foreground"
            >
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-foreground stroke-[2.5]" />
                <span className="font-normal text-xs">{perm.name}</span>
              </div>
              <Check className="w-3.5 h-3.5 text-foreground stroke-[2.5]" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom link */}
      <div className="pt-3 border-t border-border/50 mt-3 text-right">
        <button
          type="button"
          onClick={onManagePermissions}
          className="text-xs font-semibold text-foreground hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <span>View / Manage Permissions</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
