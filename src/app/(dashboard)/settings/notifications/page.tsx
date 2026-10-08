import type { Metadata } from "next";
import { NotificationsSettingsPage } from "@/features/settings/components/settings.notifications";

export const metadata: Metadata = {
  title: "Notifications Settings | Hosté Admin",
};
export default function Page() {
  return <NotificationsSettingsPage />;
}
