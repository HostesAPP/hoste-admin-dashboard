"use client";

import type { User } from "../types/users.types";
import { cn } from "@/lib/utils";

interface UserInformationCardProps {
  user: User;
}

export function UserInformationCard({ user }: UserInformationCardProps) {
  const isAdmin = user.type === "Admin" || user.role === "Staff";
  const title = isAdmin ? "Admin Information" : "User Information";
  const isActive = user.status === "Active";

  return (
    <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-bold text-foreground mb-4">{title}</h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Full Name</span>
            <span className="font-semibold text-foreground">
              {user.fullName || user.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-semibold text-foreground truncate max-w-[170px]">
              {user.email}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Phone</span>
            <span className="font-semibold text-foreground">
              {user.phoneNumber || "+234 803 000 0000"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">User ID</span>
            <span className="font-semibold text-foreground font-mono">
              {user.userCode}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Role</span>
            <span className="font-semibold text-foreground">
              {user.roleSubtitle || user.type}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Date Joined</span>
            <span className="font-semibold text-foreground">
              {user.dateJoined}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Last Active</span>
            <span className="font-semibold text-foreground">
              {user.lastActive}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Account Status</span>
            <span
              className={cn(
                "font-semibold",
                isActive ? "text-success" : "text-destructive"
              )}
            >
              {user.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
