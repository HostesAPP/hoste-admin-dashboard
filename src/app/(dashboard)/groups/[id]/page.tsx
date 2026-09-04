"use client";

import { useState } from "react";
import { GoBackLink, StatusBadge } from "@/components/shared";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  getCurrentGroup,
  GroupDetailsBio,
  GroupDetailsStat,
  GroupInformation,
  SuspendGroupDialog,
  type Group
} from "@/features/groups";
import { useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function GroupDetailPage() {
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const params = useParams();
  const groupId = params?.id;
  const currentGroup = getCurrentGroup(groupId as string);

  return (
    <div className="space-y-6">

      {/* page header */}
      <div className="p-6 border-b">

        {/* breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/groups">Groups</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentGroup?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* back to groups link*/}
        <span className="block mt-4">
          <GoBackLink href="/groups" text="Back to Groups" />
        </span>


        {/* header an actions */}
        <section className="flex items-center justify-between mt-6">

          {/* group name, id and status */}
          <div className="flex items-baseline gap-3">
            <h1 className="font-bold text-[28px]">{currentGroup?.name}</h1>

            {/* group id */}
            <span className="text-muted-foreground mr-8">{currentGroup?.id}</span>

            {/* group status badge */}
            <StatusBadge status={currentGroup?.status || ""} />
          </div>

          {/* actions */}
          <div className="space-x-2 flex items-center">

            {/* suspend group button */}
            <Button
              variant='destructive'
              onClick={() => setSuspendOpen(true)}
            >
              Suspend Group
            </Button>

            {/* menu button */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="border rounded-sm p-2 hover:bg-muted-foreground/15 transition-colors">
                  <EllipsisVertical size={22} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" sideOffset={15}>
                <DropdownMenuGroup>
                  {[
                    { text: "View Leader Profile", href: `/profiles/${currentGroup?.leaderProfileId}` },
                    { text: "View All Members", href: `/groups/${currentGroup?.id}/members` },
                    { text: "View Activity Logs", href: `/groups/${currentGroup?.id}/activity` },
                  ]
                    .map((item) => (
                      <DropdownMenuItem key={item.text} className="p-0 hover:bg-muted-foreground/15 transition-colors duration-200">
                        <Link href={item.href} className={cn('w-full px-3 py-1.5', item.text === "Suspend Group" && "text-destructive", item.text === "Restore Group" && "text-success")}>
                          {item.text}
                        </Link>
                      </DropdownMenuItem>
                    ))
                  }

                  {/* copy group id */}
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-muted-foreground/15 transition-colors px-3 py-1.5"
                    onClick={() => {
                      navigator.clipboard.writeText(currentGroup?.id || "");
                      alert("Group ID copied to clipboard");
                    }}
                  >
                    Copy Group ID
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:bg-destructive/15 px-3 py-1.5"
                    onClick={() => {
                      setSelectedGroup(selectedGroup);
                      setSuspendOpen(true);
                    }}
                  >
                    Suspend Group
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </section>

      </div>

      {/* Suspend Group Dialog */}
      {currentGroup && (
        <SuspendGroupDialog
          group={currentGroup}
          open={suspendOpen}
          onOpenChange={setSuspendOpen}
        />
      )}

      <main className="px-6 space-y-6">

        {/* group bio */}
        {currentGroup && <GroupDetailsBio group={currentGroup} />}

        {/* group stat */}
        <GroupDetailsStat group={currentGroup as Group} />
      </main>

      {/* group info and leader info */}
      {/* <GroupInformation group={currentGroup as Group} /> */}
    </div>
  );
}