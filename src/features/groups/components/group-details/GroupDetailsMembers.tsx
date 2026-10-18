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
import { Search, ArrowRight, Users } from "lucide-react";
import { useGroupMembers } from "../../hooks/groups.hooks";
import type { Group } from "../../types/groups.types";
import { formatDate } from "@/lib/utils";

export const GroupDetailsMembers = ({ group }: { group: Group }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useGroupMembers(group.id, {
    search: searchQuery,
    page: 1,
    pageSize: 5,
  });

  const members = data?.members || [];
  const totalCount = data?.totalCount ?? members.length;

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

        {/* Search */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground"
            />
          </div>
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
                Status
              </TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">
                Date Joined
              </TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3 text-right pr-6">
                Profile
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted" />
                      <div className="space-y-1">
                        <div className="h-3.5 w-24 bg-muted rounded" />
                        <div className="h-3 w-32 bg-muted rounded" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><div className="h-4 w-16 bg-muted rounded" /></TableCell>
                  <TableCell><div className="h-5 w-14 bg-muted rounded-full" /></TableCell>
                  <TableCell><div className="h-3.5 w-20 bg-muted rounded" /></TableCell>
                  <TableCell className="text-right pr-6"><div className="h-4 w-12 bg-muted rounded ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <Users className="w-5 h-5 text-muted-foreground/60" />
                    <p className="text-xs font-medium">No members found in this group</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
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
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-foreground">
                          {member.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {member.email || "No email"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell className="py-3.5 text-xs font-medium text-foreground">
                    <span
                      className={
                        member.role === "Group Leader"
                          ? "text-primary font-bold"
                          : "text-foreground"
                      }
                    >
                      {member.role}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3.5">
                    <StatusBadge status={member.status} />
                  </TableCell>

                  {/* Date Joined */}
                  <TableCell className="py-3.5 text-xs text-muted-foreground">
                    {member.dateJoined ? formatDate(member.dateJoined) : "—"}
                  </TableCell>

                  {/* Action Link */}
                  <TableCell className="py-3.5 text-right pr-6">
                    {member.profileId ? (
                      <Link
                        href={`/profiles/${member.profileId}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Profile
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer link to full members page */}
      <div className="p-3.5 bg-muted/20 border-t border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          Showing up to 5 members
        </span>
        <Link
          href={`/groups/${group.id}/members`}
          className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
        >
          <span>View All Members ({totalCount})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
};
