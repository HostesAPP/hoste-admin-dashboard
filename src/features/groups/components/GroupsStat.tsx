import { GroupsStatCard } from "./GroupsStatCard";

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
    <div className="grid grid-cols-3 gap-4">
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