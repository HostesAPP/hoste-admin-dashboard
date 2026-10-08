import type { Metadata } from "next";
import { SettingsOverview } from "@/features/settings/components/settings.overview";
import { SETTINGS_CATEGORIES } from "@/features/settings/data/settings.overview.data";

export const metadata: Metadata = { title: "Settings | Hosté Admin" };

export default function SettingsPage() {
  return <SettingsOverview categories={SETTINGS_CATEGORIES} />;
}
