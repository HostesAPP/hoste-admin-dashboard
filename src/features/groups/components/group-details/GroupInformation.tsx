import { Button } from "@/components/ui/button";
import { type Group } from "@/features/groups";

export const GroupInformation = ({ group }: { group: Group }) => {
  <section className="p-6 rounded-md border">
    <div>
      <h3>Group Information</h3>
      <Button variant={"outline"}>
        Edit Information
      </Button>
    </div>

    <div>
      {group.name}
    </div>
  </section>
}