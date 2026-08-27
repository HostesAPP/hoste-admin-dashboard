import {
  GROUPS,
  GroupSearch,
  GroupsFilter,
  GroupsPageHeader,
  GroupsStat,
  GROUP_MEMBERS,
  GroupsTable
} from "@/features/groups";

export default function GroupsPage() {

  // groups statistics data
  const StatData = [
    {
      title: "01 — Total Groups",
      value: GROUPS.length,
      footerText: "All groups on Hosté",
      rate: 12,
    },
    {
      title: "02 — Active Groups",
      value: GROUPS.filter(group => group.status === "Active").length,
      footerText: "Currently active",
      rate: 0
    },
    {
      title: "03 — Total Members",
      value: GROUP_MEMBERS.length,
      footerText: "Members across all groups",
      rate: 0
    },
    {
      title: "04 — Suspended / Inactive",
      value: GROUP_MEMBERS.filter(group => group.status !== "Active").length,
      footerText: "Groups requiring attention",
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

          {/* groups search input */}
          <GroupSearch />

          {/* groups filter */}
          <GroupsFilter />
        </section>

        {/* stats overview */}
        <section>
          <GroupsStat StatData={StatData} />
        </section>

        {/* groups table */}
        <section className="py-6">
          <GroupsTable />
        </section>


      </main>


    </div>
  );
}