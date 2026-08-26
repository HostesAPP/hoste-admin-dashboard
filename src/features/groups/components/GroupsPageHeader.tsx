import { PageHeaderLayout } from "@/components/shared/PageHeaderLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";


export const GroupsPageHeader = () => {
  return (
    <div>
      <PageHeaderLayout
        title="Groups"
        description="Manage groups, members, activity and status across Hosté."
      >
        <Button>
          <Plus />
          Create Group
        </Button>
      </PageHeaderLayout>
    </div>
  );
};