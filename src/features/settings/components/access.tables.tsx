"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AccessSnapshot } from "../settings.access.types";
import type { AccessManagementView } from "./access.management.dialog";

export function AccessRolesTable({
  snapshot,
  onManage,
  search = "",
}: {
  snapshot: AccessSnapshot;
  onManage: (view: AccessManagementView) => void;
  search?: string;
}) {
  const query = search.trim().toLowerCase();
  const roles = "roles permissions".includes(query)
    ? snapshot.roles
    : snapshot.roles.filter((role) =>
        `${role.name} ${role.description} ${role.scope.join(" ")}`
          .toLowerCase()
          .includes(query),
      );
  return (
    <section hidden={roles.length === 0 && query !== ""}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold">Roles & Permissions</h2>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Hosté administrative roles, assigned staff count, and scope of
            authorized operations.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!snapshot.canManage}
          className="text-primary"
          onClick={() => onManage("roles")}
        >
          + Create Custom Role
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table className="text-[11px]">
          <TableHeader className="bg-muted/40">
            <TableRow>
              {[
                "ROLE NAME",
                "DESCRIPTION",
                "ASSIGNED",
                "KEY PERMISSIONS & SCOPE",
                "ACTION",
              ].map((title) => (
                <TableHead
                  key={title}
                  className="text-[9px] text-muted-foreground"
                >
                  {title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-semibold">{role.name}</TableCell>
                <TableCell className="max-w-72 whitespace-normal text-[10px] text-muted-foreground">
                  {role.description}
                </TableCell>
                <TableCell>
                  <span className="rounded bg-muted px-2 py-1 text-[9px]">
                    {
                      snapshot.admins.filter(
                        (admin) => admin.roleId === role.id,
                      ).length
                    }{" "}
                    Admins
                  </span>
                </TableCell>
                <TableCell className="whitespace-normal">
                  <div className="flex flex-wrap gap-1">
                    {role.scope.map((scope) => (
                      <span
                        key={scope}
                        className="rounded bg-muted px-1.5 py-1 text-[9px]"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={!snapshot.canManage}
                    onClick={() => onManage("roles")}
                    className="h-7 px-1 text-[10px] text-primary"
                  >
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

export function AccessActivityTable({
  snapshot,
  onManage,
}: {
  snapshot: AccessSnapshot;
  onManage: (view: AccessManagementView) => void;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold">Recent Access Activity</h2>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Real-time audit log of administrative logins, role updates, and
            security interventions.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onManage("activity")}
        >
          View All Activity →
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table className="text-[11px]">
          <TableHeader className="bg-muted/40">
            <TableRow>
              {[
                "USER / ADMIN",
                "USER TYPE",
                "ACTIVITY",
                "DATE & TIME",
                "STATUS",
                "ACTIONS",
              ].map((title) => (
                <TableHead
                  key={title}
                  className="text-[9px] text-muted-foreground"
                >
                  {title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {snapshot.activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-semibold">{activity.name}</TableCell>
                <TableCell className="text-[10px] text-secondary">
                  {activity.type}
                </TableCell>
                <TableCell className="max-w-72 whitespace-normal text-[10px] text-muted-foreground">
                  {activity.activity}
                </TableCell>
                <TableCell className="text-[10px] text-muted-foreground">
                  {new Date(activity.at).toLocaleString("en-GB", {
                    timeZone: "Africa/Lagos",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell>
                  <span
                    className={`rounded px-2 py-1 text-[9px] ${["Blocked", "Failed"].includes(activity.status) ? "bg-destructive/10 text-destructive" : "bg-secondary/10 text-secondary"}`}
                  >
                    {activity.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 text-[10px]"
                    onClick={() => onManage("activity")}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {snapshot.activities.length === 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">
            No access activity yet.
          </p>
        )}
      </div>
    </section>
  );
}
