// features/groups/components/groups/GroupsView.tsx

"use client";

import React, { useState } from "react";
import { GroupsPageHeader } from "./GroupsPageHeader";
import { GroupSearch } from "./GroupSearch";
import { GroupsFilter } from "./GroupsFilter";
import { GroupsStat } from "./GroupsStat";
import { GroupsTable } from "./GroupsTable";
import { useGroups, useGroupStats } from "../../hooks/groups.hooks";
import type { GroupFilterParams } from "../../types/groups.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOptionValue = "createdAt:desc" | "createdAt:asc" | "name:asc" | "name:desc";

const SORT_OPTIONS: { label: string; value: SortOptionValue }[] = [
  { label: "Newest First", value: "createdAt:desc" },
  { label: "Oldest First", value: "createdAt:asc" },
  { label: "Name (A-Z)", value: "name:asc" },
  { label: "Name (Z-A)", value: "name:desc" },
];

export function GroupsView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All Categories");
  const [memberCount, setMemberCount] = useState("Any");
  const [sortOption, setSortOption] = useState<SortOptionValue>("createdAt:desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [sortBy, sortOrder] = sortOption.split(":") as ["createdAt" | "name", "asc" | "desc"];

  const filterParams: GroupFilterParams = {
    search,
    status,
    category,
    memberCount,
    sortBy,
    sortOrder,
    page,
    pageSize,
  };

  const { data, isLoading, isError, refetch } = useGroups(filterParams);
  const { data: statsData, isLoading: isStatsLoading } = useGroupStats();

  const hasActiveFilters =
    search.trim() !== "" ||
    status !== "All" ||
    category !== "All Categories" ||
    memberCount !== "Any";

  const handleResetFilters = () => {
    setSearch("");
    setStatus("All");
    setCategory("All Categories");
    setMemberCount("Any");
    setSortOption("createdAt:desc");
    setPage(1);
  };

  const handleFilterChange = (filters: {
    status: string;
    category: string;
    memberCount: string;
  }) => {
    setStatus(filters.status);
    setCategory(filters.category);
    setMemberCount(filters.memberCount);
    setPage(1);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <GroupsPageHeader />

      {/* Main Container */}
      <main className="space-y-6 px-6 mx-auto">
        {/* Search and Filters Bar */}
        <section className="flex items-center gap-3 flex-nowrap">
          <div className="flex-1">
            <GroupSearch
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
            />
          </div>
          <GroupsFilter
            status={status}
            category={category}
            memberCount={memberCount}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
          <Select
            value={sortOption}
            onValueChange={(val) => {
              if (val) {
                setSortOption(val as SortOptionValue);
                setPage(1);
              }
            }}
          >
            <SelectTrigger className="w-40 py-5 cursor-pointer bg-card">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        {/* Overview Stats Cards */}
        <section>
          <GroupsStat statData={statsData} isLoading={isStatsLoading} />
        </section>

        {/* Groups Data Table */}
        <section>
          <GroupsTable
            groups={data?.groups}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            totalCount={data?.totalCount || 0}
            totalPages={data?.totalPages || 1}
            currentPage={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </section>
      </main>
    </div>
  );
}
