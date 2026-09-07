"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User, UserType } from "../types/users.types";
import { ChevronDown, UserCog } from "lucide-react";

const changeRoleSchema = z.object({
  role: z.enum(["Hosté", "Customer", "Admin", "Staff"]),
  roleSubtitle: z.string().optional(),
});

type ChangeRoleFormValues = z.infer<typeof changeRoleSchema>;

interface ChangeRoleModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (user: User, newRole: UserType, newRoleSubtitle?: string) => void;
}

const roleOptions: { role: UserType; subtitle: string }[] = [
  { role: "Admin", subtitle: "Super Admin" },
  { role: "Admin", subtitle: "Verification Officer" },
  { role: "Admin", subtitle: "Moderator" },
  { role: "Admin", subtitle: "Finance" },
  { role: "Admin", subtitle: "Operations" },
  { role: "Admin", subtitle: "Customer Support" },
  { role: "Hosté", subtitle: "Event Host" },
  { role: "Hosté", subtitle: "VIP Waitstaff" },
  { role: "Hosté", subtitle: "Usher" },
  { role: "Customer", subtitle: "Client" },
];

export function ChangeRoleModal({
  user,
  open,
  onOpenChange,
  onConfirm,
}: ChangeRoleModalProps) {
  const { control, handleSubmit, setValue, watch } = useForm<ChangeRoleFormValues>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: {
      role: user?.type || "Admin",
      roleSubtitle: user?.roleSubtitle || "Super Admin",
    },
  });

  if (!user) return null;

  const currentRole = watch("role");
  const currentSubtitle = watch("roleSubtitle");

  const onSubmit = (data: ChangeRoleFormValues) => {
    onConfirm(user, data.role, data.roleSubtitle);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <div className="flex items-center gap-2 text-foreground mb-1">
              <UserCog className="w-5 h-5 text-primary" />
              <DialogTitle className="text-base font-bold">
                Change Role for {user.name}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Select a new role and permission preset for {user.userCode}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Assigned Role</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full h-10 px-3.5 text-xs font-medium border border-border/80 bg-card hover:bg-muted/50 rounded-lg inline-flex items-center justify-between text-foreground cursor-pointer">
                      <span>
                        {field.value} {currentSubtitle ? `• ${currentSubtitle}` : ""}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[360px] text-xs max-h-60 overflow-y-auto">
                      {roleOptions.map((opt) => (
                        <DropdownMenuItem
                          key={`${opt.role}-${opt.subtitle}`}
                          onClick={() => {
                            field.onChange(opt.role);
                            setValue("roleSubtitle", opt.subtitle);
                          }}
                          className="flex items-center justify-between"
                        >
                          <span className="font-semibold">{opt.role}</span>
                          <span className="text-muted-foreground text-[11px]">{opt.subtitle}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              />
            </div>
          </div>

          <DialogFooter className="flex sm:justify-end gap-2 pt-3 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs font-medium h-9"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
