"use client";

import Link from "next/link";
import {
  ArrowRight,
  Ellipsis,
  AlertCircle,
  FolderSearch,
  RotateCcw,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn, formatDate } from "@/lib/utils";
import type { Group } from "../../types/groups.types";

interface GroupsTableProps {
  groups?: Group[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
}

export const GroupsTable = ({
  groups = [],
  isLoading = false,
  isError = false,
  onRetry,
  totalCount = 0,
  totalPages = 1,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onResetFilters,
  hasActiveFilters = false,
}: GroupsTableProps) => {
  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <section className="p-4 border border-border/80 bg-card rounded-xl shadow-xs space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              {["Group", "Leader", "Members", "Bookings", "Category", "Created", "Status", "Actions"].map((item) => (
                <TableHead className="font-bold text-xs text-muted-foreground" key={item}>
                  {item}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i} className="animate-pulse">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-3 w-16 bg-muted rounded" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted" />
                    <div className="h-3.5 w-24 bg-muted rounded" />
                  </div>
                </TableCell>
                <TableCell><div className="h-4 w-8 bg-muted rounded" /></TableCell>
                <TableCell><div className="h-4 w-8 bg-muted rounded" /></TableCell>
                <TableCell><div className="h-4 w-20 bg-muted rounded" /></TableCell>
                <TableCell><div className="h-3.5 w-20 bg-muted rounded" /></TableCell>
                <TableCell><div className="h-6 w-16 bg-muted rounded-full" /></TableCell>
                <TableCell><div className="h-9 w-28 bg-muted rounded-lg" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <section className="p-10 border border-destructive/20 bg-destructive/5 rounded-xl text-center flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-foreground">Failed to load groups</h3>
        <p className="text-xs text-muted-foreground max-w-sm">
          An error occurred while communicating with the server. Please try refreshing or check your connection.
        </p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="gap-2 mt-2 rounded-lg cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </Button>
        )}
      </section>
    );
  }

  // 3. Empty State
  if (groups.length === 0) {
    return (
      <section className="p-12 border border-border/80 bg-card rounded-xl text-center flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center">
          <FolderSearch className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-foreground">No groups found</h3>
        <p className="text-xs text-muted-foreground max-w-sm">
          {hasActiveFilters
            ? "No groups match your current search criteria or active filters."
            : "There are currently no groups recorded on the platform."}
        </p>
        {hasActiveFilters && onResetFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="gap-2 mt-2 rounded-lg cursor-pointer text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </Button>
        )}
      </section>
    );
  }

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  return (
    <section className="p-4 border border-border/80 bg-card rounded-xl shadow-xs space-y-4">
      {/* groups table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {["Group", "Leader", "Members", "Bookings", "Category", "Created", "Status", "Actions"].map((item) => (
                <TableHead className="font-bold text-xs text-muted-foreground" key={item}>
                  {item}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => {
              const groupLeaderName =
                group.leader?.displayName ||
                group.leader?.name ||
                (group.leaderProfileId ? `Leader (${group.leaderProfileId.slice(0, 8)}...)` : null) ||
                "Unassigned";

              const leaderAvatarUrl = group.leader?.avatarUrl;

              const totalMembers =
                group.memberCount ??
                group.membersCount ??
                (Array.isArray(group.members) ? group.members.length : "—");

              const engagements =
                group.bookingCount ??
                group.bookingsCount ??
                group.engagementsCount ??
                "—";

              const normalizedStatus =
                group.status?.toUpperCase() === "ACTIVE"
                  ? "Active"
                  : group.status?.toUpperCase() === "PAUSED"
                  ? "Paused"
                  : group.status?.toUpperCase() === "INACTIVE"
                  ? "Inactive"
                  : group.status || "Active";

              const leaderInitials = groupLeaderName !== "Unassigned"
                ? groupLeaderName
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "GL";

              return (
                <TableRow key={group.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      {/* group icon / logo */}
                      <div
                        style={{
                          backgroundColor: group?.color ? `${group.color}15` : "color-mix(in srgb, var(--primary) 15%, transparent)",
                        }}
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      >
                        <div
                          style={{
                            backgroundColor: group?.color || "var(--primary)",
                          }}
                          className="w-5 h-5 rounded-full"
                        />
                      </div>
                      {/* group name & id */}
                      <div className="flex flex-col">
                        <Link
                          href={`/groups/${group.id}`}
                          className="font-bold text-sm text-foreground hover:text-primary transition-colors"
                        >
                          {group.name}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {group.id}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* group leader */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8 border border-border">
                        {leaderAvatarUrl && <AvatarImage src={leaderAvatarUrl} alt={groupLeaderName} />}
                        <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                          {leaderInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-foreground">
                          {groupLeaderName}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {group.leaderProfileId ? "Group Leader" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* total members */}
                  <TableCell className="text-xs font-semibold text-foreground">
                    {totalMembers}
                  </TableCell>

                  {/* total engagements / bookings */}
                  <TableCell className="text-xs font-semibold text-foreground">
                    {engagements}
                  </TableCell>

                  {/* category */}
                  <TableCell>
                    <span className="text-xs font-medium text-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/50">
                      {group.category || "General"}
                    </span>
                  </TableCell>

                  {/* created at */}
                  <TableCell className="text-xs text-muted-foreground">
                    {group.createdAt ? formatDate(group.createdAt) : "—"}
                  </TableCell>

                  {/* status badge */}
                  <TableCell>
                    <StatusBadge status={normalizedStatus} />
                  </TableCell>

                  {/* view details / actions (View-Only for V1) */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* view details button */}
                      <Link
                        href={`/groups/${group.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold h-8 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-2xs"
                      >
                        View Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>

                      {/* more option dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger className="w-8 h-8 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer inline-flex items-center justify-center">
                          <Ellipsis className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-44 rounded-xl border-border" align="end" sideOffset={6}>
                          <DropdownMenuGroup>
                            {[
                              { text: "View Details", href: `/groups/${group.id}` },
                              ...(group.leaderProfileId
                                ? [{ text: "View Leader Profile", href: `/profiles/${group.leaderProfileId}` }]
                                : []),
                              { text: "View Members", href: `/groups/${group.id}/members` },
                            ].map((item) => (
                              <DropdownMenuItem key={item.text} className="p-0 text-xs">
                                <Link href={item.href} className="w-full px-3 py-2 text-foreground">
                                  {item.text}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-border/60">
          <span className="text-xs text-muted-foreground font-medium">
            Showing {startRecord} - {endRecord} of {totalCount} groups
          </span>

          <Pagination className="justify-end w-auto mx-0">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange?.(currentPage - 1);
                  }}
                  className={cn(
                    "h-8 px-2.5 text-xs rounded-lg cursor-pointer",
                    currentPage <= 1 && "pointer-events-none opacity-40"
                  )}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange?.(pageNum);
                    }}
                    isActive={pageNum === currentPage}
                    className={cn(
                      "h-8 w-8 text-xs rounded-lg cursor-pointer",
                      pageNum === currentPage
                        ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                        : "hover:bg-muted"
                    )}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange?.(currentPage + 1);
                  }}
                  className={cn(
                    "h-8 px-2.5 text-xs rounded-lg cursor-pointer",
                    currentPage >= totalPages && "pointer-events-none opacity-40"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </section>
  );
};