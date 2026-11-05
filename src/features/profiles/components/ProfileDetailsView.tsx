"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Profile } from "../types/profiles.types";
import { useAdminProfileDetail, useReviewActivation } from "../hooks/use-profiles";
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
import { ChevronLeft, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileDetailsViewProps {
  profileId: string;
}

export function ProfileDetailsView({ profileId }: ProfileDetailsViewProps) {
  const { data: profile, isLoading, isError, refetch } = useAdminProfileDetail(profileId);
  const reviewMutation = useReviewActivation();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    actionType: ActionType;
    selectedProfile: Profile | null;
  }>({
    isOpen: false,
    actionType: null,
    selectedProfile: null,
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 mx-auto">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />
        <div className="h-44 w-full bg-muted animate-pulse rounded-2xl" />
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="h-64 bg-muted animate-pulse rounded-2xl" />
            <div className="h-48 bg-muted animate-pulse rounded-2xl" />
          </div>
          <div className="space-y-6">
            <div className="h-64 bg-muted animate-pulse rounded-2xl" />
            <div className="h-48 bg-muted animate-pulse rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="p-8 space-y-4">
        <Link href="/profiles">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs rounded-lg">
            <ChevronLeft className="w-4 h-4" />
            Back to Profiles
          </Button>
        </Link>
        <div className="bg-card rounded-2xl border border-border/80 p-12 text-center space-y-3">
          <h2 className="text-base font-bold text-foreground">Profile Not Found</h2>
          <p className="text-xs text-muted-foreground">
            No profile was found matching ID: {profileId}
          </p>
          <div className="pt-2">
            <Button size="sm" onClick={() => refetch()} className="gap-1.5 text-xs cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5" />
              Retry
            </Button>
          </div>
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

  const handleConfirmAction = async (
    _id: string,
    reason?: string,
    _durationDays?: number
  ) => {
    if (!modalState.actionType || !profile) return;

    try {
      if (modalState.actionType === "approve") {
        await reviewMutation.mutateAsync({
          id: profile.id,
          action: "APPROVE",
        });
        toast.success(`Profile for ${profile.displayName} approved.`);
      } else if (modalState.actionType === "reject") {
        await reviewMutation.mutateAsync({
          id: profile.id,
          action: "REJECT",
          rejectionReason: reason || "Profile does not meet activation criteria.",
        });
        toast.error(`Profile application rejected.`);
      } else {
        toast.info(`${modalState.actionType} is not available at this time.`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Action failed. Please try again.";
      toast.error(message);
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
        {/* Left Column */}
        <div className="space-y-6">
          <ProfilePersonalInfoCard profile={profile} />
          <ProfileAboutCard profile={profile} />
          <ProfileServicesSkillsCard profile={profile} />
          <ProfileExperienceCard profile={profile} />
        </div>

        {/* Right Column */}
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
