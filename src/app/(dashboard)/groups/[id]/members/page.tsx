"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  getCurrentGroup,
  getGroupMembers,
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
import { PageHeaderLayout } from "@/components/shared";

export default function GroupMembersPage() {
  const params = useParams();
  const rawGroupId = params?.id as string;
  const groupId = rawGroupId || "GRP-001";

  const currentGroup = getCurrentGroup(groupId) || {
    id: groupId,
    name: "Lagos Creatives",
    description: "A community of creative professionals and visual artists in Lagos.",
    leaderProfileId: "10000000-0000-4000-8000-000000000001",
    category: "Creative",
    status: "Active" as const,
    createdAt: "2026-08-10T09:30:00.000Z",
    updatedAt: "2026-08-20T14:15:00.000Z",
    color: "#F97316",
  };

  // Initial group members list from mock data
  const initialMembers = useMemo(() => {
    const mems = getGroupMembers(groupId);
    return mems && mems.length > 0 ? mems : getGroupMembers("GRP-001");
  }, [groupId]);

  const [membersList, setMembersList] = useState<GroupMember[]>(initialMembers);

  // Selected row state - default to Ama Mensah (mem-002) as shown in Figma mockup
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([""]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedJoined, setSelectedJoined] = useState("Any Date");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals & Dialogs States
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [transferLeaderOpen, setTransferLeaderOpen] = useState(false);
  const [changeRoleOpen, setChangeRoleOpen] = useState(false);
  const [removeMemberOpen, setRemoveMemberOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeMember, setActiveMember] = useState<GroupMember | null>(null);

  // Filter & Search Logic
  const filteredMembers = useMemo(() => {
    return membersList.filter((member) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = member.name.toLowerCase().includes(q);
        const matchesEmail = member.email.toLowerCase().includes(q);
        const matchesUserId = member.userId.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesUserId) return false;
      }

      // Role Filter
      if (selectedRole !== "All") {
        if (member.role !== selectedRole) return false;
      }

      // Status Filter
      if (selectedStatus !== "All") {
        if (member.status !== selectedStatus) return false;
      }

      return true;
    });
  }, [membersList, searchQuery, selectedRole, selectedStatus]);

  // Paginated records
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredMembers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredMembers, currentPage, rowsPerPage]);

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
      const pageIds = paginatedMembers.map((m) => m.id);
      setSelectedMemberIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = new Set(paginatedMembers.map((m) => m.id));
      setSelectedMemberIds((prev) => prev.filter((id) => !pageIds.has(id)));
    }
  };

  const isLeaderSelected = useMemo(() => {
    return selectedMemberIds.some((id) => {
      const member = membersList.find((m) => m.id === id);
      return member?.role === "Group Leader" || member?.isLeader;
    });
  }, [selectedMemberIds, membersList]);

  // Actions
  const handleAddMember = (data: {
    name: string;
    email: string;
    role: GroupMemberRole;
    status: GroupMemberStatus;
  }) => {
    const newMember: GroupMember = {
      id: `mem-${Date.now()}`,
      groupId,
      userId: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      dateJoined: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      lastActivity: "Just now",
      avatarColor: ["#EF5A22", "#0284C7", "#10B981", "#8B5CF6", "#F59E0B"][
        Math.floor(Math.random() * 5)
      ],
      isLeader: data.role === "Group Leader",
    };
    setMembersList((prev) => [newMember, ...prev]);
  };

  const handleTransferLeader = (newLeaderMemberId: string) => {
    setMembersList((prev) =>
      prev.map((m) => {
        if (m.id === newLeaderMemberId) {
          return { ...m, role: "Group Leader" as const, isLeader: true };
        }
        if (m.role === "Group Leader" || m.isLeader) {
          return { ...m, role: "Member" as const, isLeader: false };
        }
        return m;
      })
    );
  };

  const handleChangeRole = (memberId: string, newRole: GroupMemberRole) => {
    setMembersList((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            role: newRole,
            isLeader: newRole === "Group Leader",
          };
        }
        if (newRole === "Group Leader" && (m.role === "Group Leader" || m.isLeader)) {
          return { ...m, role: "Member" as const, isLeader: false };
        }
        return m;
      })
    );
  };

  const handleRemoveMember = (memberId: string) => {
    setMembersList((prev) => prev.filter((m) => m.id !== memberId));
    setSelectedMemberIds((prev) => prev.filter((id) => id !== memberId));
  };

  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(filteredMembers, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `group-members-${currentGroup.id}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <>
      {/* top-nav */}
      <PageHeaderLayout title="Group Members" description="View and manage members of this group" />

      <div className="px-6 space-y-6 mx-auto">

        {/* Page Header */}
        <GroupMembersHeader
          group={currentGroup}
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
          members={paginatedMembers}
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
          totalMembersCount={filteredMembers.length}
        />

        {/* Add Member Dialog */}
        <AddMemberDialog
          group={currentGroup}
          open={addMemberOpen}
          onOpenChange={setAddMemberOpen}
          onAddMember={handleAddMember}
        />

        {/* Transfer Leader Dialog */}
        <TransferLeaderDialog
          group={currentGroup}
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
            "Kofi Asante"
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
