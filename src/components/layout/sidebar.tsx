"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Calendar,
  CreditCard,
  Users2,
  Users,
  FileBarChart2,
  Bell,
  LifeBuoy,
  Headphones,
  Newspaper,
  Image as ImageIcon,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  hasSubmenu?: boolean;
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Profiles", href: "/profiles", icon: Sparkles },
  { label: "Bookings", href: "/bookings", icon: Calendar },
  { label: "Payments & Payouts", href: "/payments", icon: CreditCard, hasSubmenu: true },
  { label: "Groups", href: "/groups", icon: Users2 },
  { label: "Users", href: "/users", icon: Users },
  { label: "Reports", href: "/reports", icon: FileBarChart2 },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Support Tickets", href: "/support-tickets", icon: LifeBuoy },
  { label: "Customer Support", href: "/customer-support", icon: Headphones },
  { label: "Blog", href: "/blog", icon: Newspaper },
  { label: "Banners", href: "/banners", icon: ImageIcon, hasSubmenu: true },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col justify-between h-screen sticky top-0 select-none">
      {/* Top Section */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border/40">
          <div className="w-10 h-10 rounded-xl bg-amber-100/70 dark:bg-amber-950/40 flex items-center justify-center shadow-xs border border-amber-200/50 dark:border-amber-900/30">
            <span className="text-primary font-bold text-xs tracking-tight">HOSTÉ</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-wider text-foreground">HOSTÉ</span>
            <span className="text-[11px] text-muted-foreground font-normal">Admin Console</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="py-4 flex flex-col gap-0.5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
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
                  "group relative flex items-center justify-between px-5 py-2.5 text-xs font-medium transition-colors",
                  isActive
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {/* Active left indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
                )}

                <div className="flex items-center gap-3.5">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.hasSubmenu && (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Logout Footer */}
      <div className="border-t border-border/60 px-5 py-3.5 flex items-center justify-between bg-card">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar className="w-7 h-7 border border-border">
            <AvatarImage src="/avatar-placeholder.png" alt="Admin" />
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
              HA
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate max-w-[110px]">
            admin@hoste.ng
          </span>
        </div>

        <button
          type="button"
          className="text-xs text-primary font-medium hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
