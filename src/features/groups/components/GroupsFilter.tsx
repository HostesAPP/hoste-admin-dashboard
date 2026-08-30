"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ListFilter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const STATUS_OPTIONS = ["All", "Active", "Pending", "Paused"] as const;

const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "All Categories" },
  { label: "Creative", value: "Creative" },
  { label: "Technology", value: "Technology" },
  { label: "Business", value: "Business" },
  { label: "Events", value: "Events" },
]

const MEMBER_COUNT_OPTIONS = ["Any", "1-20", "21-50", "51-100", "100+"] as const;

export const GroupsFilter = () => {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedMemberCount, setSelectedMemberCount] = useState<string>("Any");

  const handleReset = () => {
    setSelectedStatus("All");
    setSelectedCategory("All Categories");
    setSelectedMemberCount("Any");
  };

  const handleApply = () => {
    // Apply filters logic
    setOpen(false);
    console.log(selectedCategory, selectedMemberCount, selectedStatus)
  };

  const hasActiveFilters =
    selectedStatus !== "All" ||
    selectedCategory !== "All Categories" ||
    selectedMemberCount !== "Any";

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button variant="outline" className="cursor-pointer gap-2 p-4 py-5">
              <ListFilter className="size-4" />
              <span>Filter</span>
              {hasActiveFilters && (
                <span className="size-2 rounded-full bg-primary" />
              )}
            </Button>
          }
        />

        <PopoverContent align="end" sideOffset={10} className="w-80 p-4 space-y-1">
          {/* Status Filter */}
          <div>
            <label className="font-bold">
              Status
            </label>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {STATUS_OPTIONS.map((status) => {
                const isSelected = selectedStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1.5 text-xs rounded-sm transition-colors cursor-pointer ${isSelected
                      ? "bg-dark text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter */}
          <form className="space-y-2">
            <label className="font-bold">
              Category
            </label>
            <Select items={CATEGORY_OPTIONS}>
              <SelectTrigger className="w-full mt-1.5 cursor-pointer py-5">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {CATEGORY_OPTIONS.map((item) => (
                    <SelectItem
                      className={'cursor-pointer'}
                      key={item.value}
                      value={item.value}
                      onClick={() => setSelectedCategory(item.value)}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </form>


          {/* Member Count Filter */}
          <div className="space-y-2">
            <label className="font-bold">
              Member Count
            </label>
            <div className="flex flex-wrap gap-0.5 mt-1.5">
              {MEMBER_COUNT_OPTIONS.map((count) => {
                const isSelected = selectedMemberCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setSelectedMemberCount(count)}
                    className={`px-2.5 py-1.5 text-xs rounded-sm transition-colors cursor-pointer ${isSelected
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      }`}
                  >
                    {count}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleReset}
              disabled={!hasActiveFilters}
              className="flex-1"
            >
              Clear All
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={handleApply}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};