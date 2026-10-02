import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface GroupSearchProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const GroupSearch = ({
  value = "",
  onChange,
  placeholder = "Search by group name, group ID, leader or category...",
}: GroupSearchProps) => {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 h-11 border border-border/80 bg-card rounded-xl text-sm placeholder:text-muted-foreground/70 focus-visible:ring-primary shadow-2xs"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange?.("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};