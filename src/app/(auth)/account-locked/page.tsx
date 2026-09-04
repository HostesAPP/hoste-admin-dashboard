import type { Metadata } from "next";
import { AccountLocked } from "@/features/auth";

export const metadata: Metadata = {
  title: "Account Locked | Hosté Admin",
  description: "Staff account temporarily locked due to failed login attempts.",
};

export default function AccountLockedPage() {
  return <AccountLocked />;
}
