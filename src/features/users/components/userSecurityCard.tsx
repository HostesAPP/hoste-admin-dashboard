"use client";

import type { User } from "../types/users.types";
import { cn } from "@/lib/utils";

interface UserSecurityCardProps {
  user: User;
  onViewLoginActivity?: () => void;
}

export function UserSecurityCard({
  user,
  onViewLoginActivity,
}: UserSecurityCardProps) {
  const security = user.security || {
    emailVerified: user.emailVerified ?? true,
    phoneVerified: user.phoneVerified ?? true,
    twoFactorEnabled: true,
    lastLogin: user.lastActive || "Today • 10:42 AM",
    lastLoginDevice: "Chrome • Windows",
    lastLoginLocation: "Lagos, Nigeria",
  };

  return (
    <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-bold text-foreground mb-4">Security & Access</h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Email Verification</span>
            <span
              className={cn(
                "font-semibold",
                security.emailVerified ? "text-success" : "text-destructive"
              )}
            >
              {security.emailVerified ? "Verified" : "Unverified"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Phone Verification</span>
            <span
              className={cn(
                "font-semibold",
                security.phoneVerified ? "text-success" : "text-destructive"
              )}
            >
              {security.phoneVerified ? "Verified" : "Unverified"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Two-Factor Authentication</span>
            <span
              className={cn(
                "font-semibold",
                security.twoFactorEnabled ? "text-success" : "text-muted-foreground"
              )}
            >
              {security.twoFactorEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Last Login</span>
            <span className="font-semibold text-foreground">
              {security.lastLogin}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Last Login Device</span>
            <span className="font-semibold text-foreground">
              {security.lastLoginDevice}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Last Login Location</span>
            <span className="font-semibold text-foreground">
              {security.lastLoginLocation}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom link */}
      <div className="pt-3 border-t border-border/50 mt-3 text-right">
        <button
          type="button"
          onClick={onViewLoginActivity}
          className="text-xs font-semibold text-foreground hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <span>View Login Activity</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
