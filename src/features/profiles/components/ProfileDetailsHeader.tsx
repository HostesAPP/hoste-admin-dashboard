"use client";

import Link from "next/link";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileDetailsHeaderProps {
  displayName: string;
  onCopyId?: () => void;
  onOpenReport?: () => void;
}

export function ProfileDetailsHeader({
  displayName,
  onCopyId,
  onOpenReport,
}: ProfileDetailsHeaderProps) {
  return (
    <div className="space-y-4">
      {/* shadcn Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList className="text-xs text-muted-foreground font-medium">
          <BreadcrumbItem>
            <BreadcrumbLink href="/profiles">Profiles</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/profiles">All Profiles</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground">
              {displayName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Title & Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Profile Details
        </h1>

        <div className="flex items-center gap-2.5">
          <Link href="/profiles">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs font-semibold rounded-lg border-border/80 text-foreground hover:bg-muted transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Profiles</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 px-3 text-xs font-semibold rounded-lg border border-border/80 text-foreground hover:bg-muted transition-colors inline-flex items-center gap-1.5 cursor-pointer">
              <span>More actions</span>
              <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <DropdownMenuItem
                onClick={onCopyId}
                className="text-xs cursor-pointer"
              >
                Copy Profile Link
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onOpenReport}
                className="text-xs cursor-pointer text-muted-foreground"
              >
                Export Audit Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
