"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  GroupMember,
  GroupMemberRole,
  GroupMemberStatus,
  GroupMembersHeader,
  GroupMembersFilter,
  GroupMembersTable,
  AddMemberDialog,
  TransferLeaderDialog,
  ChangeRoleDialog,
  RemoveMemberDialog,
  MemberProfileDialog,
} from "@/features/groups";
import {
  useGroup,
  useGroupMembers,
  useAddGroupMember,
  useChangeGroupMemberRole,
  useRemoveGroupMember,
  useTransferGroupLeader,
} from "@/features/groups/hooks/groups.hooks";
import { PageHeaderLayout } from "@/components/shared";

export default function GroupMembersPage() {
  const params = useParams();
  const rawGroupId = params?.id as string;
  const groupId = rawGroupId || "GRP-001";

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedJoined, setSelectedJoined] = useState("Any Date");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Selected row state
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  // Modals & Dialogs States
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [transferLeaderOpen, setTransferLeaderOpen] = useState(false);
  const [changeRoleOpen, setChangeRoleOpen] = useState(false);
  const [removeMemberOpen, setRemoveMemberOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeMember, setActiveMember] = useState<GroupMember | null>(null);

  // TanStack Query
  const { data: currentGroup } = useGroup(groupId);
  const { data: membersResponse, isLoading: isMembersLoading } = useGroupMembers(
    groupId,
    {
      search: searchQuery,
      role: selectedRole,
      status: selectedStatus,
      joined: selectedJoined,
      page: currentPage,
      pageSize: rowsPerPage,
    }
  );

  const addMemberMutation = useAddGroupMember();
  const changeRoleMutation = useChangeGroupMemberRole();
  const removeMemberMutation = useRemoveGroupMember();
  const transferLeaderMutation = useTransferGroupLeader();

  const membersList = membersResponse?.members || [];
  const totalMembersCount = membersResponse?.totalCount || 0;

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedRole !== "All" ||
    selectedStatus !== "All" ||
    selectedJoined !== "Any Date";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedRole("All");
    setSelectedStatus("All");
    setSelectedJoined("Any Date");
    setCurrentPage(1);
  };

  // Selection handlers
  const handleToggleSelectMember = (id: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (all: boolean) => {
    if (all) {
      const pageIds = membersList.map((m) => m.id);
      setSelectedMemberIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = new Set(membersList.map((m) => m.id));
      setSelectedMemberIds((prev) => prev.filter((id) => !pageIds.has(id)));
    }
  };

  const isLeaderSelected = selectedMemberIds.some((id) => {
    const member = membersList.find((m) => m.id === id);
    return member?.role === "Group Leader" || member?.isLeader;
  });

  // Actions
  const handleAddMember = (data: {
    name: string;
    email: string;
    role: GroupMemberRole;
    status: GroupMemberStatus;
  }) => {
    addMemberMutation.mutate({
      groupId,
      data,
    });
  };

  const handleTransferLeader = (newLeaderMemberId: string) => {
    transferLeaderMutation.mutate({
      groupId,
      newLeaderMemberId,
    });
  };

  const handleChangeRole = (memberId: string, newRole: GroupMemberRole) => {
    changeRoleMutation.mutate({
      groupId,
      memberId,
      newRole,
    });
  };

  const handleRemoveMember = (memberId: string) => {
    removeMemberMutation.mutate({
      groupId,
      memberId,
    });
    setSelectedMemberIds((prev) => prev.filter((id) => id !== memberId));
  };

  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(membersList, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `group-members-${groupId}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const fallbackGroup = currentGroup || {
    id: groupId,
    name: "Group Members",
    description: "View and manage members of this group.",
    leaderProfileId: "10000000-0000-4000-8000-000000000001",
    category: "General",
    status: "Active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    color: "#EF5A22",
  };

  return (
    <>
      {/* Top Nav */}
      <PageHeaderLayout
        title="Group Members"
        description={`View and manage members of ${fallbackGroup.name}`}
      />

      <div className="px-6 space-y-6 pb-12">
        {/* Page Header */}
        <GroupMembersHeader
          group={fallbackGroup}
          onOpenAddMember={() => setAddMemberOpen(true)}
          onOpenTransferLeader={() => setTransferLeaderOpen(true)}
          onExport={handleExport}
        />

        {/* Filter and Search Bar */}
        <GroupMembersFilter
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          selectedRole={selectedRole}
          onRoleChange={(r) => {
            setSelectedRole(r);
            setCurrentPage(1);
          }}
          selectedStatus={selectedStatus}
          onStatusChange={(s) => {
            setSelectedStatus(s);
            setCurrentPage(1);
          }}
          selectedJoined={selectedJoined}
          onJoinedChange={(j) => {
            setSelectedJoined(j);
            setCurrentPage(1);
          }}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          selectedCount={selectedMemberIds.length}
          isLeaderSelected={isLeaderSelected}
          onClearSelection={() => setSelectedMemberIds([])}
        />

        {/* Members Table */}
        <GroupMembersTable
          members={membersList}
          isLoading={isMembersLoading}
          selectedMemberIds={selectedMemberIds}
          onToggleSelectMember={handleToggleSelectMember}
          onSelectAll={handleSelectAll}
          onOpenChangeRole={(member) => {
            setActiveMember(member);
            setChangeRoleOpen(true);
          }}
          onOpenRemoveMember={(member) => {
            setActiveMember(member);
            setRemoveMemberOpen(true);
          }}
          onViewProfile={(member) => {
            setActiveMember(member);
            setProfileOpen(true);
          }}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(rows) => {
            setRowsPerPage(rows);
            setCurrentPage(1);
          }}
          totalMembersCount={totalMembersCount}
        />

        {/* Add Member Dialog */}
        <AddMemberDialog
          group={fallbackGroup}
          open={addMemberOpen}
          onOpenChange={setAddMemberOpen}
          onAddMember={handleAddMember}
        />

        {/* Transfer Leader Dialog */}
        <TransferLeaderDialog
          group={fallbackGroup}
          members={membersList}
          open={transferLeaderOpen}
          onOpenChange={setTransferLeaderOpen}
          onTransferLeader={handleTransferLeader}
        />

        {/* Change Role Dialog */}
        <ChangeRoleDialog
          member={activeMember}
          leaderName={
            membersList.find((m) => m.role === "Group Leader" || m.isLeader)?.name ||
            "Group Leader"
          }
          open={changeRoleOpen}
          onOpenChange={setChangeRoleOpen}
          onChangeRole={handleChangeRole}
        />

        {/* Remove Member Dialog */}
        <RemoveMemberDialog
          member={activeMember}
          leaderName={
            membersList.find((m) => m.role === "Group Leader" || m.isLeader)?.name
          }
          open={removeMemberOpen}
          onOpenChange={setRemoveMemberOpen}
          onRemoveMember={handleRemoveMember}
        />

        {/* Member Profile Dialog */}
        <MemberProfileDialog
          member={activeMember}
          open={profileOpen}
          onOpenChange={setProfileOpen}
          onOpenChangeRole={(member) => {
            setActiveMember(member);
            setChangeRoleOpen(true);
          }}
        />
      </div>
    </>
  );
}
