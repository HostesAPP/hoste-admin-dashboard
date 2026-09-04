import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getGroupEngagements, getGroupMembers, type Group } from "@/features/groups";
import { Star } from "lucide-react";

export const GroupDetailsStat = ({ group }: { group: Group }) => {

  const totalMembers = getGroupMembers(group.id)?.length || 0;

  return (
    <section className="grid grid-cols-4 gap-6">
      {/*stat cards*/}

      {/* card 1 - total members*/}
      <Card className="shadow-sm gap-2 hover:shadow-md py-4 transition-shadow duration-200 rounded-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground truncate">
            Total Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-foreground">{totalMembers}</div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">Current group members</p>
        </CardFooter>
      </Card>

      {/* card 2 - group engagements*/}
      <Card className="shadow-sm gap-2 hover:shadow-md py-4 transition-shadow duration-200 rounded-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground truncate">
            Group Engagements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-foreground">{getGroupEngagements(group.id)?.length}</div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">Associated group bookings</p>
        </CardFooter>
      </Card>

      {/* card 3 - group rating*/}
      <Card className="shadow-sm gap-2 hover:shadow-md py-4 transition-shadow duration-200 rounded-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground truncate">
            Group Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-foreground"><span>{4.5}</span> <Star className="size-5 fill-yellow-400 text-yellow-400 inline" /></div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">Average customer rating</p>
        </CardFooter>
      </Card>

      {/* card 4 - leader earnings*/}
      <Card className="shadow-sm gap-2 hover:shadow-md py-4 transition-shadow duration-200 rounded-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground truncate">
            Leader Earnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-foreground">₦<span>{138000}</span></div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">Attributed to group leader</p>
        </CardFooter>
      </Card>
    </section>
  );
};