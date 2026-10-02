"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useProfiles } from "../hooks/use-profiles";
import { ProfilesHeader } from "./ProfilesHeader";
import { ProfilesTabs } from "./ProfilesTabs";
import { ProfilesTable } from "./ProfilesTable";
import {
  ProfileActionModal,
  type ActionType,
} from "./ProfileActionModal";
import type { Profile } from "../types/profiles.types";

export function ProfilesView() {
  const {
    profiles,
    totalResults,
    totalPages,
    currentPage,
    rowsPerPage,
    activeTab,
    tabCounts,
    searchQuery,
    handleTabChange,
    handleSearch,
    handlePageChange,
    handleRowsPerPageChange,
    approveProfile,
    rejectProfile,
    suspendProfile,
    restoreProfile,
    banProfile,
  } = useProfiles();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    actionType: ActionType;
    selectedProfile: Profile | null;
  }>({
    isOpen: false,
    actionType: null,
    selectedProfile: null,
  });

  const handleOpenActionModal = (type: ActionType, profile: Profile) => {
    setModalState({
      isOpen: true,
      actionType: type,
      selectedProfile: profile,
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
    profileId: string,
    reason?: string,
    durationDays?: number
  ) => {
    if (!modalState.selectedProfile || !modalState.actionType) return;

    const profileName = modalState.selectedProfile.displayName;

    switch (modalState.actionType) {
      case "approve":
        approveProfile(profileId);
        toast.success(`Profile for ${profileName} approved and activated.`);
        break;
      case "reject":
        rejectProfile(profileId, reason);
        toast.error(`Profile application for ${profileName} rejected.`);
        break;
      case "suspend":
        suspendProfile(profileId, reason, durationDays);
        toast.warning(
          `Profile for ${profileName} suspended for ${durationDays || 30} days.`
        );
        break;
      case "restore":
        restoreProfile(profileId);
        toast.success(`Profile for ${profileName} restored to active status.`);
        break;
      case "ban":
        banProfile(profileId, reason);
        toast.error(`Profile for ${profileName} deactivated.`);
        break;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Header */}
      <ProfilesHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
      />

      {/* Main Content Area */}
      <div className="p-8 space-y-6">
        {/* Status Filter Tabs */}
        <ProfilesTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabCounts={tabCounts}
        />

        {/* Profiles Table Card */}
        <ProfilesTable
          profiles={profiles}
          totalResults={totalResults}
          totalPages={totalPages}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onOpenActionModal={handleOpenActionModal}
        />
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
