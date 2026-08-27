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

import { GROUPS, GROUP_MEMBERS } from "@/features/groups";
import { PROFILES } from "@/features/profiles";
import { cn, formatDate } from "@/lib/utils";
import { ArrowRight, Ellipsis } from "lucide-react";
import Link from "next/link";

export const GroupsTable: React.FC = () => {

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
            const groupLeader = PROFILES?.find((profile) => profile.userId === group.leaderProfileId);
            const totalMembers = GROUP_MEMBERS?.filter((member) => member.groupId === group.id).length;

            return (
              <TableRow key={group?.id}>
                <TableCell className="py-5 flex items-center gap-3">
                  <div className="bg-primary/15 w-10 h-10 rounded-sm flex items-center justify-center">
                    <div className="bg-primary w-6 h-6 rounded-full" />
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
                      <AvatarFallback>{groupLeader?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {groupLeader?.displayName}
                  </div>
                </TableCell>
                <TableCell>{totalMembers}</TableCell>
                <TableCell>25</TableCell>
                <TableCell>{group?.category}</TableCell>
                <TableCell><span className="text-muted-foreground">{formatDate(group?.createdAt)}</span></TableCell>
                <TableCell>
                  <span className={cn("py-1 px-3 rounded-full", group.status === "Active" && "bg-success/15 text-success", group.status === "Inactive" && "bg-destructive/15 text-destructive", group.status === "Paused" && "bg-warning/15 text-warning")}>
                    {group?.status}
                  </span>
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
                      <DropdownMenuTrigger render={<button className="text-muted-foreground"><Ellipsis size={22} /></button>} />
                      <DropdownMenuContent className="w-40">
                        <DropdownMenuGroup>
                          {[
                            { text: "View Group", href: `/groups/${group?.id}` },
                            { text: "View Leader", href: `/profiles/${group?.leaderProfileId}` },
                            { text: "View Members", href: `/groups/${group?.id}/members` },
                            { text: "Suspend Group", href: `` },
                            { text: "Restore Group", href: `` }]
                            .map((item) => (
                              <DropdownMenuItem key={item.text} className="p-0 hover:bg-muted-foreground/15 transition-colors duration-200">
                                <Link href={item.href} className={cn('w-full px-3 py-1.5', item.text === "Suspend Group" && "text-destructive", item.text === "Restore Group" && "text-success")}>
                                  {item.text}
                                </Link>
                              </DropdownMenuItem>
                            ))
                          }
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