import {
  Controller,
  type Control,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ACTIVITY_RANGES,
  referralActivitySchema,
  type ReferralActivityFilters,
} from "../schemas/referral.activity.schema";

const FILTERS = [
  {
    name: "status" as const,
    label: "Status",
    options: referralActivitySchema.shape.status.options.map((value) => ({
      value,
      label: value === "ALL" ? "All" : value,
    })),
  },
  {
    name: "type" as const,
    label: "Type",
    options: referralActivitySchema.shape.type.options.map((value) => ({
      value,
      label: value === "ALL" ? "All" : value,
    })),
  },
  {
    name: "reward" as const,
    label: "Reward",
    options: [
      { value: "ALL", label: "All" },
      { value: "EARNED", label: "Earned" },
      { value: "NONE", label: "Not earned" },
    ],
  },
];

export function ReferralActivityFiltersBar({
  control,
  register,
  setValue,
  filters,
  selectedCount,
  onClear,
}: {
  control: Control<ReferralActivityFilters>;
  register: UseFormRegister<ReferralActivityFilters>;
  setValue: UseFormSetValue<ReferralActivityFilters>;
  filters: ReferralActivityFilters;
  selectedCount: number;
  onClear: () => void;
}) {
  const chips = [
    ...(filters.range !== "ALL"
      ? [
          {
            name: "range" as const,
            label: ACTIVITY_RANGES.find((item) => item.value === filters.range)
              ?.label,
          },
        ]
      : []),
    ...FILTERS.filter((item) => filters[item.name] !== "ALL").map((item) => ({
      name: item.name,
      label: `${item.label}: ${item.options.find((option) => option.value === filters[item.name])?.label}`,
    })),
  ];
  return (
    <div className="space-y-3 px-5 pb-3">
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            {...register("search")}
            aria-label="Search referral activity"
            placeholder="Search by referral ID, referrer, referred user, or code..."
            className="h-9 bg-muted/30 pl-9 text-xs"
          />
        </div>
        {FILTERS.map((filter) => (
          <Controller
            key={filter.name}
            control={control}
            name={filter.name}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  if (value !== null) field.onChange(value);
                }}
              >
                <SelectTrigger
                  aria-label={`Filter by ${filter.label.toLowerCase()}`}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  className="h-9 min-w-28 bg-card text-[11px]"
                >
                  <span className="text-muted-foreground">{filter.label}:</span>
                  <SelectValue>
                    {
                      filter.options.find(
                        (option) => option.value === field.value,
                      )?.label
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        ))}
      </div>
      <div className="flex min-h-6 items-center justify-between gap-3 text-[10px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-muted-foreground">
            ACTIVE FILTERS:
          </span>
          {chips.map((chip) => (
            <button
              key={chip.name}
              type="button"
              aria-label={`Remove ${chip.label} filter`}
              onClick={() => setValue(chip.name, "ALL")}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/20 px-2 py-1 font-medium"
            >
              {chip.label}
              <X className="size-2.5 text-muted-foreground" />
            </button>
          ))}
          {filters.search && (
            <button
              type="button"
              aria-label="Remove search filter"
              onClick={() => setValue("search", "")}
              className="inline-flex items-center gap-2 rounded-full border border-border px-2 py-1"
            >
              <span className="max-w-48 truncate" title={filters.search}>Search: {filters.search}</span>
              <X className="size-2.5 shrink-0" />
            </button>
          )}
          <button
            type="button"
            className="ml-1 font-semibold text-primary hover:underline"
            onClick={onClear}
          >
            Clear Filters
          </button>
        </div>
        {selectedCount > 0 && (
          <span
            role="status"
            className="shrink-0 rounded bg-primary/10 px-5 py-1 font-semibold text-primary"
          >
            {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
            (Bulk)
          </span>
        )}
      </div>
    </div>
  );
}
