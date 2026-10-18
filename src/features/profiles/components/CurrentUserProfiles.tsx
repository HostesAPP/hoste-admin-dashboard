"use client";

import React from "react";
import { Loader2, RotateCw, User, ShieldCheck, ShieldAlert, Sparkles } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useMyProfiles } from "../hooks/use-my-profiles";
import type { UserProfile } from "../types/profiles.types";
import { cn } from "@/lib/utils";

function normalizeStatus(value: string | undefined): string {
  if (!value) return "Pending";
  // Convert "PENDING" -> "Pending", "ACTIVE" -> "Active"
  const lower = value.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

interface CurrentUserProfilesProps {
  className?: string;
  onSelectProfile?: (profile: UserProfile) => void;
  selectedProfileId?: string | null;
}

/**
 * Feature component to display the authenticated user's profiles returned by GET /api/v1/profiles/me.
 * Handles Loading, Error, Empty, and Success states.
 */
export function CurrentUserProfiles({
  className,
  onSelectProfile,
  selectedProfileId,
}: CurrentUserProfilesProps) {
  const { data, isLoading, isError, error, refetch, isFetching } = useMyProfiles();

  // 1. Loading State
  if (isLoading) {
    return (
      <div className={cn("p-4 flex flex-col items-center justify-center gap-2 text-center", className)}>
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Loading your profiles...</p>
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div className={cn("p-4 rounded-xl border border-destructive/20 bg-destructive/5 space-y-2.5", className)}>
        <div className="flex items-center gap-2 text-destructive">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <p className="text-xs font-semibold">Unable to load profiles</p>
        </div>
        <p className="text-[11px] text-muted-foreground">
          {error?.message || "An unexpected error occurred while fetching your profiles."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-card border border-border hover:bg-muted/60 text-foreground transition-colors cursor-pointer disabled:opacity-50"
        >
          <RotateCw className={cn("w-3 h-3 text-muted-foreground", isFetching && "animate-spin")} />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const profiles = data?.data ?? [];

  // 3. Empty State
  if (profiles.length === 0) {
    return (
      <div className={cn("p-4 rounded-xl border border-dashed border-border text-center space-y-1.5", className)}>
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <User className="w-4 h-4" />
        </div>
        <p className="text-xs font-semibold text-foreground">No Profiles Found</p>
        <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
          Your authenticated staff account does not currently have any active marketplace profiles.
        </p>
      </div>
    );
  }

  // 4. Success State
  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          User Profiles ({profiles.length})
        </span>
        {isFetching && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
      </div>

      <div className="space-y-2">
        {profiles.map((profile) => {
          const isSelected = selectedProfileId === profile.id;
          const isVerified =
            profile.verificationStatus?.toUpperCase() === "VERIFIED" ||
            profile.verificationStatus?.toUpperCase() === "ACTIVE";

          return (
            <div
              key={profile.id}
              onClick={() => onSelectProfile?.(profile)}
              className={cn(
                "p-3 rounded-xl border border-border bg-card transition-all text-left",
                onSelectProfile && "cursor-pointer hover:border-primary/50 hover:bg-muted/40",
                isSelected && "border-primary bg-primary/5"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                {/* Display Name and Profile Type */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs font-bold text-foreground truncate" title={profile.displayName}>
                      {profile.displayName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                      {profile.profileType}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono truncate">
                      ID: {profile.id.slice(0, 8)}...
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <StatusBadge status={normalizeStatus(profile.status)} />
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border",
                      isVerified
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {isVerified ? (
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                    ) : (
                      <ShieldAlert className="w-2.5 h-2.5 text-muted-foreground" />
                    )}
                    <span>{profile.verificationStatus || "Unverified"}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
