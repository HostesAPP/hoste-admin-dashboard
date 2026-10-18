"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  GroupMember,
  GroupMembersHeader,
  GroupMembersFilter,
  GroupMembersTable,
  MemberProfileDialog,
} from "@/features/groups";
import {
  useGroup,
  useGroupMembers,
} from "@/features/groups/hooks/groups.hooks";

export default function GroupMembersPage() {
  const params = useParams();
  const groupId = (params?.id as string) || "";

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

  // Dialog State
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeMember, setActiveMember] = useState<GroupMember | null>(null);

  // Real TanStack Query Backend Integration
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

  const membersList = membersResponse?.members || [];
  const totalMembersCount = membersResponse?.totalCount || 0;

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

  const handleExport = () => {
    if (membersList.length === 0) return;
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(membersList, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `${currentGroup?.name || "group"}-members-${new Date().toISOString().split("T")[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Header */}
      <GroupMembersHeader
        group={currentGroup || undefined}
        onExport={handleExport}
      />

      {/* Filter and Search Bar */}
      <GroupMembersFilter
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        selectedRole={selectedRole}
        onRoleChange={(val) => {
          setSelectedRole(val);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(val) => {
          setSelectedStatus(val);
          setCurrentPage(1);
        }}
        selectedJoined={selectedJoined}
        onJoinedChange={(val) => {
          setSelectedJoined(val);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
      />

      {/* Real Data Members Table */}
      <GroupMembersTable
        members={membersList}
        selectedMemberIds={selectedMemberIds}
        onToggleSelectMember={handleToggleSelectMember}
        onSelectAll={handleSelectAll}
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
        isLoading={isMembersLoading}
      />

      {/* Member Profile Details Dialog */}
      <MemberProfileDialog
        member={activeMember}
        open={profileOpen}
        onOpenChange={setProfileOpen}
      />
    </div>
  );
}
