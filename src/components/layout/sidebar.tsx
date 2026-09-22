"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  CreditCard,
  Users2,
  Share2,
  Users,
  FileBarChart2,
  Bell,
  LifeBuoy,
  Headphones,
  Newspaper,
  Image as ImageIcon,
  ShieldAlert,
  Settings,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export type StaffRole =
  | "SUPER_ADMIN"
  | "VERIFICATION_OFFICER"
  | "MODERATOR"
  | "CUSTOMER_SUPPORT"
  | "FINANCE"
  | "OPERATIONS";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
  allowedRoles: StaffRole[];
}

// PRD v2.2 §03 Canonical 15-Item Sidebar Navigation Order
const navItems: NavItem[] = [
  {
    label: "Overview",
    href: "/",
    icon: LayoutDashboard,
    allowedRoles: ["SUPER_ADMIN", "VERIFICATION_OFFICER", "MODERATOR", "CUSTOMER_SUPPORT", "FINANCE", "OPERATIONS"],
  },
  {
    label: "Profiles",
    href: "/profiles",
    icon: Sparkles,
    badgeCount: 2,
    allowedRoles: ["SUPER_ADMIN", "VERIFICATION_OFFICER", "MODERATOR"],
  },
  {
    label: "Payments & Payouts",
    href: "/payments",
    icon: CreditCard,
    allowedRoles: ["SUPER_ADMIN", "FINANCE"],
  },
  {
    label: "Groups",
    href: "/groups",
    icon: Users2,
    allowedRoles: ["SUPER_ADMIN", "OPERATIONS"],
  },
  {
    label: "Referrals",
    href: "/referrals",
    icon: Share2,
    allowedRoles: ["SUPER_ADMIN", "OPERATIONS", "FINANCE"], // TODO: pending product confirmation for final Referral RBAC per §18
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
    allowedRoles: ["SUPER_ADMIN", "CUSTOMER_SUPPORT", "MODERATOR"],
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileBarChart2,
    allowedRoles: ["SUPER_ADMIN", "FINANCE", "OPERATIONS"],
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
    allowedRoles: ["SUPER_ADMIN", "OPERATIONS"],
  },
  {
    label: "Support Tickets",
    href: "/support-tickets",
    icon: LifeBuoy,
    allowedRoles: ["SUPER_ADMIN", "CUSTOMER_SUPPORT", "MODERATOR"],
  },
  {
    label: "Customer Support",
    href: "/customer-support",
    icon: Headphones,
    badgeCount: 3,
    allowedRoles: ["SUPER_ADMIN", "CUSTOMER_SUPPORT"],
  },
  {
    label: "Blog",
    href: "/blog",
    icon: Newspaper,
    allowedRoles: ["SUPER_ADMIN", "OPERATIONS"],
  },
  {
    label: "Banners",
    href: "/banners",
    icon: ImageIcon,
    allowedRoles: ["SUPER_ADMIN", "OPERATIONS"], // TODO: pending product confirmation for Banners backend/data model per §18
  },
  {
    label: "Moderation",
    href: "/moderation",
    icon: ShieldAlert,
    allowedRoles: ["SUPER_ADMIN", "MODERATOR"],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    allowedRoles: ["SUPER_ADMIN", "VERIFICATION_OFFICER", "MODERATOR", "CUSTOMER_SUPPORT", "FINANCE", "OPERATIONS"],
  },
  {
    label: "Audit Log",
    href: "/audit-logs",
    icon: History,
    allowedRoles: ["SUPER_ADMIN"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = useState<StaffRole>("SUPER_ADMIN");

  // Filter items per RBAC rule: hide sections forbidden to logged-in StaffRole
  const visibleNavItems = navItems.filter((item) =>
    item.allowedRoles.includes(currentRole)
  );

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-[#1A1A1A] text-white flex flex-col justify-between h-screen sticky top-0 select-none">
      {/* Top Section */}
      <div className="flex flex-col min-h-0">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-[#EF5A22] flex items-center justify-center shadow-xs">
            <span className="text-white font-black text-xs tracking-wider">H</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-wider text-white">HOSTÉ</span>
            <span className="text-[10px] text-zinc-400 font-normal">Admin Console v2.2</span>
          </div>
        </div>

        {/* Role Selector Header Context */}
        <div className="px-5 py-2.5 bg-black/30 border-b border-white/5 flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Role View</span>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as StaffRole)}
            className="text-[10px] font-semibold bg-zinc-800 text-amber-400 border border-zinc-700 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
          >
            <option value="SUPER_ADMIN">SUPER ADMIN</option>
            <option value="VERIFICATION_OFFICER">VERIFICATION OFF.</option>
            <option value="MODERATOR">MODERATOR</option>
            <option value="CUSTOMER_SUPPORT">SUPPORT</option>
            <option value="FINANCE">FINANCE</option>
            <option value="OPERATIONS">OPERATIONS</option>
          </select>
        </div>

        {/* Navigation Links */}
        <nav className="py-3 flex flex-col gap-0.5 overflow-y-auto max-h-[calc(100vh-180px)]">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group relative flex items-center justify-between px-5 py-2 text-xs font-medium transition-colors",
                  isActive
                    ? "text-white bg-[#EF5A22]/20 font-semibold text-[#EF5A22]"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                {/* Active left orange border accent */}
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#EF5A22] rounded-r" />
                )}

                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-[#EF5A22]" : "text-zinc-400 group-hover:text-white"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badgeCount && item.badgeCount > 0 ? (
                  <Badge className="bg-[#EF5A22] text-white text-[10px] px-1.5 py-0 rounded-full h-4 min-w-[16px] flex items-center justify-center font-bold">
                    {item.badgeCount}
                  </Badge>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Profile Info */}
      <div className="border-t border-white/10 px-5 py-3 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="w-7 h-7 border border-zinc-700">
            <AvatarImage src="/avatar-placeholder.png" alt="Admin" />
            <AvatarFallback className="text-[10px] bg-[#EF5A22] text-white font-bold">
              HA
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-white truncate max-w-[110px]">
              admin@hoste.ng
            </span>
            <span className="text-[9px] text-amber-400 font-mono font-semibold">
              {currentRole}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.location.href = "/sign-in";
            }
          }}
          className="text-xs text-[#EF5A22] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
