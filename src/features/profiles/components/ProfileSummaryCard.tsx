"use client";

import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile, ActionType } from "../types/profiles.types";
import Image from "next/image";

interface ProfileSummaryCardProps {
  profile: Profile;
  onOpenActionModal: (type: ActionType, profile: Profile) => void;
}

export function ProfileSummaryCard({
  profile,
  onOpenActionModal,
}: ProfileSummaryCardProps) {
  const isPending = profile.status === "Pending";

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-soft p-6">
      <div className="flex items-center justify-between gap-6">
        {/* Avatar + Main Details */}
        <div className="flex items-center gap-5">
          {/* Circular Avatar */}
          <div className="w-16 h-16 rounded-full bg-muted/70 border border-border/60 flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-9 h-9 text-muted-foreground/70" />
            )}
          </div>

          {/* Name, Role & Location */}
          <div className="flex flex-col gap-1 min-w-[200px]">
            <div className="text-sm font-bold text-foreground">
              Name: <span className="font-semibold">{profile.displayName}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Role: {profile.categoryRole || "Professional Hosté"}
            </div>
            <div className="text-xs text-muted-foreground">
              Location: {profile.subLocation || `${profile.city}, ${profile.country}`}
            </div>
          </div>

          {/* Member since & Account Status */}
          <div className="flex flex-col gap-1 pl-6 border-l border-border/40">
            <div className="text-xs text-muted-foreground">
              Member since:{" "}
              <strong className="text-foreground font-semibold">
                {profile.memberSince || "August 18, 2026"}
              </strong>
            </div>
            <div className="text-xs text-muted-foreground">
              Account status:{" "}
              <span
                className={
                  profile.status === "Pending"
                    ? "text-primary font-semibold"
                    : profile.status === "Active"
                    ? "text-secondary font-semibold"
                    : profile.status === "Suspended"
                    ? "text-amber-600 dark:text-amber-400 font-semibold"
                    : "text-destructive font-semibold"
                }
              >
                {profile.status === "Pending"
                  ? "Pending Approval"
                  : profile.status === "Active"
                  ? "Approved"
                  : profile.status}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Reject & Approve / Suspend / Restore) */}
        <div className="flex items-center gap-3 shrink-0">
          {profile.status === "Pending" ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenActionModal("reject", profile)}
                className="h-9 px-5 text-xs font-semibold rounded-lg border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              >
                Reject
              </Button>

              <Button
                type="button"
                onClick={() => onOpenActionModal("approve", profile)}
                className="h-9 px-5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
              >
                Approve Profile
              </Button>
            </>
          ) : profile.status === "Suspended" ||
            profile.status === "Deleted" ||
            profile.status === "Rejected" ? (
            <Button
              type="button"
              onClick={() => onOpenActionModal("restore", profile)}
              className="h-9 px-5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
            >
              Restore Account
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => onOpenActionModal("suspend", profile)}
              className="h-9 px-5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
            >
              Suspend Account
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
