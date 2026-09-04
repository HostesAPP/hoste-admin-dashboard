"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRightLeft, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Group } from "@/features/groups";

export type GroupMembersHeaderProps = {
  group?: Group;
  onOpenAddMember: () => void;
  onOpenTransferLeader: () => void;
  onExport: () => void;
};

export const GroupMembersHeader: React.FC<GroupMembersHeaderProps> = ({
  group,
  onOpenAddMember,
  onOpenTransferLeader,
  onExport,
}) => {
  const groupName = group?.name || "Group Details";
  const groupId = group?.id || "";

  return (
    <div className="space-y-4">
      {/* Back Link */}
      <div>
        <Link
          href={groupId ? `/groups/${groupId}` : "/groups"}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Group Details</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList className="text-xs text-muted-foreground">
            <BreadcrumbItem>
              <BreadcrumbLink href="/groups" className="hover:text-foreground">
                Groups
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={groupId ? `/groups/${groupId}` : "/groups"}
                className="hover:text-foreground"
              >
                {groupName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Group Members
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title & Action Buttons */}
        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            className="bg-card hover:bg-muted text-foreground border-border text-xs sm:text-sm font-medium h-9 px-3.5 gap-2 shadow-xs"
            onClick={onOpenTransferLeader}
          >
            <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
            <span>Transfer Leader</span>
          </Button>

          <Button
            variant="outline"
            className="bg-card hover:bg-muted text-foreground border-border text-xs sm:text-sm font-medium h-9 px-3.5 gap-2 shadow-xs"
            onClick={onExport}
          >
            <Download className="w-4 h-4 text-muted-foreground" />
            <span>Export</span>
          </Button>

          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-medium h-9 px-4 gap-1.5 shadow-xs"
            onClick={onOpenAddMember}
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
