"use client";

import { useState } from "react";
import { UsersHeader } from "./usersHeader";
import { UserBreadcrumbBar } from "./userBreadcrumbBar";
import { UserProfileCard } from "./userProfileCard";
import { UserInformationCard } from "./userInformationCard";
import { UserPermissionsCard } from "./userPermissionsCard";
import { UserSecurityCard } from "./userSecurityCard";
import { UserAdminActivityCard } from "./userAdminActivityCard";
import { UserRecentActivityCard } from "./userRecentActivityCard";
import { UserAccountActionsCard } from "./userAccountActionsCard";
import { SuspendUserModal } from "./suspendUserModal";
import { ChangeRoleModal } from "./changeRoleModal";
import { ExportUsersModal } from "./exportUsersModal";
import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserDetailsSkeleton } from "./userDetailsSkeleton";
import { useUserDetail, useUpdateUserStatus, useChangeUserRole } from "../hooks/useUsers";
import type { User, UserType } from "../types/users.types";

interface UserDetailsViewProps {
  userId: string;
}

export function UserDetailsView({ userId }: UserDetailsViewProps) {
  const { data: user, isLoading, isError, refetch } = useUserDetail(userId);
  const updateStatusMutation = useUpdateUserStatus();
  const changeRoleMutation = useChangeUserRole();

  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [changeRoleModalOpen, setChangeRoleModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const handleConfirmExport = (
    _scope: "all" | "filtered",
    format: "csv" | "xlsx" | "pdf" | "json"
  ) => {
    if (!user) return;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["User ID,Name,Full Name,Role,Email,Phone,Date Joined,Last Active,Status"].join("\n") +
      `\n"${user.userCode}","${user.name}","${user.fullName || user.name}","${user.roleSubtitle || user.type}","${user.email}","${user.phoneNumber || ""}","${user.dateJoined}","${user.lastActive}","${user.status}"`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `hoste-user-${user.userCode}-details.${format === "xlsx" ? "xlsx" : format === "pdf" ? "pdf" : format === "json" ? "json" : "csv"}`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmSuspend = (targetUser: User) => {
    const nextStatus = targetUser.status === "Active" ? "Suspended" : "Active";
    updateStatusMutation.mutate({ userId: targetUser.id, newStatus: nextStatus });
  };

  const handleConfirmChangeRole = (
    targetUser: User,
    newRole: UserType,
    newRoleSubtitle?: string
  ) => {
    changeRoleMutation.mutate({
      userId: targetUser.id,
      newRole,
      newRoleSubtitle,
    });
  };

  if (isLoading) {
    return <UserDetailsSkeleton />;
  }

  if (isError || !user) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <UsersHeader />
        <div className="p-10 text-center space-y-4 pt-20">
          <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">User not found</h2>
          <p className="text-xs text-muted-foreground">
            The user with ID &quot;{userId}&quot; could not be loaded or does not exist.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/users"
              className="inline-flex items-center justify-center text-xs h-8 px-3 rounded-lg border border-border bg-background hover:bg-muted font-medium transition-colors"
            >
              Back to Users
            </Link>
            <Button size="sm" onClick={() => refetch()} className="gap-2 rounded-lg cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const roleTitle = user.type === "Admin" ? "Admin Details" : "User Details";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Main Navigation Header */}
      <UsersHeader />


      <main className="px-6 space-y-6">
        {/* Breadcrumb Navigation & Top Action Bar */}
        <UserBreadcrumbBar
          userCode={user.userCode}
          roleTitle={roleTitle}
          onExport={() => setExportModalOpen(true)}
        />
        {/* User Main Profile Header Card */}
        <UserProfileCard
          user={user}
          onOpenSuspend={() => setSuspendModalOpen(true)}
          onOpenChangeRole={() => setChangeRoleModalOpen(true)}
        />

        {/* Middle Grid of 4 Structured Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <UserInformationCard user={user} />
          <UserPermissionsCard user={user} />
          <UserSecurityCard user={user} />
          <UserAdminActivityCard user={user} />
        </div>

        {/* Bottom Grid: Recent Activity & Account Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
          <div className="lg:col-span-8">
            <UserRecentActivityCard user={user} />
          </div>
          <div className="lg:col-span-4">
            <UserAccountActionsCard
              user={user}
              onOpenSuspend={() => setSuspendModalOpen(true)}
              onOpenDeactivate={() => setSuspendModalOpen(true)}
              onOpenChangeRole={() => setChangeRoleModalOpen(true)}
            />
          </div>
        </div>

        {/* Suspend Confirmation Modal */}
        <SuspendUserModal
          user={user}
          open={suspendModalOpen}
          onOpenChange={setSuspendModalOpen}
          onConfirm={handleConfirmSuspend}
        />

        {/* Change Role Modal */}
        <ChangeRoleModal
          user={user}
          open={changeRoleModalOpen}
          onOpenChange={setChangeRoleModalOpen}
          onConfirm={handleConfirmChangeRole}
        />

        {/* Export Users Modal */}
        <ExportUsersModal
          open={exportModalOpen}
          onOpenChange={setExportModalOpen}
          totalUsersCount={1}
          filteredUsersCount={1}
          onConfirmExport={handleConfirmExport}
        />
      </main>
    </div>
  );
}
