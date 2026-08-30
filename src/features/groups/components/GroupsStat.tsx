import { GroupsStatCard } from "@/features/groups";

interface GroupsStatProps {
  StatData: {
    title: string;
    value: number;
    footerText: string;
    rate: number;
  }[];
}

export const GroupsStat = ({
  StatData,
}: GroupsStatProps) => {
  
  return (
    <div className="grid grid-cols-4 gap-6">
      {StatData?.map((data) => (
        <GroupsStatCard
          key={data.title}
          title={data.title}
          value={data.value}
          footerText={data.footerText}
          rate={data.rate}
        />
      ))}
    </div>
  );
};