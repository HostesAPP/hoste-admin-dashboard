import { formatDate } from "@/lib/utils"
import { Dot } from "lucide-react"
import { type Group } from "../../types/groups.types"

export const GroupDetailsBio = ({ group }: { group: Group }) => {
  return (
    <section className="p-6 rounded-md border w-full flex items-center gap-4">

      {/* group avatar - (temporary, willbe replcaed later) */}
      <div className="w-24 h-24 bg-primary/50 rounded-md" />

      {/* group info */}
      <div className="flex-1 space-y-3">
        <h2 className="text-xl font-bold">{group?.name}</h2>
        <p className="font-medium text-muted-foreground text-sm">{group?.description}</p>

        {/* category, createdAt and group id */}
        <div className="text-muted-foreground flex items-center gap-0.5 text-sm">

          {/* category */}
          <div>
            <span>Category: </span>
            <span className="font-semibold text-foreground">{group?.category}</span>
          </div>
          <Dot size={28} />

          {/* created at */}
          <div>
            <span>Created At: </span>
            <span className="font-semibold text-foreground">{formatDate(group?.createdAt)}</span>
          </div>
          <Dot size={28} />

          {/* group id */}
          <div>
            <span>Group ID: </span>
            <span className="font-semibold text-foreground">{group?.id}</span>
          </div>
        </div>
      </div>

    </section>
  )
}