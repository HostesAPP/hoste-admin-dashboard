"use client";

import { ProfileRowItem } from "./ProfileRowItem";
import { ProfilesPagination } from "./ProfilesPagination";
import { Users } from "lucide-react";
import type { Profile, ProfileTab } from "../types/profiles.types";
import type { ActionType } from "./ProfileActionModal";

interface ProfilesTableProps {
  profiles: Profile[];
  totalResults: number;
  totalPages: number;
  currentPage: number;
  rowsPerPage: number;
  skip?: number;
  take?: number;
  status?: ProfileTab;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onSkipChange?: (skip: number) => void;
  onTakeChange?: (take: number) => void;
  onOpenActionModal: (type: ActionType, profile: Profile) => void;
}

export function ProfilesTable({
  profiles,
  totalResults,
  totalPages,
  currentPage,
  rowsPerPage,
  skip,
  take,
  status,
  isLoading,
  onPageChange,
  onRowsPerPageChange,
  onSkipChange,
  onTakeChange,
  onOpenActionModal,
}: ProfilesTableProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-soft p-6 transition-all">
      {/* Column Headers */}
      <div className="flex justify-between gap-4 pb-3 px-3 border-b border-border/60 text-xs font-semibold text-muted-foreground select-none">
        <div className="min-w-70 pl-6">Hosté</div>
        <div className="w-28">Type</div>
        <div className="w-40">Location</div>
        <div className="w-32">Joined</div>
        <div className="w-28">ID</div>
        <div className="w-36 text-right pr-2"></div>
      </div>

      {/* Profiles Rows with Loading Skeleton or Empty State */}
      {isLoading ? (
        <div className="divide-y divide-border/30">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 py-4 px-3 animate-pulse"
            >
              <div className="min-w-70 pl-6 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-40 bg-muted/60 rounded" />
                </div>
              </div>
              <div className="w-28">
                <div className="h-3.5 w-16 bg-muted rounded" />
              </div>
              <div className="w-40">
                <div className="h-3.5 w-24 bg-muted rounded" />
              </div>
              <div className="w-32">
                <div className="h-3.5 w-20 bg-muted rounded" />
              </div>
              <div className="w-28">
                <div className="h-3.5 w-16 bg-muted rounded" />
              </div>
              <div className="w-36 flex justify-end gap-2 pr-2">
                <div className="h-8 w-20 bg-muted rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : profiles.length > 0 ? (
        <div className="stagger-fade-in divide-y divide-border/30 items-start">
          {profiles.map((profile) => (
            <ProfileRowItem
              key={profile.id}
              profile={profile}
              onOpenActionModal={onOpenActionModal}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-3 border border-border/50">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            No profiles found
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            No profile entries match the current status filter or search criteria.
          </p>
        </div>
      )}

      {/* Table Pagination Footer */}
      <ProfilesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalResults}
        rowsPerPage={rowsPerPage}
        skip={skip}
        take={take}
        status={status}
        isLoading={isLoading}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onSkipChange={onSkipChange}
        onTakeChange={onTakeChange}
      />
    </div>
  );
}
