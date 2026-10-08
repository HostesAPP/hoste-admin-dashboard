"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  CreditCard,
  LockKeyhole,
  PanelsTopLeft,
  Plus,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsHeader } from "./settings.header";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SettingsCategory } from "../settings.types";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS = {
  general: SlidersHorizontal,
  access: ShieldCheck,
  hoste: Star,
  bookings: CalendarDays,
  payments: CreditCard,
  notifications: Bell,
  content: PanelsTopLeft,
  security: LockKeyhole,
  system: Server,
};

const QUICK_SETTINGS = [
  { name: "maintenance", label: "Maintenance Mode", tone: "primary" },
  { name: "users", label: "Allow User Signups", tone: "secondary" },
  { name: "hosts", label: "Allow Hosté Signups", tone: "secondary" },
  { name: "alerts", label: "System Alerts", tone: "primary" },
] as const;

export function SettingsOverview({
  categories,
}: {
  categories: SettingsCategory[];
}) {
  const [search, setSearch] = useState("");
  const [quickSettings, setQuickSettings] = useState({
    maintenance: false,
    users: true,
    hosts: true,
    alerts: true,
  });
  const [selected, setSelected] = useState<SettingsCategory | null>(null);
  const visibleCategories = categories.filter((category) =>
    [category.title, category.description, ...category.items]
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return (
    <div className="min-w-[1024px] font-normal tracking-normal">
      <SettingsHeader search={search} onSearch={setSearch} />
      <div className="mx-auto max-w-[1440px] px-8 pb-12 pt-7">
        <p className="text-xs font-semibold text-primary">Settings</p>
        <h1 className="mt-1 text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage platform configuration, users, bookings, payments,
          notifications, and security
        </p>

        <section
          aria-label="Quick settings"
          className="mt-5 flex items-center rounded-lg border border-border bg-card px-5 py-5"
        >
          <h2 className="flex shrink-0 items-center gap-2 pr-5 text-xs font-semibold">
            <Plus aria-hidden="true" className="size-4 text-primary" />
            Quick Settings
          </h2>
          {QUICK_SETTINGS.map((setting) => (
            <div
              key={setting.name}
              className="flex flex-1 items-center justify-center gap-3 border-l border-border px-3"
            >
              <label
                htmlFor={`quick-${setting.name}`}
                className="text-[11px] text-muted-foreground"
              >
                {setting.label}
              </label>
              <Switch
                id={`quick-${setting.name}`}
                checked={quickSettings[setting.name]}
                onCheckedChange={(checked) =>
                  setQuickSettings((current) => ({
                    ...current,
                    [setting.name]: checked,
                  }))
                }
                className={cn(
                  "h-4 w-8 [&>span]:size-3",
                  quickSettings[setting.name] &&
                    setting.tone === "secondary" &&
                    "bg-secondary",
                )}
              />
            </div>
          ))}
        </section>

        <div className="mt-7 grid grid-cols-3 gap-5">
          {visibleCategories.map((category) => {
            const Icon = CATEGORY_ICONS[category.id];
            const tone =
              category.tone === "secondary" ? "text-secondary" : "text-primary";
            const summary =
              category.id === "system"
                ? quickSettings.maintenance
                  ? "Maintenance Mode On"
                  : "Platform Online • Maintenance Mode Off"
                : category.summary;
            return (
              <article
                key={category.id}
                className="flex min-h-[310px] flex-col rounded-lg border border-border bg-card p-5"
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg",
                    tone,
                    category.tone === "secondary"
                      ? "bg-secondary/10"
                      : "bg-primary/10",
                  )}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </div>
                <h2 className="mt-3 text-base font-bold">{category.title}</h2>
                <p className="mt-1 min-h-9 text-xs leading-4 text-muted-foreground">
                  {category.description}
                </p>
                <ul className="mt-4 space-y-1.5 text-[11px] text-muted-foreground">
                  {category.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-1 size-1 shrink-0 rounded-full",
                          category.tone === "secondary"
                            ? "bg-secondary"
                            : "bg-primary",
                        )}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-3">
                  <p className="mb-3 rounded-sm border border-border/70 bg-background px-2 py-1.5 text-[10px] font-semibold text-secondary">
                    {summary}
                  </p>
                </div>
                {category.id === "general" ||
                category.id === "access" ||
                category.id === "hoste" ||
                category.id === "bookings" ||
                category.id === "payments" ||
                category.id === "notifications" ? (
                  <Link
                    href={category.href}
                    aria-label={`Manage ${category.title}`}
                    className={cn(
                      "flex items-center justify-between border-t border-border pt-3 text-xs font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      tone,
                    )}
                  >
                    Manage
                    <ChevronRight aria-hidden="true" className="size-4" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelected(category)}
                    aria-label={`Manage ${category.title}`}
                    className={cn(
                      "flex items-center justify-between border-t border-border pt-3 text-xs font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      tone,
                    )}
                  >
                    Manage
                    <ChevronRight aria-hidden="true" className="size-4" />
                  </button>
                )}
              </article>
            );
          })}
        </div>
        {visibleCategories.length === 0 && (
          <div
            role="status"
            className="py-20 text-center text-sm text-muted-foreground"
          >
            No settings found for &quot;{search}&quot;.
          </div>
        )}
      </div>
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>{selected?.description}</DialogDescription>
          </DialogHeader>
          <ul className="space-y-3 text-sm">
            {selected?.items.map((item) => (
              <li key={item} className="border-b border-border pb-3">
                {item}
              </li>
            ))}
          </ul>
          <Button
            nativeButton={false}
            render={<Link href={selected?.href ?? "/settings/configuration"} />}
          >
            Open{" "}
            {selected?.href === "/settings/configuration"
              ? "Configuration"
              : selected?.title}
            <ChevronRight className="size-4" />
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
