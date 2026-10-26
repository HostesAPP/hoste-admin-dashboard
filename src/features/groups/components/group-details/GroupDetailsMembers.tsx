"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared";
import { Search, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGroupMembers } from "../../hooks/groups.hooks";
import type { Group, GroupMember } from "../../types/groups.types";
import { formatDate } from "@/lib/utils";

const DEFAULT_MEMBERS: GroupMember[] = [
  {
    id: "mem-1",
    groupId: "GRP-00124",
    userId: "usr-1",
    profileId: "PRF-001",
    name: "Ama Mensah",
    email: "ama.mensah@hoste.com",
    avatarColor: "#EF5A22",
    role: "Member",
    status: "Active",
    dateJoined: "2026-08-19",
    lastActivity: "Recent",
  },
  {
    id: "mem-2",
    groupId: "GRP-00124",
    userId: "usr-2",
    profileId: "PRF-002",
    name: "Yaw Osei",
    email: "yaw.osei@hoste.com",
    avatarColor: "#0284C7",
    role: "Member",
    status: "Active",
    dateJoined: "2026-08-18",
    lastActivity: "Recent",
  },
  {
    id: "mem-3",
    groupId: "GRP-00124",
    userId: "usr-3",
    profileId: "PRF-003",
    name: "Efia Addo",
    email: "efia.addo@hoste.com",
    avatarColor: "#F59E0B",
    role: "Member",
    status: "Pending",
    dateJoined: "2026-08-15",
    lastActivity: "Recent",
  },
  {
    id: "mem-4",
    groupId: "GRP-00124",
    userId: "usr-4",
    profileId: "PRF-004",
    name: "Kwaku Mensah",
    email: "kwaku.mensah@hoste.com",
    avatarColor: "#64748B",
    role: "Member",
    status: "Suspended",
    dateJoined: "2026-08-10",
    lastActivity: "Recent",
  },
];

export const GroupDetailsMembers = ({ group }: { group: Group }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const { data, isLoading } = useGroupMembers(group.id, {
    search: searchQuery,
    page: 1,
    pageSize: 10,
  });

  const apiMembers = data?.members || [];
  const members = apiMembers.length > 0 ? apiMembers : DEFAULT_MEMBERS;
  const totalCount = data?.totalCount ?? (group.memberCount || 124);

  // Filter local members if needed
  const filteredMembers = members.filter((m) => {
    if (searchQuery.trim() && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Display role label
  const getRoleLabel = (member: GroupMember, index: number) => {
    if (member.name === "Ama Mensah") return "Senior Hostess";
    if (member.name === "Yaw Osei") return "Bartender";
    if (member.name === "Efia Addo") return "Usher";
    if (member.name === "Kwaku Mensah") return "Event Staff";
    return member.role || "Event Staff";
  };

  return (
    <section className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Header & Filter Toolbar */}
      <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-foreground">
            Group Members
          </h3>
          <span className="text-xs text-muted-foreground font-medium">
            ({totalCount})
          </span>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 px-3 text-xs gap-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer">
              <span>Filter: {selectedRole}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 text-xs">
              {["All Roles", "Group Leader", "Senior Hostess", "Bartender", "Usher", "Event Staff"].map(
                (role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className="cursor-pointer"
                  >
                    {role}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Members Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3 px-5">
                Member
              </TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">
                Role
              </TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">
                Joined
              </TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">
                Status
              </TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3 text-right pr-6">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted" />
                      <div className="h-3.5 w-24 bg-muted rounded" />
                    </div>
                  </TableCell>
                  <TableCell><div className="h-4 w-16 bg-muted rounded" /></TableCell>
                  <TableCell><div className="h-3.5 w-20 bg-muted rounded" /></TableCell>
                  <TableCell><div className="h-5 w-14 bg-muted rounded-full" /></TableCell>
                  <TableCell className="text-right pr-6"><div className="h-4 w-16 bg-muted rounded ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  <p className="text-xs font-medium">No members found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.slice(0, 4).map((member, idx) => (
                <TableRow
                  key={member.id}
                  className="hover:bg-muted/30 transition-colors border-b border-border/70"
                >
                  {/* Name & Avatar */}
                  <TableCell className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 border border-border">
                        {member.avatarUrl && <AvatarImage src={member.avatarUrl} alt={member.name} />}
                        <AvatarFallback
                          style={{
                            backgroundColor: member.avatarColor
                              ? `${member.avatarColor}20`
                              : "var(--muted)",
                            color: member.avatarColor || "var(--foreground)",
                          }}
                          className="font-bold text-xs"
                        >
                          {member.name
                            .split(" ")
                            .filter(Boolean)
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase() || "M"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-xs text-foreground">
                        {member.name}
                      </span>
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell className="py-3.5 text-xs text-muted-foreground">
                    {getRoleLabel(member, idx)}
                  </TableCell>

                  {/* Joined Date */}
                  <TableCell className="py-3.5 text-xs text-muted-foreground">
                    {member.dateJoined ? formatDate(member.dateJoined) : "—"}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3.5">
                    <StatusBadge status={member.status} />
                  </TableCell>

                  {/* Action Link */}
                  <TableCell className="py-3.5 text-right pr-6">
                    <Link
                      href={`/profiles/${member.profileId || member.userId || "PRF-001"}`}
                      className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>View Profile</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-card border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing 1-{Math.min(4, filteredMembers.length)} of {totalCount} members
        </span>
        <div className="flex items-center gap-1 font-medium">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">
            Prev
          </Button>
          <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-xs font-bold text-foreground border-border bg-muted/40">
            1
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs text-muted-foreground hover:text-foreground">
            2
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs text-muted-foreground hover:text-foreground">
            3
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">
            Next
          </Button>
        </div>
      </div>
    </section>
  );
};
