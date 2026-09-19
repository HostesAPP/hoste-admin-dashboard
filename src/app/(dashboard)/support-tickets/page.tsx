import type { Metadata } from "next";
import { SupportTicketsView } from "@/features/support-tickets";

export const metadata: Metadata = {
  title: "Support Tickets | Hosté Admin",
  description: "Escalated customer support tickets from Lade AI to human support",
};

// TODO: pending product confirmation — see UI/UX patch §4/§5 regarding Support Tickets and Customer Support split vs connected escalation flow
export default function SupportTicketsPage() {
  return <SupportTicketsView />;
}
