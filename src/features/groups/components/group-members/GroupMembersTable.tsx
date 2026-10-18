"use client";

import React from "react";
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
} from "lucide-react";
import type { GroupMember } from "../../types/groups.types";
import { StatusBadge } from "@/components/shared";
import { formatDate } from "@/lib/utils";

export type GroupMembersTableProps = {
  members: GroupMember[];
  selectedMemberIds: string[];
  onToggleSelectMember: (id: string) => void;
  onSelectAll: (all: boolean) => void;
  onOpenChangeRole?: (member: GroupMember) => void;
  onOpenRemoveMember?: (member: GroupMember) => void;
  onViewProfile?: (member: GroupMember) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (rows: number) => void;
  totalMembersCount: number;
  isLoading?: boolean;
};

export const GroupMembersTable: React.FC<GroupMembersTableProps> = ({
  members,
  selectedMemberIds,
  onToggleSelectMember,
  onSelectAll,
  onViewProfile,
  currentPage,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  totalMembersCount,
  isLoading = false,
}) => {
  const allCurrentPageSelected =
    members.length > 0 &&
    members.every((m) => selectedMemberIds.includes(m.id));
  const someCurrentPageSelected =
    members.some((m) => selectedMemberIds.includes(m.id)) &&
    !allCurrentPageSelected;

  const totalPages = Math.max(1, Math.ceil(totalMembersCount / rowsPerPage));
  const startRecord = (currentPage - 1) * rowsPerPage + 1;
  const endRecord = Math.min(currentPage * rowsPerPage, totalMembersCount);

  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
              {/* Checkbox Column */}
              <TableHead className="w-12 px-4 py-3.5">
                <Checkbox
                  checked={allCurrentPageSelected}
                  ref={(node) => {
                    if (node) {
                      node.indeterminate = someCurrentPageSelected;
                    }
                  }}
                  onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                  aria-label="Select all members on current page"
                />
              </TableHead>

              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
                Member
              </TableHead>

              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5">
                Email / User ID
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

              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3.5 text-right pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell className="px-4 py-3.5">
                    <div className="w-4 h-4 rounded bg-muted" />
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-muted" />
                      <div className="h-4 w-28 bg-muted rounded" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="h-3.5 w-32 bg-muted rounded" />
                      <div className="h-3 w-16 bg-muted rounded" />
                    </div>
                  </TableCell>
                  <TableCell><div className="h-4 w-16 bg-muted rounded" /></TableCell>
                  <TableCell><div className="h-5 w-14 bg-muted rounded-full" /></TableCell>
                  <TableCell><div className="h-3.5 w-20 bg-muted rounded" /></TableCell>
                  <TableCell><div className="h-3.5 w-16 bg-muted rounded" /></TableCell>
                  <TableCell className="text-right pr-6"><div className="h-8 w-8 bg-muted rounded ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-48 text-center text-muted-foreground text-sm"
                >
                  No members found in this group matching the filter criteria.
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
                    className={`transition-colors border-b border-border/70 ${
                      isSelected
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
                        <Avatar className="w-9 h-9 shrink-0 border border-border">
                          {member.avatarUrl && <AvatarImage src={member.avatarUrl} alt={member.name} />}
                          <AvatarFallback
                            style={{
                              backgroundColor: member.avatarColor
                                ? `${member.avatarColor}20`
                                : "color-mix(in srgb, var(--primary) 15%, transparent)",
                              color: member.avatarColor || "var(--primary)",
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
                        <span
                          className={`text-sm font-semibold ${
                            isSelected ? "text-primary" : "text-foreground"
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
                          {member.email || "No email"}
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
                      {member.dateJoined ? formatDate(member.dateJoined) : "—"}
                    </TableCell>

                    {/* Last Activity */}
                    <TableCell className="py-3.5 text-sm text-muted-foreground">
                      {member.lastActivity || "—"}
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
                            <span>View Details</span>
                          </DropdownMenuItem>

                          {member.profileId && (
                            <DropdownMenuItem className="cursor-pointer text-xs py-2 gap-2">
                              <Link href={`/profiles/${member.profileId}`}>
                                <User className="w-3.5 h-3.5 text-primary" />
                                <span>Go to Profile</span>
                              </Link>
                            </DropdownMenuItem>
                          )}
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border bg-card">
        {/* Rows Per Page Selector */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Show:</span>
          <div className="relative">
            <select
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              className="appearance-none bg-background border border-border rounded-md px-2.5 py-1 pr-7 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {[10, 20, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize} per page
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          <span>
            Showing {totalMembersCount > 0 ? startRecord : 0} to {endRecord} of{" "}
            {totalMembersCount} members
          </span>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Pagination className="w-auto mx-0">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }}
                  className={`h-8 px-2.5 text-xs rounded-md cursor-pointer ${
                    currentPage <= 1 ? "pointer-events-none opacity-40" : ""
                  }`}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(page);
                    }}
                    isActive={page === currentPage}
                    className={`h-8 w-8 text-xs rounded-md cursor-pointer ${
                      page === currentPage
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "hover:bg-muted"
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                  }}
                  className={`h-8 px-2.5 text-xs rounded-md cursor-pointer ${
                    currentPage >= totalPages ? "pointer-events-none opacity-40" : ""
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};
