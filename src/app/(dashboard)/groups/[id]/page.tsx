"use client";

import { useState } from "react";
import { GoBackLink, StatusBadge } from "@/components/shared";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  getCurrentGroup,
  GroupDetailsBio,
  GroupDetailsStat,
  GroupInformation,
  GroupLeaderCard,
  GroupDetailsMembers,
  GroupPerformanceCard,
  GroupActivityCard,
  RecentGroupBookings,
  GroupManagementControls,
  SuspendGroupDialog,
  type Group,
} from "@/features/groups";
import { useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function GroupDetailPage() {
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const params = useParams();
  const rawGroupId = params?.id as string;
  const groupId = rawGroupId || "GRP-001";

  const currentGroup: Group = getCurrentGroup(groupId) || {
    id: groupId,
    name: "Accra Social Club",
    description:
      "A professional event hospitality team providing trained staff for corporate events, private functions and nightlife experiences.",
    leaderProfileId: "10000000-0000-4000-8000-000000000001",
    category: "Event Hospitality",
    status: "Active" as const,
    createdAt: "2026-08-10T09:30:00.000Z",
    updatedAt: "2026-08-20T14:15:00.000Z",
    color: "#EF5A22",
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="p-6 border-b border-border bg-card">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList className="text-xs text-muted-foreground">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="hover:text-foreground">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/groups" className="hover:text-foreground">
                Groups
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                {currentGroup.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back to Groups Link */}
        <span className="block mt-4">
          <GoBackLink href="/groups" text="Back to Groups" />
        </span>

        {/* Title and Top Actions */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          {/* Group Name, ID and Status */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="font-bold text-2xl sm:text-3xl text-foreground">
              {currentGroup.name}
            </h1>
            <span className="text-sm font-medium text-muted-foreground mr-2">
              {currentGroup.id}
            </span>
            <StatusBadge status={currentGroup.status || "Active"} />
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2.5">
            {/* Suspend Group Outline Button */}
            <Button
              variant="outline"
              onClick={() => {
                setSelectedGroup(currentGroup);
                setSuspendOpen(true);
              }}
              className="border-destructive/30 text-destructive hover:bg-destructive/10 text-xs sm:text-sm font-semibold h-9 px-4 cursor-pointer"
            >
              Suspend Group
            </Button>

            {/* Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="border border-border rounded-lg p-2 text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors cursor-pointer inline-flex items-center">
                <EllipsisVertical size={18} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52" align="end" sideOffset={8}>
                <DropdownMenuGroup>
                  {[
                    {
                      text: "View Leader Profile",
                      href: `/profiles/${currentGroup.leaderProfileId}`,
                    },
                    {
                      text: "View All Members",
                      href: `/groups/${currentGroup.id}/members`,
                    },
                    {
                      text: "View Activity Log",
                      href: `/groups/${currentGroup.id}/activity`,
                    },
                  ].map((item) => (
                    <DropdownMenuItem
                      key={item.text}
                      className="p-0 hover:bg-muted/60 transition-colors text-xs"
                    >
                      <Link href={item.href} className="w-full px-3 py-2 text-foreground">
                        {item.text}
                      </Link>
                    </DropdownMenuItem>
                  ))}

                  {/* Copy Group ID */}
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-muted/60 text-xs px-3 py-2"
                    onClick={() => {
                      navigator.clipboard.writeText(currentGroup.id);
                      alert("Group ID copied to clipboard");
                    }}
                  >
                    Copy Group ID
                  </DropdownMenuItem>

                  {/* Suspend Group item */}
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:bg-destructive/10 text-xs px-3 py-2"
                    onClick={() => {
                      setSelectedGroup(currentGroup);
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
      <SuspendGroupDialog
        group={selectedGroup || currentGroup}
        open={suspendOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedGroup(null);
          setSuspendOpen(open);
        }}
      />

      {/* Main Content Area */}
      <main className="px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
        {/* 1. Group Bio & Hero Card */}
        <GroupDetailsBio group={currentGroup} />

        {/* 2. Group Stat Cards (4 metrics) */}
        <GroupDetailsStat group={currentGroup} />

        {/* 3. Group Information & Group Leader (2-Columns) */}
        <div className="grid grid-cols-3 gap-6">
          <GroupInformation group={currentGroup} />
          <GroupLeaderCard group={currentGroup} />
        </div>

        {/* 4. Group Members Table */}
        <GroupDetailsMembers group={currentGroup} />

        {/* 5. Group Performance & Group Activity (2-Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GroupPerformanceCard group={currentGroup} />
          <GroupActivityCard group={currentGroup} />
        </div>

        {/* 6. Recent Group Bookings */}
        <RecentGroupBookings group={currentGroup} />

        {/* 7. Group Management & Controls (Danger Zone) */}
        <GroupManagementControls
          group={currentGroup}
          onOpenSuspend={() => {
            setSelectedGroup(currentGroup);
            setSuspendOpen(true);
          }}
        />
      </main>


      {/* group info and leader info */}
      <GroupInformation group={currentGroup as Group} />
    </div>
  );
}
