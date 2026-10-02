// features/groups/components/groups/GroupsView.tsx

"use client";

import React, { useState } from "react";
import { GroupsPageHeader } from "./GroupsPageHeader";
import { GroupSearch } from "./GroupSearch";
import { GroupsFilter } from "./GroupsFilter";
import { GroupsStat } from "./GroupsStat";
import { GroupsTable } from "./GroupsTable";
import { useGroups } from "../../hooks/groups.hooks";
import type { GroupFilterParams } from "../../types/groups.types";

export function GroupsView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All Categories");
  const [memberCount, setMemberCount] = useState("Any");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filterParams: GroupFilterParams = {
    search,
    status,
    category,
    memberCount,
    page,
    pageSize,
  };

  const { data, isLoading, isError, refetch } = useGroups(filterParams);

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
        </section>

        {/* Overview Stats Cards */}
        <section>
          <GroupsStat statData={data?.stats} isLoading={isLoading} />
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
