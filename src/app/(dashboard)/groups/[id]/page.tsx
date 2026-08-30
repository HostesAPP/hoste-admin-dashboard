"use client";

import { GoBackLink, StatusBadge } from "@/components/shared";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { GROUPS } from "@/features/groups";
import { useParams } from "next/navigation";

export default function GroupDetailPage() {

  const params = useParams()
  const groupId = params?.id
  const currentGroup = GROUPS.find(group => group.id === groupId)

  return (
    <div>

      {/* page header */}
      <div className="p-6">

        {/* breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/groups">Groups</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentGroup?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* back to groups link*/}
        <span className="block mt-4">
          <GoBackLink href="/groups" text="Back to Groups" />
        </span>


        {/* header an actions */}
        <section className="flex items-center justify-between mt-6">

          {/* group name, id and status */}
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-2xl">{currentGroup?.name}</h1>

            {/* group id */}
            <span className="text-muted-foreground mr-8">{currentGroup?.id}</span>

            {/* group status badge */}
            <StatusBadge status={currentGroup?.status || ""} />
          </div>

          {/* actions */}
          <div>
            
          </div>
        </section>

      </div>
    </div>
  )
}