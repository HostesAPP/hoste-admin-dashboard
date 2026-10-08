import type { Metadata } from "next";
import { GeneralSettings } from "@/features/settings/components/settings.general";
import { DEFAULT_GENERAL_SETTINGS } from "@/features/settings/data/settings.general.data";

export const metadata: Metadata = { title: "General Settings | Hosté Admin" };

export default function GeneralSettingsPage() {
  return <GeneralSettings initialValues={DEFAULT_GENERAL_SETTINGS} />;
}
