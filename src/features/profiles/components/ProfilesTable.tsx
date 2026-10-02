"use client";

import { ProfileRowItem } from "./ProfileRowItem";
import { ProfilesPagination } from "./ProfilesPagination";
import { Users } from "lucide-react";
import type { Profile } from "../types/profiles.types";
import type { ActionType } from "./ProfileActionModal";

interface ProfilesTableProps {
  profiles: Profile[];
  totalResults: number;
  totalPages: number;
  currentPage: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onOpenActionModal: (type: ActionType, profile: Profile) => void;
}

export function ProfilesTable({
  profiles,
  totalResults,
  totalPages,
  currentPage,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
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

      {/* Profiles Rows with Stagger Animation */}
      {profiles.length > 0 ? (
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
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </div>
  );
}
