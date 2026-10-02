"use client";

import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldBan,
  Copy,
  Star,
  Circle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Profile } from "../types/profiles.types";
import type { ActionType } from "./ProfileActionModal";

interface ProfileRowItemProps {
  profile: Profile;
  onOpenActionModal: (type: ActionType, profile: Profile) => void;
}

export function ProfileRowItem({
  profile,
  onOpenActionModal,
}: ProfileRowItemProps) {
  const formattedJoinedDate = new Date(profile.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  const copyProfileId = () => {
    navigator.clipboard.writeText(profile.hosteId);
    toast.success(`Copied ID ${profile.hosteId} to clipboard`);
  };

  const formattedType =
    profile.profileType === "INDIVIDUAL"
      ? "Individual"
      : profile.profileType === "HOST"
      ? "Host"
      : profile.profileType === "BRAND"
      ? "Brand"
      : "Event Planner";

  return (
    <div className="group flex flex-col py-4 px-3 border-b border-border/40 hover:bg-muted/10 transition-colors">
      {/* Primary Row Content */}
      <div className="flex items-center justify-between gap-4">
        {/* Left Status Dot + Avatar + Host Name & Category */}
        <div className="flex items-center gap-3.5 min-w-70">
          {/* Status Indicator Dot */}
          <span
            className="w-2 h-2 rounded-full bg-primary shrink-0"
            title={`Status: ${profile.status}`}
          />

          {/* Avatar */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border border-border/40"
            style={{
              backgroundColor: profile.avatarBgColor || "var(--accent)",
              color: "var(--foreground)",
            }}
          >
            {profile.avatarInitial || profile.displayName.charAt(0)}
          </div>

          {/* Host Name & Role */}
          <div className="flex flex-col min-w-0">
            <Link
              href={`/profiles/${profile.id}`}
              className="font-bold text-sm text-foreground hover:text-primary transition-colors truncate"
            >
              {profile.displayName}
            </Link>
            <span className="text-xs text-muted-foreground mt-0.5 truncate">
              {profile.categoryRole || "Host"}{" "}
              {profile.subLocation ? `• ${profile.subLocation}` : ""}
            </span>
          </div>
        </div>

        {/* Type Badge */}
        <div className="w-28 flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-secondary/10 text-secondary border border-secondary/20">
            {formattedType}
          </span>
        </div>

        {/* Location */}
        <div className="w-40 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground/80 shrink-0" />
          <span className="truncate">
            {profile.city}, {profile.country}
          </span>
        </div>

        {/* Joined Date */}
        <div className="w-32 text-xs text-muted-foreground">
          {formattedJoinedDate}
        </div>

        {/* Profile ID */}
        <div className="w-28 text-xs text-muted-foreground font-mono font-medium">
          {profile.hosteId}
        </div>

        {/* Action Button & Dropdown Menu */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/profiles/${profile.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3.5 text-xs font-semibold rounded-lg border-primary text-primary hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-1.5"
            >
              <span>View Full Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
              <MoreVertical className="w-4 h-4" />
              <span className="sr-only">More actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              {profile.status === "Pending" && (
                <>
                  <DropdownMenuItem
                    onClick={() => onOpenActionModal("approve", profile)}
                    className="text-xs cursor-pointer text-secondary focus:text-secondary font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                    Approve Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onOpenActionModal("reject", profile)}
                    className="text-xs cursor-pointer text-destructive focus:text-destructive font-medium"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-2" />
                    Reject Application
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              {profile.status === "Active" && (
                <>
                  <DropdownMenuItem
                    onClick={() => onOpenActionModal("suspend", profile)}
                    className="text-xs cursor-pointer text-warning focus:text-warning font-medium"
                  >
                    <Clock className="w-3.5 h-3.5 mr-2" />
                    Suspend Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onOpenActionModal("ban", profile)}
                    className="text-xs cursor-pointer text-destructive focus:text-destructive font-medium"
                  >
                    <ShieldBan className="w-3.5 h-3.5 mr-2" />
                    Deactivate / Ban
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              {(profile.status === "Suspended" ||
                profile.status === "Deleted" ||
                profile.status === "Rejected") && (
                <>
                  <DropdownMenuItem
                    onClick={() => onOpenActionModal("restore", profile)}
                    className="text-xs cursor-pointer text-secondary focus:text-secondary font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                    Restore Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuItem
                onClick={copyProfileId}
                className="text-xs cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 mr-2" />
                Copy Profile ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Secondary Details Pill Strip */}
      <div className="mt-2.5 ml-5 flex items-center flex-wrap gap-2 text-[11px] text-muted-foreground bg-muted/20 border border-border/40 rounded-xl px-4 py-2">
        <div className="flex items-center gap-1.5">
          <Circle className="w-3 h-3 text-muted-foreground/60 shrink-0" />
          <span>
            Email:{" "}
            <span className="text-foreground/90 font-medium">
              {profile.email}
            </span>
          </span>
        </div>

        <span className="text-muted-foreground/50">•</span>

        <span>
          Phone:{" "}
          <span className="text-foreground/90 font-medium">
            {profile.phone}
          </span>
        </span>

        <span className="text-muted-foreground/50">•</span>

        <span>
          <strong className="text-foreground/90 font-medium">
            {profile.completedBookingsCount ?? 0}
          </strong>{" "}
          Completed Bookings
        </span>

        <span className="text-muted-foreground/50">•</span>

        <div className="flex items-center gap-1">
          <span>Rating:</span>
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-foreground/90 font-semibold">
            {profile.rating?.toFixed(1) ?? "0.0"}
          </span>
          <span>({profile.reviewsCount ?? 0})</span>
        </div>
      </div>
    </div>
  );
}
