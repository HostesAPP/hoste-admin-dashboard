"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  MoreVertical,
  Crown,
  ChevronDown,
  User,
  Shield,
  UserMinus,
} from "lucide-react";
import type { GroupMember } from "@/features/groups";
import { StatusBadge } from "@/components/shared";

export type GroupMembersTableProps = {
  members: GroupMember[];
  selectedMemberIds: string[];
  onToggleSelectMember: (id: string) => void;
  onSelectAll: (all: boolean) => void;
  onOpenChangeRole: (member: GroupMember) => void;
  onOpenRemoveMember: (member: GroupMember) => void;
  onViewProfile?: (member: GroupMember) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (rows: number) => void;
  totalMembersCount: number;
};

export const GroupMembersTable: React.FC<GroupMembersTableProps> = ({
  members,
  selectedMemberIds,
  onToggleSelectMember,
  onSelectAll,
  onOpenChangeRole,
  onOpenRemoveMember,
  onViewProfile,
  currentPage,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  totalMembersCount,
}) => {
  const allCurrentPageSelected =
    members.length > 0 &&
    members.every((m) => selectedMemberIds.includes(m.id));

  const totalPages = Math.ceil(totalMembersCount / rowsPerPage) || 1;
  const startRange = (currentPage - 1) * rowsPerPage + 1;
  const endRange = Math.min(currentPage * rowsPerPage, totalMembersCount);

  return (
    <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border">
              <TableHead className="w-12 px-4 py-3.5">
                <Checkbox
                  checked={allCurrentPageSelected}
                  onCheckedChange={(checked) => onSelectAll(!!checked)}
                  aria-label="Select all members"
                />
              </TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
                Member
              </TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
                User ID & Email
              </TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
                Role
              </TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
                Status
              </TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
                Date Joined
              </TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
                Last Activity
              </TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider text-right pr-6 py-3.5">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-36 text-center text-muted-foreground text-sm"
                >
                  No members found matching your search or filters.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => {
                const isSelected = selectedMemberIds.includes(member.id);
                const isLeader =
                  member.role === "Group Leader" || member.isLeader;

                return (
                  <TableRow
                    key={member.id}
                    className={`transition-colors border-b border-border/70 ${isSelected
                      ? "bg-primary/10 hover:bg-primary/15"
                      : "hover:bg-muted/30"
                      }`}
                  >
                    {/* Checkbox */}
                    <TableCell className="px-4 py-3.5">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelectMember(member.id)}
                        aria-label={`Select ${member.name}`}
                      />
                    </TableCell>

                    {/* Member Name & Avatar */}
                    <TableCell className="py-3.5 font-medium">
                      <div className="flex items-center gap-3">
                        {isLeader && (
                          <span
                            title="Group Leader"
                            className="text-warning shrink-0"
                          >
                            <Crown className="w-3.5 h-3.5 fill-warning text-warning" />
                          </span>
                        )}
                        <Avatar className="w-9 h-9 shrink-0">
                          <AvatarFallback
                            style={{
                              backgroundColor: `${member.avatarColor || "#EF5A22"
                                }15`,
                              color: member.avatarColor || "#EF5A22",
                            }}
                            className="font-bold text-xs"
                          >
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={`text-sm font-semibold ${isSelected
                            ? "text-primary"
                            : "text-foreground"
                            }`}
                        >
                          {member.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* User ID & Email */}
                    <TableCell className="py-3.5">
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground/90 font-medium">
                          {member.email}
                        </span>
                        <span className="text-xs text-muted-foreground tracking-wide mt-0.5">
                          {member.userId}
                        </span>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell className="py-3.5">
                      {isLeader ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-xs">
                          Group Leader
                        </span>
                      ) : member.role === "Co-Leader" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/15 text-primary">
                          Co-Leader
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground font-medium">
                          Member
                        </span>
                      )}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-3.5">
                      <StatusBadge status={member.status} />
                    </TableCell>

                    {/* Date Joined */}
                    <TableCell className="py-3.5 text-sm text-muted-foreground">
                      {member.dateJoined}
                    </TableCell>

                    {/* Last Activity */}
                    <TableCell className="py-3.5 text-sm text-muted-foreground">
                      {member.lastActivity}
                    </TableCell>

                    {/* Actions Menu */}
                    <TableCell className="py-3.5 text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer">
                          <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-44 p-1 shadow-md"
                        >
                          <DropdownMenuItem
                            onClick={() => onViewProfile?.(member)}
                            className="cursor-pointer text-xs py-2 gap-2"
                          >
                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>View Profile</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onOpenChangeRole(member)}
                            className="cursor-pointer text-xs py-2 gap-2"
                          >
                            <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>Change Role</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onOpenRemoveMember(member)}
                            className="cursor-pointer text-xs py-2 gap-2 text-destructive focus:bg-destructive/10"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                            <span>Remove Member</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer & Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3.5 border-t border-border bg-card">
        {/* Showing entries & rows per page */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            Showing {totalMembersCount === 0 ? 0 : startRange}-{endRange} of{" "}
            {totalMembersCount} members
          </span>

          <div className="flex items-center gap-1.5">
            <span>Rows per page:</span>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-2 py-1 rounded border border-input bg-background text-foreground font-medium hover:bg-muted/50 transition-colors cursor-pointer">
                <span>{rowsPerPage}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-18">
                {[5, 10, 20, 50].map((num) => (
                  <DropdownMenuItem
                    key={num}
                    onClick={() => onRowsPerPageChange(num)}
                    className="cursor-pointer text-xs justify-center font-medium"
                  >
                    {num}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-1">
          <Pagination className="mx-0 w-auto">
            <PaginationContent className="gap-12">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }}
                  className={`${currentPage <= 1
                    ? "pointer-events-none opacity-40"
                    : "hover:bg-muted"
                    }`}
                />
              </PaginationItem>


              <PaginationItem className="space-x-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <PaginationLink
                      href="#"
                      key={pageNum}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(pageNum);
                      }}
                      className={`h-8 w-8 p-0 text-xs font-semibold rounded-md transition-all ${isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent"
                        : "border border-border hover:bg-muted text-foreground"
                        }`}
                      isActive={isActive}
                    >
                      {pageNum}
                    </PaginationLink>
                  );
                })}

              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      onPageChange(currentPage + 1);
                  }}
                  className={`${currentPage >= totalPages
                    ? "pointer-events-none opacity-40"
                    : "hover:bg-muted"
                    }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};
