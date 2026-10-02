import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface GroupStatCardProps {
  title: string;
  value: number;
  footerText: string;
  rate: number;
  isLoading?: boolean;
}

export const GroupsStatCard = ({
  title,
  value,
  footerText,
  rate,
  isLoading = false,
}: GroupStatCardProps) => {
  if (isLoading) {
    return (
      <Card className="shadow-xs border-border/80 p-4 rounded-xl animate-pulse space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-muted rounded" />
          <div className="h-5 w-16 bg-muted rounded" />
        </div>
        <div className="h-8 w-20 bg-muted rounded" />
        <div className="h-3 w-36 bg-muted rounded" />
      </Card>
    );
  }

  return (
    <Card className="shadow-xs border-border/80 hover:shadow-md transition-shadow duration-200 rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-semibold text-muted-foreground truncate">
          {title}
        </CardTitle>
        {rate > 0 ? (
          <span className="truncate text-xs font-bold rounded-md text-secondary bg-secondary/10">
            +{rate} this month
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="">
        <div className="text-3xl font-bold tracking-tight text-foreground">{value}</div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground">{footerText}</p>
      </CardFooter>
    </Card>
  );
};