"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/features/auth/auth.store";
import { useLogout } from "@/features/auth/hooks/auth.hooks";
import { ChevronDown, LogOut, Settings, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrentUserTopNavProps {
  className?: string;
}

export function CurrentUserTopNav({ className }: CurrentUserTopNavProps) {
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-3 rounded-xl p-1.5 hover:bg-muted/60 transition-colors cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          className
        )}
      >
        <Avatar className="h-9 w-9 border border-border/70 shrink-0">
          <AvatarImage src={"/avatar-placeholder.png"} alt={"Admin"} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
            AD
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0 pr-1 text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-foreground truncate max-w-[125px] leading-tight">
              Admin
            </span>
            <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
          </div>
          <span className="text-[10px] text-muted-foreground font-medium capitalize truncate max-w-[125px] leading-tight mt-0.5">
            Admin
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 p-3 rounded-2xl shadow-xl border-border bg-card" align="end">
        {/* User Account Info */}
        <div className="p-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border shrink-0">
              <AvatarImage src={"/avatar-placeholder.png"} alt={"Admin"} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground truncate">Admin</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.email || "admin@hoste.ng"}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-primary/10 text-primary border border-primary/20">
                  Admin
                </span>
                {user?.role && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted text-muted-foreground">
                    Role: {user.role}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2" />

        {/* Quick Links */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-xs cursor-pointer py-2 px-2.5 rounded-lg">
            <Link href="/settings" className="flex items-center gap-2.5 w-full">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span>Account Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2" />

        {/* Logout */}
        <DropdownMenuItem
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="text-xs text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer py-2 px-2.5 rounded-lg font-medium"
        >
          {logoutMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 mr-2" />
          )}
          <span>{logoutMutation.isPending ? "Signing out..." : "Log Out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
