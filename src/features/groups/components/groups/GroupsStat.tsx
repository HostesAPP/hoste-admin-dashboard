import { GroupsStatCard } from "./GroupsStatCard";
import type { GroupStatsData, GroupStatsMetric } from "../../types/groups.types";

interface GroupsStatProps {
  statData?: GroupStatsMetric[] | GroupStatsData;
  isLoading?: boolean;
}

export const GroupsStat = ({ statData, isLoading = false }: GroupsStatProps) => {
  let metrics: GroupStatsMetric[] = [];

  if (Array.isArray(statData)) {
    metrics = statData;
  } else if (statData && typeof statData === "object") {
    metrics = [
      statData.totalGroups,
      statData.activeGroups,
      statData.totalMembers,
      statData.suspendedGroups,
    ].filter(Boolean);
  }

  if (isLoading || metrics.length === 0) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <GroupsStatCard
            key={i}
            title="Loading..."
            value={0}
            footerText="Loading..."
            rate={0}
            isLoading={true}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map((data) => (
        <GroupsStatCard
          key={data.title}
          title={data.title}
          value={data.value}
          footerText={data.footerText}
          rate={data.rate}
          isLoading={false}
        />
      ))}
    </div>
  );
};