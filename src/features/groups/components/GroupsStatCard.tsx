import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface GroupStatCardProps {
  title: string;
  value: number;
  footerText: string
  rate: number
}

export const GroupsStatCard = ({
  title,
  value,
  footerText,
  rate,
}: GroupStatCardProps) => {
  return (
    <Card className="shadow-sm gap-2 hover:shadow-md transition-shadow duration-200 rounded-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {
          rate && rate > 0 ? (
            <span className={`text-sm font-bold px-2 py-1 rounded-sm text-secondary-green bg-secondary-green/10`}>
              +{rate} this month
            </span>
          ) : null
        }
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-foreground">{value}</div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">{footerText}</p>
      </CardFooter>
    </Card>
  );
};