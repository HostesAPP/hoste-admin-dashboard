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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGroupMembers } from "../../hooks/groups.hooks";
import type { Group, GroupMember } from "../../types/groups.types";
import { formatDate } from "@/lib/utils";

export const GroupDetailsMembers = ({ group }: { group: Group }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const { data, isLoading } = useGroupMembers(group.id, {
    search: searchQuery,
    page: 1,
    pageSize: 10,
  });

  const members = data?.members || [];
  const totalCount = data?.totalCount ?? (group.memberCount || 0);

  // Filter local members by role if needed
  const filteredMembers = members.filter((m) => {
    if (selectedRole !== "All Roles" && m.role !== selectedRole) {
      return false;
    }
    return true;
  });

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
              {["All Roles", "Group Leader", "Co-Leader", "Member"].map(
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
                  <TableCell>
                    <div className="h-4 w-16 bg-muted rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-3.5 w-20 bg-muted rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-14 bg-muted rounded-full" />
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="h-4 w-16 bg-muted rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  <p className="text-xs font-medium">No members found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.slice(0, 10).map((member) => {
                const initials = member.name
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "M";

                return (
                  <TableRow
                    key={member.id}
                    className="hover:bg-muted/30 transition-colors border-b border-border/70"
                  >
                    {/* Name & Avatar */}
                    <TableCell className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 border border-border">
                          {member.avatarUrl && (
                            <AvatarImage
                              src={member.avatarUrl}
                              alt={member.name}
                            />
                          )}
                          <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          {member.profileId ? (
                            <Link
                              href={`/profiles/${member.profileId}`}
                              className="font-semibold text-xs text-foreground hover:text-primary transition-colors hover:underline"
                            >
                              {member.name}
                            </Link>
                          ) : (
                            <span className="font-semibold text-xs text-foreground">
                              {member.name}
                            </span>
                          )}
                          <span className="text-[11px] text-muted-foreground truncate max-w-48">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <span className="text-xs font-medium text-foreground">
                        {member.role || "Member"}
                      </span>
                    </TableCell>

                    {/* Joined */}
                    <TableCell className="text-xs text-muted-foreground">
                      {member.dateJoined ? formatDate(member.dateJoined) : "—"}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={member.status} />
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right pr-6">
                      {member.profileId ? (
                        <Link
                          href={`/profiles/${member.profileId}`}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          View Profile
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="p-4 bg-muted/20 border-t border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          Showing {filteredMembers.length} of {totalCount} total members
        </span>
        <Link
          href={`/groups/${group.id}/members`}
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
        >
          <span>View All Members ({totalCount})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
};
