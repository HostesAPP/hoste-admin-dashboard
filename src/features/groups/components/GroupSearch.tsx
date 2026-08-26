import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const GroupSearch = () => {
  return (
    <div className="relative w-full">
      <Search
        size={20}
        className="absolute left-3 top-2 text-muted-foreground"
      />
      <Input  
        type="search"
        placeholder="Search by group name, group ID, leader or category..."
        className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};