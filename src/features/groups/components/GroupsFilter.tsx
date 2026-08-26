import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";

export const GroupsFilter = () => {
  return (
    <div className="flex items-center gap-2">
      <Button variant={"outline"} className="gap-2 px-4">
        <ListFilter size={16} />
        Filter
      </Button>
    </div>
  );
};