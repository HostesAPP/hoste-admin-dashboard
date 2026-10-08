import type { Metadata } from "next";
import { SecuritySettingsPage } from "@/features/settings/components/settings.security";
export const metadata: Metadata = { title: "Security Settings | Hosté Admin" };
export default function Page() {
  return <SecuritySettingsPage />;
}
