"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ACCESS_SECTIONS,
  ACCESS_ACTIONS,
  type AccessPermissions,
  type AccessAction,
} from "../settings.access.types";

export function AccessPermissionsMatrix({
  value,
  onChange,
  disabled = false,
}: {
  value: AccessPermissions;
  onChange: (value: AccessPermissions) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold">Permissions Matrix</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="h-6 text-[10px] text-primary"
            onClick={() =>
              onChange(
                Object.fromEntries(
                  ACCESS_SECTIONS.map((section) => [
                    section,
                    [...ACCESS_ACTIONS],
                  ]),
                ) as AccessPermissions,
              )
            }
          >
            Select All
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="h-6 text-[10px]"
            onClick={() =>
              onChange(
                Object.fromEntries(
                  ACCESS_SECTIONS.map((section) => [
                    section,
                    [] as AccessAction[],
                  ]),
                ) as AccessPermissions,
              )
            }
          >
            Clear All
          </Button>
        </div>
      </div>
      <Table className="text-[11px]">
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="text-[9px]">PLATFORM SECTION</TableHead>
            {ACCESS_ACTIONS.map((action) => (
              <TableHead
                key={action}
                className="text-center text-[9px] uppercase"
              >
                {action}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ACCESS_SECTIONS.map((section) => (
            <TableRow key={section}>
              <TableCell>{section}</TableCell>
              {ACCESS_ACTIONS.map((action) => (
                <TableCell key={action} className="text-center">
                  <Checkbox
                    aria-label={`${section}: ${action}`}
                    disabled={disabled}
                    checked={value[section].includes(action)}
                    onCheckedChange={(checked) =>
                      onChange({
                        ...value,
                        [section]: checked
                          ? [...value[section], action]
                          : value[section].filter((item) => item !== action),
                      })
                    }
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
