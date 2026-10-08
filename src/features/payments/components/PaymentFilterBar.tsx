import { Search, ChevronDown, Download } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  paymentFilterSchema,
  PaymentFilterSchema,
} from "../schemas/payment.filter";
import { zodResolver } from "@hookform/resolvers/zod";

export const paymentFilters = {
  date: {
    label: "Date",
    options: [
      { label: "Last 30 days", value: "LAST_30_DAYS" },
      { label: "Last 7 days", value: "LAST_7_DAYS" },
      { label: "Today", value: "TODAY" },
    ],
  },
  status: {
    label: "Status",
    options: [
      { label: "All statuses", value: "ALL" },
      { label: "Successful", value: "SUCCESSFUL" },
      { label: "Pending", value: "PENDING" },
      { label: "Failed", value: "FAILED" },
    ],
  },
  method: {
    label: "Method",
    options: [
      { label: "All methods", value: "ALL" },
      { label: "Bank transfer", value: "BANK_TRANSFER" },
      { label: "Credit card", value: "CREDIT_CARD" },
      { label: "PayPal", value: "PAYPAL" },
    ],
  },
};

export function PaymentFilter({ onExport }: { onExport: () => void }) {
  const { register, setValue, control } =
    useForm<PaymentFilterSchema>({
      resolver: zodResolver(paymentFilterSchema),
      defaultValues: {
        search: "",
        date: "LAST_30_DAYS",
        status: "ALL",
        method: "ALL",
      },
    });

  return (
    <div className="flex flex-wrap items-center gap-3 pt-1">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[280px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          {...register("search")}
          placeholder="Search by name, email, phone number or User ID..."
          className="pl-10 h-10 text-xs rounded-lg bg-card border-border/80 focus-visible:ring-primary focus-visible:ring-1"
          onChange={(e) => {
            setValue("search", e.target.value);
          }}
        />
      </div>

      {/* Filter Dropdown */}
      {Object.entries(paymentFilters).map(([name, filter]) => (
        <Controller
          key={name}
          control={control}
          name={name as keyof typeof paymentFilters}
          render={({ field }) => (
            <DropdownMenu>
              <DropdownMenuTrigger className="h-10 text-xs font-normal border border-border/80 bg-card hover:bg-muted/50 px-3.5 gap-2 text-muted-foreground min-w-[85px] justify-between inline-flex items-center rounded-md cursor-pointer">
                <span>
                  <span className="capitalize text-[13px] font-medium">
                    {name}:{" "}
                  </span>
                  {filter.options.find((option) => option.value === field.value)
                    ?.label ?? filter.label}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="text-xs">
                {filter.options.map(({ label, value }) => (
                  <DropdownMenuItem
                    key={value}
                    onSelect={() => field.onChange(value)}
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      ))}

      {/* Clear Filters Link */}
      <button
        type="button"
        onClick={onExport}
        className="text-xs flex items-center font-medium bg-foreground gap-2 text-background hover:opacity-90 px-2 py-2 cursor-pointer transition-colors rounded-[6px]"
      >
        <Download className="size-3" />
        Export
      </button>
    </div>
  );
}
