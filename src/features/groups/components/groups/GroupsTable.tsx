"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { GROUPS, getGroupEngagements, getGroupMembers, getGroupLeader, Group, SuspendGroupDialog } from "@/features/groups";
import { cn, formatDate } from "@/lib/utils";
import { ArrowRight, Ellipsis } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useState } from "react";

export const GroupsTable: React.FC = () => {


  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [suspendOpen, setSuspendOpen] = useState(false);


  return (
    <section className="p-4 border border-border rounded-lg">

      {/* groups table */}
      <Table>
        <TableHeader>
          <TableRow>
            {["Group", "Leader", "Members", "Bookings", "Category", "Created", "Status", "Actions"].map((item) => (
              <TableHead className="font-bold text-muted-foreground" key={item}>{item}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>

          {GROUPS?.map((group) => {
            const groupLeader = getGroupLeader(group.leaderProfileId);
            const totalMembers = getGroupMembers(group.id).length;
            const engagements = getGroupEngagements(group.id).length

            return (
              <TableRow key={group?.id}>
                <TableCell className="py-5 flex items-center gap-3">

                  {/* group icon / logo */}
                  <div
                    style={{
                      backgroundColor: `${group?.color}15`
                    }}
                    className="w-10 h-10 rounded-sm flex items-center justify-center">
                    <div
                      style={{
                        backgroundColor: group?.color
                      }}
                      className="w-6 h-6 rounded-full" />
                  </div>
                  {/* group name & id */}
                  <div className="">
                    <h1 className="font-bold">{group?.name}</h1>
                    <span className="text-xs text-muted-foreground tracking-wider">{group?.id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={''}
                        alt={groupLeader?.displayName}
                      />
                      <AvatarFallback>{groupLeader?.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {groupLeader?.displayName}
                  </div>
                </TableCell>
                <TableCell>{totalMembers}</TableCell>
                <TableCell>{engagements}</TableCell>
                <TableCell>{group?.category}</TableCell>
                <TableCell><span className="text-muted-foreground">{formatDate(group?.createdAt)}</span></TableCell>
                <TableCell>

                  {/* status badge */}
                  <StatusBadge status={group?.status} />

                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* view details button */}
                    <Button className={'text-sm rounded-sm py-5'}>
                      <Link href={`/groups/${group?.id}`}>
                        <span className="inline-flex items-center gap-1">View Details <ArrowRight size={16} /></span>
                      </Link>
                    </Button>

                    {/* more option button */}
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <button className="rounded-sm p-2 text-muted-foreground hover:bg-muted-foreground/15 transition-colors">
                          <Ellipsis size={22} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-40" sideOffset={15}>
                        <DropdownMenuGroup>
                          {[
                            { text: "View Group", href: `/groups/${group?.id}` },
                            { text: "View Leader", href: `/profiles/${group?.leaderProfileId}` },
                            { text: "View Members", href: `/groups/${group?.id}/members` },
                          ]
                            .map((item) => (
                              <DropdownMenuItem key={item.text} className="p-0 hover:bg-muted-foreground/15 transition-colors duration-200">
                                <Link href={item.href} className={cn('w-full px-3 py-1.5', item.text === "Suspend Group" && "text-destructive", item.text === "Restore Group" && "text-success")}>
                                  {item.text}
                                </Link>
                              </DropdownMenuItem>
                            ))
                          }
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:bg-destructive/15 px-3 py-1.5"
                            onClick={() => {
                              setSelectedGroup(group);
                              setSuspendOpen(true);
                            }}
                          >
                            Suspend Group
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-success focus:bg-success/15 px-3 py-1.5"
                          >
                            Restore Group
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}

        </TableBody>
      </Table>

      {/* Suspend Group Dialog */}
      {selectedGroup && (
        <SuspendGroupDialog
          group={selectedGroup}
          open={suspendOpen}
          onOpenChange={setSuspendOpen}
        />
      )}

      {/* pagination */}

      <section className="flex justify-between items-center mt-18 border-t pt-4">
        <span className="text-muted-foreground font-medium text-sm w-full">Showing 1 - 10 of {GROUPS.length} groups</span>

        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

      </section>
    </section>
  );
};