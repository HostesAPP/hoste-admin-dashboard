import { Input } from "@/components/ui/input";

export function ReferralDateFilters({ label, dateFrom, dateTo, onChange }: {
  label: string;
  dateFrom: string;
  dateTo: string;
  onChange: (name: "dateFrom" | "dateTo", value: string) => void;
}) {
  return <div role="group" aria-label={label} className="flex shrink-0 items-center gap-2">
    <label className="flex items-center gap-2 text-xs">From<Input type="date" name="dateFrom" aria-label={`${label}: From`} value={dateFrom} max={dateTo || undefined} onChange={(event) => onChange("dateFrom", event.target.value)} className="h-9 w-36 bg-card text-xs" /></label>
    <label className="flex items-center gap-2 text-xs">To<Input type="date" name="dateTo" aria-label={`${label}: To`} value={dateTo} min={dateFrom || undefined} onChange={(event) => onChange("dateTo", event.target.value)} className="h-9 w-36 bg-card text-xs" /></label>
  </div>;
}
