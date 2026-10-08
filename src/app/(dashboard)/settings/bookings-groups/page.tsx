import type { Metadata } from "next";
import { BookingsGroupsSettingsPage } from "@/features/settings/components/settings.bookings.groups";

export const metadata: Metadata = {
  title: "Bookings & Groups Settings | Hosté Admin",
};
export default function Page() {
  return <BookingsGroupsSettingsPage />;
}
