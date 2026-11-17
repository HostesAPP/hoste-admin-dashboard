"use client";

import { useState } from "react";
import { UsersHeader } from "./usersHeader";
import { UsersStats } from "./usersStats";
import { UsersFilterBar } from "./usersFilterBar";
import { UsersTable } from "./usersTable";
import { UsersPagination } from "./usersPagination";
import { UserDetailDialog } from "./userDetailDialog";
import { ExportUsersModal } from "./exportUsersModal";
import { InviteAdminModal } from "./inviteAdminModal";
import { InviteSuccessModal } from "./inviteSuccessModal";
import { useUsers, useUserStats } from "../hooks/useUsers";
import { exportUsersCsv } from "../api/users.api";
import type { User, UserFilterParams, UserTab, UserStats } from "../types/users.types";
import { Button } from "@/components/ui/button";
import { Download, UserPlus } from "lucide-react";
import { toast } from "sonner";

export function UsersView() {
  const [activeTab, setActiveTab] = useState<UserTab>("ALL");
  const [filters, setFilters] = useState<UserFilterParams>({
    tab: "ALL",
    search: "",
    filter: "",
    dateJoined: "",
    status: "",
    role: "",
    page: 1,
    pageSize: 10,
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState("admin@email.com");

  // React Query hooks connected to real backend
  const { data, isLoading } = useUsers(filters);
  const { data: statsData, isLoading: isStatsLoading } = useUserStats({
    search: filters.search,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    dateJoined: filters.dateJoined,
  });

  const handleTabChange = (tab: UserTab) => {
    setActiveTab(tab);
    setFilters((prev) => ({ ...prev, tab, page: 1 }));
  };

  const handleFiltersChange = (newFilters: Partial<UserFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      tab: activeTab,
      search: "",
      filter: "",
      dateJoined: "",
      status: "",
      role: "",
      page: 1,
      pageSize: 10,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleToggleStatus = () => {
    // Skipping suspend, restore and ban mutations per user instruction
    toast.info("User status modification is not available at this time.");
  };

  const handleConfirmExport = async (
    scope: "all" | "filtered",
    format: "csv" | "xlsx" | "pdf" | "json"
  ) => {
    if (format !== "csv") {
      toast.info("Direct export is currently provided in CSV format.");
    }

    try {
      toast.info("Preparing users export...");
      const exportParams = scope === "all" ? {} : filters;
      const result = await exportUsersCsv(exportParams);

      if (result.truncated) {
        toast.warning(
          `Export completed: ${result.filename} downloaded (capped at 10,000 records).`
        );
      } else {
        toast.success(`Export completed: ${result.filename} downloaded.`);
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to export users.";
      toast.error(errorMsg);
    }
  };

  const handleSuccessInvite = (email: string) => {
    setInvitedEmail(email);
    setSuccessModalOpen(true);
  };

  const users = data?.users || [];

  // Compute live KPI stats from backend GET /api/v1/users/stats
  const stats: UserStats = {
    totalUsers: {
      count: statsData?.total ?? data?.totalCount ?? 0,
      growthPercent: 0,
      growthPeriod: "total",
    },
    hostes: {
      count: statsData?.byCategory?.HOST ?? 0,
      subtitle: "Active event pros",
    },
    customers: {
      count: statsData?.byCategory?.CUSTOMER ?? 0,
      subtitle: "Registered clients",
    },
    adminsAndStaff: {
      count: statsData?.byCategory?.STAFF ?? 0,
      subtitle: "Platform staff",
    },
  };

  const totalUsers = data?.totalCount ?? 0;
  const currentPage = filters.page || 1;
  const pageSize = filters.pageSize || 10;
  const totalPages = data?.totalPages || 1;
  const startRange = totalUsers === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, totalUsers);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Header */}
      <UsersHeader
        onSearchChange={(search) => handleFiltersChange({ search })}
      />

      <main className="px-6 space-y-6">
        {/* Actions Row */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {activeTab === "ADMINS" && (
            <Button
              onClick={() => setInviteModalOpen(true)}
              variant="outline"
              className="border-border hover:bg-muted text-foreground font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xs transition-colors gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Admin</span>
            </Button>
          )}

          <Button
            onClick={() => setExportModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-xs transition-colors gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Users</span>
          </Button>
        </div>

        {/* KPI Stats Cards */}
        <UsersStats stats={stats} isLoading={isLoading || isStatsLoading} />

        {/* Main Table Container Card */}
        <div className="bg-card rounded-2xl border border-border/70 shadow-soft p-5 space-y-4">
          {/* Category Tabs & Filter Controls */}
          <UsersFilterBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Users Table */}
          <UsersTable
            users={users}
            isLoading={isLoading}
            onViewUser={handleViewUser}
            onToggleStatus={handleToggleStatus}
          />

          {/* Pagination Footer */}
          <UsersPagination
            currentPage={currentPage}
            totalUsers={totalUsers}
            startRange={startRange}
            endRange={endRange}
            totalPages={totalPages}
            pageSize={pageSize}
            skip={data?.skip}
            take={data?.take}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>

        {/* User Detail Inspection Modal */}
        <UserDetailDialog
          user={selectedUser}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          onToggleStatus={handleToggleStatus}
        />

        {/* Export Users Modal */}
        <ExportUsersModal
          open={exportModalOpen}
          onOpenChange={setExportModalOpen}
          totalUsersCount={totalUsers}
          filteredUsersCount={users.length}
          onConfirmExport={handleConfirmExport}
        />

        {/* Invite Admin Modal */}
        <InviteAdminModal
          open={inviteModalOpen}
          onOpenChange={setInviteModalOpen}
          onSuccessInvite={handleSuccessInvite}
        />

        {/* Invite Success Modal */}
        <InviteSuccessModal
          open={successModalOpen}
          onOpenChange={setSuccessModalOpen}
          email={invitedEmail}
        />
      </main>
    </div>
  );
}
