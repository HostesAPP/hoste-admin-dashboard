import { Groups } from "@/features/groups";
import { GroupSearch } from "@/features/groups/components/GroupSearch";
import { GroupsFilter } from "@/features/groups/components/GroupsFilter";
import { GroupsPageHeader } from "@/features/groups/components/GroupsPageHeader";
import { GroupsStat } from "@/features/groups/components/GroupsStat";

export default function GroupsPage() {



  const StatData = [
    {
      title: "01 — Total Groups",
      value: Groups.length,
      footerText: "All groups on Hosté",
      rate: 12,
    },
    {
      title: "02 — Active Groups",
      value: Groups.filter(group => group.status === "Active").length,
      footerText: "Currently active",
      rate: 0
    },
    {
      title: "03 — Total Members",
      value: Groups.length,
      footerText: "Members across all groups",
      rate: 0
    },
  ]
  

  return (
    <div className="">
      {/* page header */}
      <GroupsPageHeader />

      {/* groups page main content */}
      <main className="space-y-6 px-6">
        {/* search and filters */}
        <section className="flex items-center gap-2">
          <GroupSearch />
          <GroupsFilter />
        </section>

        {/* stats overview */}
        <section>
          <GroupsStat StatData={StatData} />
        </section>
      </main>


    </div>
  );
}