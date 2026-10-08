import type { Metadata } from "next";
import { UsersAccessPage } from "@/features/settings/components/settings.users.access";

export const metadata: Metadata = { title: "Users & Access | Hosté Admin" };

export default function UsersAccessRoute() {
  return <UsersAccessPage />;
}
