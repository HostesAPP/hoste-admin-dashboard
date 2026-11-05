"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useProfiles } from "../hooks/use-profiles";
import { exportProfilesCsv } from "../api/profile.api";
import { ProfilesHeader } from "./ProfilesHeader";
import { ProfilesTabs } from "./ProfilesTabs";
import { ProfilesTable } from "./ProfilesTable";
import { ProfileActionModal, type ActionType } from "./ProfileActionModal";
import type { Profile } from "../types/profiles.types";

export function ProfilesView() {
  const {
    profiles,
    totalResults,
    totalPages,
    currentPage,
    rowsPerPage,
    skip,
    take,
    activeTab,
    tabCounts,
    searchQuery,
    isLoading,
    handleTabChange,
    handleSearch,
    handlePageChange,
    handleRowsPerPageChange,
    handleSkipChange,
    handleTakeChange,
    approveProfile,
    rejectProfile,
    suspendProfile,
    restoreProfile,
    banProfile,
  } = useProfiles();

  const [isExporting, setIsExporting] = useState(false);
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

  const handleConfirmAction = async (
    profileId: string,
    reason?: string,
    durationDays?: number,
  ) => {
    if (!modalState.selectedProfile || !modalState.actionType) return;

    const profileName = modalState.selectedProfile.displayName;

    try {
      switch (modalState.actionType) {
        case "approve":
          await approveProfile(profileId);
          toast.success(`Profile for ${profileName} approved and activated.`);
          break;
        case "reject":
          await rejectProfile(profileId, reason);
          toast.error(`Profile application for ${profileName} rejected.`);
          break;
        case "suspend":
          suspendProfile(profileId, reason, durationDays);
          toast.warning(
            `Profile for ${profileName} suspended for ${durationDays || 30} days.`,
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
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to perform action";
      toast.error(errorMsg);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const statusMap: Record<
        typeof activeTab,
        "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED" | "DELETED"
      > = {
        pending: "PENDING",
        approved: "ACTIVE",
        rejected: "REJECTED",
        suspended: "SUSPENDED",
        deactivated: "DELETED",
      };

      const result = await exportProfilesCsv({
        status: statusMap[activeTab],
        search: searchQuery.trim() || undefined,
      });

      if (result.truncated) {
        toast.warning(
          "Export complete: list truncated at 10,000 records per system limit.",
        );
      } else {
        toast.success(`Export complete: ${result.filename} downloaded.`);
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to export profiles";
      toast.error(errorMsg);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Header */}
      <ProfilesHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onExport={handleExport}
        isExporting={isExporting}
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
          skip={skip}
          take={take}
          status={activeTab}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onSkipChange={handleSkipChange}
          onTakeChange={handleTakeChange}
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
