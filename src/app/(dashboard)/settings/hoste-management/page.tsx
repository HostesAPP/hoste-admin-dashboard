import type { Metadata } from "next";
import { HosteManagementPage } from "@/features/settings/components/settings.hoste.management";

export const metadata: Metadata = { title: "Hosté Management | Hosté Admin" };

export default function Page() {
  return <HosteManagementPage />;
}
