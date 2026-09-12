"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared";
import { Search, ChevronDown, ArrowRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getGroupMembers, type Group, type GroupMember } from "@/features/groups";

export const GroupDetailsMembers = ({ group }: { group: Group }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");

  const allMembers: GroupMember[] = useMemo(() => {
    if (!group.id) return [];
    const members = getGroupMembers(group.id);
    return members && members.length > 0 ? members : getGroupMembers("GRP-001") || [];
  }, [group.id]);

  const filteredMembers = useMemo(() => {
    return allMembers.filter((m) => {
      if (searchQuery.trim() && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedRole !== "All Roles" && m.role !== selectedRole) {
        return false;
      }
      return true;
    });
  }, [allMembers, searchQuery, selectedRole]);

  // Display top 4 members on preview table
  const previewMembers = filteredMembers.slice(0, 4);

  return (
    <section className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Header & Filter Toolbar */}
      <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-foreground">
            Group Members
          </h3>
          <span className="text-xs text-muted-foreground font-medium">
            ({allMembers.length})
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Box */}
          <div className="relative min-w-45">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              className="w-full bg-background border border-input rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Role Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 bg-background border border-input px-3 py-1.5 rounded-lg text-xs text-foreground hover:bg-muted/50 transition-colors cursor-pointer">
              <span className="text-muted-foreground">Filter:</span>
              <span className="font-medium">{selectedRole}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {["All Roles", "Group Leader", "Member", "Senior Hostess", "Bartender", "Usher", "Event Staff"].map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className="cursor-pointer text-xs"
                >
                  {role}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
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
            {previewMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                  No group members found.
                </TableCell>
              </TableRow>
            ) : (
              previewMembers.map((member) => (
                <TableRow key={member.id} className="hover:bg-muted/30 border-b border-border/70">
                  <TableCell className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback
                          style={{
                            backgroundColor: member.avatarColor ? `${member.avatarColor}20` : "color-mix(in srgb, var(--primary) 15%, transparent)",
                            color: member.avatarColor || "var(--primary)",
                          }}
                          className="text-xs font-bold"
                        >
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-sm text-foreground">
                        {member.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 text-xs text-muted-foreground font-medium">
                    {member.role}
                  </TableCell>

                  <TableCell className="py-3 text-xs text-muted-foreground">
                    {member.dateJoined || (member as unknown as { joined?: string }).joined || "Aug 18, 2026"}
                  </TableCell>

                  <TableCell className="py-3">
                    <StatusBadge status={member.status} />
                  </TableCell>

                  <TableCell className="py-3 text-right pr-6">
                    <Link
                      href={`/groups/${group?.id || "GRP-001"}/members`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
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

      {/* Footer */}
      <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {previewMembers.length > 0 ? 1 : 0}-{previewMembers.length} of {allMembers.length} members
        </span>
        <div className="flex items-center gap-3">
          <Link
            href={`/groups/${group?.id || "GRP-001"}/members`}
            className="font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All Members</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
