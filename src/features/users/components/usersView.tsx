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
import { useUsers, useUpdateUserStatus } from "../hooks/useUsers";
import type { User, UserFilterParams, UserTab } from "../types/users.types";
import { Button } from "@/components/ui/button";
import { Download, UserPlus } from "lucide-react";

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
    pageSize: 6,
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [invitedEmail, setInvitedEmail] = useState("admin@email.com");

  // React Query hook
  const { data, isLoading } = useUsers(filters);
  const updateStatusMutation = useUpdateUserStatus();

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
      pageSize: 6,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleToggleStatus = (user: User) => {
    const nextStatus = user.status === "Active" ? "Suspended" : "Active";
    updateStatusMutation.mutate({ userId: user.id, newStatus: nextStatus });
    if (selectedUser?.id === user.id) {
      setSelectedUser({ ...user, status: nextStatus, accountStatus: nextStatus });
    }
  };

  const handleConfirmExport = (scope: "all" | "filtered", format: "csv" | "xlsx" | "pdf" | "json") => {
    const targetUsers = scope === "all" ? data?.users || [] : users;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["User ID,Name,Type,Role,Email,Date Joined,Last Active,Status"]
        .concat(
          targetUsers.map(
            (u) =>
              `"${u.userCode}","${u.name}","${u.type}","${u.roleSubtitle || ""}","${u.email}","${u.dateJoined}","${u.lastActive}","${u.status}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users_export.${format === "xlsx" ? "xlsx" : format === "pdf" ? "pdf" : format === "json" ? "json" : "csv"}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSuccessInvite = (email: string) => {
    setInvitedEmail(email);
    setSuccessModalOpen(true);
  };

  const users = data?.users || [];
  const stats = data?.stats || {
    totalUsers: { count: 12482, growthPercent: 8.4, growthPeriod: "this month" },
    hostes: { count: 4286, subtitle: "Active event pros" },
    customers: { count: 8182, subtitle: "Registered clients" },
    adminsAndStaff: { count: 14, subtitle: "Platform admins" },
  };

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
        <UsersStats stats={stats} />

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
            currentPage={filters.page || 1}
            totalUsers={data?.totalCount || 12482}
            startRange={1}
            endRange={users.length}
            totalPages={data?.totalPages || 1249}
            onPageChange={handlePageChange}
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
          totalUsersCount={data?.totalCount || 12482}
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
