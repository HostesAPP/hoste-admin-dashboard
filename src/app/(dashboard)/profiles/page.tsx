import type { Metadata } from "next";
import { ProfilesView } from "@/features/profiles";

export const metadata: Metadata = {
  title: "Profiles | Hosté Admin Dashboard",
  description: "Host profile approvals & account management",
};

export default function ProfilesPage() {
  return <ProfilesView />;
}
