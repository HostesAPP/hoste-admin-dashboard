import type { Metadata } from "next";
import { PlatformContentSettingsPage } from "@/features/settings/components/settings.platform.content";

export const metadata: Metadata = {
  title: "Platform Content Settings | Hosté Admin",
};
export default function Page() {
  return <PlatformContentSettingsPage />;
}
