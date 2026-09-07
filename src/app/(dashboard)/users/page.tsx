import type { Metadata } from "next";
import { UsersView } from "@/features/users";

export const metadata: Metadata = {
  title: "Users | Hosté Admin Dashboard",
  description: "All Hostes & Brands — search, view, suspend or ban",
};

export default function UsersPage() {
  return <UsersView />;
}
