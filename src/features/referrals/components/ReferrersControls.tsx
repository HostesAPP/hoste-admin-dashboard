import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ReferrersSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next && options.some((item) => item.value === next)) onChange(next);
      }}
    >
      <SelectTrigger aria-label={label} className="h-8 bg-card text-[11px]">
        <SelectValue>
          {options.find((item) => item.value === value)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ReferrerStatusBadge({ status }: { status: string }) {
  const tone = ["Active", "Qualified", "Completed"].includes(status)
    ? "bg-success/10 text-success"
    : status === "Suspended"
      ? "bg-yellow/15 text-warning"
      : status === "Pending"
        ? "bg-destructive/10 text-destructive"
        : "bg-muted text-muted-foreground";
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${tone}`}
    >
      {status}
    </span>
  );
}

export function ReferrersPagination({
  page,
  count,
  size,
  noun,
  onChange,
}: {
  page: number;
  count: number;
  size: number;
  noun: string;
  onChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(count / size));
  return (
    <footer className="mt-5 flex items-center justify-between border-t border-border pt-4 text-[11px] text-muted-foreground">
      <span>
        Showing {count ? (page - 1) * size + 1 : 0}–
        {Math.min(page * size, count)} of {count} {noun}
      </span>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="xs"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
        >
          Previous
        </Button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((number) => (
          <Button
            key={number}
            size="icon-xs"
            variant={page === number ? "default" : "outline"}
            aria-label={`${noun} page ${number}`}
            aria-current={page === number ? "page" : undefined}
            onClick={() => onChange(number)}
          >
            {number}
          </Button>
        ))}
        <Button
          variant="outline"
          size="xs"
          disabled={page === pages}
          onClick={() => onChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </footer>
  );
}
