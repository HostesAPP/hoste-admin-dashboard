import type { Metadata } from "next";
import { SupportTicketsView } from "@/features/support-tickets";

export const metadata: Metadata = {
  title: "Support Tickets | Hosté Admin",
  description: "Escalated customer support tickets from Lade AI to human support",
};

export default function SupportTicketsPage() {
  return <SupportTicketsView />;
}
