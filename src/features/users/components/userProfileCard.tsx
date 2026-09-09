"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "../types/users.types";
import { cn } from "@/lib/utils";
import { MoreHorizontal, ShieldAlert, UserCheck, KeyRound, Mail, UserCog } from "lucide-react";

interface UserProfileCardProps {
  user: User;
  onOpenSuspend: () => void;
  onOpenChangeRole: () => void;
  onOpenDeactivate?: () => void;
}

export function UserProfileCard({
  user,
  onOpenSuspend,
  onOpenChangeRole,
}: UserProfileCardProps) {
  const isActive = user.status === "Active";
  const roleLabel = user.roleSubtitle || user.type;

  return (
    <div className="bg-card rounded-xl border border-border/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
      {/* Left Avatar & Meta Info */}
      <div className="flex items-center gap-4 min-w-0">
        <Avatar className="w-14 h-14 sm:w-16 sm:h-16 bg-dark text-dark-foreground border border-border/70 shrink-0">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback className="bg-dark text-dark-foreground text-lg font-bold">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
              {user.name}
            </h2>

            {roleLabel && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-foreground border border-border/60">
                {roleLabel}
              </span>
            )}

            <span className="text-xs text-muted-foreground font-mono">
              • {user.userCode}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mt-1.5 font-normal">
            <span className="font-mono">{user.userCode}</span>
            <span>•</span>
            <span className="text-foreground/80">{user.email}</span>
            <span>•</span>
            <span>Joined {user.dateJoined}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              Account Status:{" "}
              <strong
                className={cn(
                  "font-semibold",
                  isActive ? "text-success" : "text-destructive"
                )}
              >
                {user.status}
              </strong>
              <span
                className={cn(
                  "w-2 h-2 rounded-full inline-block",
                  isActive ? "bg-success" : "bg-destructive"
                )}
              />
            </span>
          </div>
        </div>
      </div>

      {/* Right Quick Action Buttons */}
      <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenSuspend}
          className="border-destructive/30 text-destructive hover:bg-destructive/10 font-semibold text-xs sm:text-sm px-3.5 sm:px-4 py-2 h-9 cursor-pointer"
        >
          {isActive ? "Suspend Admin" : "Activate Admin"}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="h-9 px-3 text-xs sm:text-sm font-semibold border border-border bg-card hover:bg-muted text-foreground rounded-md inline-flex items-center gap-1.5 cursor-pointer">
            <span className="tracking-widest">•••</span>
            <span>More Actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-xs w-48">
            <DropdownMenuItem onClick={onOpenChangeRole} className="gap-2">
              <UserCog className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Change Role</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                window.location.href = `mailto:${user.email}`;
              }}
              className="gap-2"
            >
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Send Message</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <KeyRound className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Reset Password</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onOpenSuspend} className="gap-2 text-destructive">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isActive ? "Suspend Account" : "Activate Account"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
