"use client";

import Link from "next/link";
import { MoreVertical, ExternalLink, ShieldAlert, CheckCircle, Mail } from "lucide-react";
import type { User } from "../types/users.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/shared";

interface UsersTableProps {
  users: User[];
  isLoading?: boolean;
  onViewUser: (user: User) => void;
  onToggleStatus?: (user: User) => void;
}

export function UsersTable({
  users,
  isLoading,
  onViewUser,
  onToggleStatus,
}: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="w-full py-16 flex items-center justify-center text-muted-foreground text-xs">
        Loading users...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="w-full py-16 text-center text-muted-foreground text-xs">
        No users match your filters. Try clearing filters or changing search terms.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/60 hover:bg-transparent">
            <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider py-3.5 pl-4">
              USER
            </TableHead>
            <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider py-3.5">
              USER ID
            </TableHead>
            <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider py-3.5">
              TYPE / ROLE
            </TableHead>
            <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider py-3.5">
              EMAIL
            </TableHead>
            <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider py-3.5">
              DATE JOINED
            </TableHead>
            <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider py-3.5">
              LAST ACTIVE
            </TableHead>
            <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider py-3.5">
              STATUS
            </TableHead>
            <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider py-3.5 pr-4 text-right">
              ACTION
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="stagger-fade-in divide-y divide-border/40">
          {users.map((user) => {
            const isActive = user.status === "Active";

            return (
              <TableRow
                key={user.id}
                className="hover:bg-muted/30 transition-colors border-border/40"
              >
                {/* User Avatar + Name */}
                <TableCell className="py-3.5 pl-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 bg-muted border border-border/80">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="bg-dark text-dark-foreground text-xs font-semibold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <Link
                      href={`/users/${user.userCode}`}
                      className="text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      {user.name}
                    </Link>
                  </div>
                </TableCell>

                {/* User ID */}
                <TableCell className="py-3.5 text-xs text-muted-foreground font-mono">
                  {user.userCode}
                </TableCell>

                {/* Type / Role */}
                <TableCell className="py-3.5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">
                      {user.type}
                    </span>
                    {user.roleSubtitle && (
                      <span className="text-[11px] text-muted-foreground">
                        {user.roleSubtitle}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Email */}
                <TableCell className="py-3.5 text-xs text-muted-foreground">
                  {user.email}
                </TableCell>

                {/* Date Joined */}
                <TableCell className="py-3.5 text-xs text-muted-foreground">
                  {user.dateJoined}
                </TableCell>

                {/* Last Active */}
                <TableCell className="py-3.5 text-xs text-muted-foreground">
                  {user.lastActive}
                </TableCell>

                {/* Status Badge */}
                <TableCell className="py-3.5">
                  <StatusBadge status={user.status} />
                </TableCell>

                {/* Actions */}
                <TableCell className="py-3.5 pr-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/users/${user.userCode}`}
                      className="h-7 text-xs font-semibold px-2.5 border border-border hover:bg-muted text-foreground rounded-md inline-flex items-center justify-center transition-colors"
                    >
                      View User
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-7 h-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                        <MoreVertical className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-xs w-44">
                        <DropdownMenuItem className="gap-2 p-0">
                          <Link href={`/users/${user.userCode}`} className="flex items-center gap-2 w-full px-2 py-1.5">
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>View Details</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            window.location.href = `mailto:${user.email}`;
                          }}
                          className="gap-2"
                        >
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>Send Email</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onToggleStatus?.(user)}
                          className={cn(
                            "gap-2",
                            isActive ? "text-destructive" : "text-success"
                          )}
                        >
                          {isActive ? (
                            <>
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>Suspend User</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Activate User</span>
                            </>
                          )}
                        </DropdownMenuItem>
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
  );
}
