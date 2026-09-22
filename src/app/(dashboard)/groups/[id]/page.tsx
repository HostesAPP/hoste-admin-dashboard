"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { EllipsisVertical, AlertCircle, RotateCcw } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
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
  GroupDetailsSkeleton,
} from "@/features/groups";
import { useGroup } from "@/features/groups/hooks/groups.hooks";

export default function GroupDetailPage() {
  const [suspendOpen, setSuspendOpen] = useState(false);
  const params = useParams();
  const rawGroupId = params?.id as string;
  const groupId = rawGroupId || "GRP-001";

  const { data: currentGroup, isLoading, isError, refetch } = useGroup(groupId);

  if (isLoading) {
    return <GroupDetailsSkeleton />;
  }

  if (isError || !currentGroup) {
    return (
      <div className="p-10 text-center space-y-4 pt-20">
        <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Group not found</h2>
        <p className="text-xs text-muted-foreground">
          The group with ID &quot;{groupId}&quot; could not be loaded or does not exist.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/groups"
            className="inline-flex items-center justify-center text-xs h-8 px-3 rounded-lg border border-border bg-background hover:bg-muted font-medium transition-colors"
          >
            Back to Groups
          </Link>
          <Button size="sm" onClick={() => refetch()} className="gap-2 rounded-lg cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
              onClick={() => setSuspendOpen(true)}
              className="border-destructive/30 text-destructive hover:bg-destructive/10 text-xs sm:text-sm font-semibold h-9 px-4 cursor-pointer"
            >
              Suspend Group
            </Button>

            {/* Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="border border-border rounded-lg p-2 text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors cursor-pointer inline-flex items-center justify-center">
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
                      <Link
                        href={item.href}
                        className="w-full px-3 py-2 text-foreground"
                      >
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
                    onClick={() => setSuspendOpen(true)}
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
        group={currentGroup}
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
      />

      {/* Main Content Area */}
      <main className="px-6 space-y-6">
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
        <div className="grid grid-cols-2 gap-6">
          <GroupPerformanceCard group={currentGroup} />
          <GroupActivityCard group={currentGroup} />
        </div>

        {/* 6. Recent Group Bookings */}
        <RecentGroupBookings group={currentGroup} />

        {/* 7. Group Management & Controls (Danger Zone) */}
        <GroupManagementControls
          group={currentGroup}
          onOpenSuspend={() => setSuspendOpen(true)}
        />
      </main>
    </div>
  );
}