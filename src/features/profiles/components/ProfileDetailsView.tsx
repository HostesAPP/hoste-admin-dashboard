"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PROFILES } from "../data/profiles.data";
import type { Profile } from "../types/profiles.types";
import { ProfileDetailsHeader } from "./ProfileDetailsHeader";
import { ProfileSummaryCard } from "./ProfileSummaryCard";
import { ProfilePersonalInfoCard } from "./ProfilePersonalInfoCard";
import { ProfileAboutCard } from "./ProfileAboutCard";
import { ProfileServicesSkillsCard } from "./ProfileServicesSkillsCard";
import { ProfileExperienceCard } from "./ProfileExperienceCard";
import { ProfileAvailabilityCard } from "./ProfileAvailabilityCard";
import { ProfileRatingsReviewsCard } from "./ProfileRatingsReviewsCard";
import { ProfileBookingHistoryCard } from "./ProfileBookingHistoryCard";
import { ProfileVerificationSummaryCard } from "./ProfileVerificationSummaryCard";
import {
  ProfileActionModal,
  type ActionType,
} from "./ProfileActionModal";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileDetailsViewProps {
  profileId: string;
}

export function ProfileDetailsView({ profileId }: ProfileDetailsViewProps) {
  const [profile, setProfile] = useState<Profile | undefined>(() =>
    PROFILES.find((p) => p.id === profileId || p.hosteId === profileId)
  );

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    actionType: ActionType;
    selectedProfile: Profile | null;
  }>({
    isOpen: false,
    actionType: null,
    selectedProfile: null,
  });

  if (!profile) {
    return (
      <div className="p-8 space-y-4">
        <Link href="/profiles">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs rounded-lg">
            <ChevronLeft className="w-4 h-4" />
            Back to Profiles
          </Button>
        </Link>
        <div className="bg-card rounded-2xl border border-border/80 p-12 text-center">
          <h2 className="text-base font-bold text-foreground">Profile Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1">
            No profile was found matching ID: {profileId}
          </p>
        </div>
      </div>
    );
  }

  const handleOpenActionModal = (type: ActionType, p: Profile) => {
    setModalState({
      isOpen: true,
      actionType: type,
      selectedProfile: p,
    });
  };

  const handleCloseActionModal = () => {
    setModalState({
      isOpen: false,
      actionType: null,
      selectedProfile: null,
    });
  };

  const handleConfirmAction = (
    _id: string,
    reason?: string,
    durationDays?: number
  ) => {
    if (!modalState.actionType) return;

    if (modalState.actionType === "approve") {
      setProfile((prev) =>
        prev ? { ...prev, status: "Active", verificationStatus: "Active" } : prev
      );
      toast.success(`Profile for ${profile.displayName} approved.`);
    } else if (modalState.actionType === "reject") {
      setProfile((prev) =>
        prev
          ? {
            ...prev,
            status: "Rejected",
            verificationStatus: "Rejected",
            activationData: { ...prev.activationData, rejectionReason: reason },
          }
          : prev
      );
      toast.error(`Profile application rejected.`);
    } else if (modalState.actionType === "suspend") {
      setProfile((prev) =>
        prev
          ? {
            ...prev,
            status: "Suspended",
            suspendedUntil: durationDays
              ? new Date(Date.now() + durationDays * 86400000).toISOString()
              : null,
          }
          : prev
      );
      toast.warning(`Profile suspended.`);
    } else if (modalState.actionType === "restore") {
      setProfile((prev) => (prev ? { ...prev, status: "Active" } : prev));
      toast.success(`Profile for ${profile.displayName} restored to active status.`);
    } else if (modalState.actionType === "ban") {
      setProfile((prev) => (prev ? { ...prev, status: "Deleted" } : prev));
      toast.error(`Profile deactivated.`);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied to clipboard");
  };

  return (
    <div className="p-8 space-y-6 mx-auto">
      {/* Header & Breadcrumb */}
      <ProfileDetailsHeader
        displayName={profile.displayName}
        onCopyId={handleCopyId}
      />

      {/* Top Summary Card */}
      <ProfileSummaryCard
        profile={profile}
        onOpenActionModal={handleOpenActionModal}
      />

      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-2 gap-6 items-start">
        {/* Left Column (7 cols) */}
        <div className="space-y-6">
          <ProfilePersonalInfoCard profile={profile} />
          <ProfileAboutCard profile={profile} />
          <ProfileServicesSkillsCard profile={profile} />
          <ProfileExperienceCard profile={profile} />
        </div>

        {/* Right Column (5 cols) */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <ProfileAvailabilityCard profile={profile} />
            <ProfileRatingsReviewsCard profile={profile} />
          </div>
          <ProfileBookingHistoryCard profile={profile} />
          <ProfileVerificationSummaryCard profile={profile} />
        </div>
      </div>

      {/* Action Dialog Modal */}
      <ProfileActionModal
        isOpen={modalState.isOpen}
        onClose={handleCloseActionModal}
        actionType={modalState.actionType}
        profile={modalState.selectedProfile}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
