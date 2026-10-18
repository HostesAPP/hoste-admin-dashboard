import type { Metadata } from "next";
import { SystemSettingsPage } from "@/features/settings/components/SettingsSystem";
export const metadata: Metadata = { title: "System Settings | Hosté Admin" };
export default function Page() {
  return <SystemSettingsPage />;
}
