import type { Metadata } from "next";
import { TicketDetailsView } from "@/features/support-tickets";

export const metadata: Metadata = {
  title: "Ticket Details | Hosté Admin",
  description: "View and manage escalated support ticket details",
};

interface TicketDetailsPageProps {
  params: Promise<{
    ticketId: string;
  }>;
}

export default async function TicketDetailsPage({
  params,
}: TicketDetailsPageProps) {
  const { ticketId } = await params;

  return <TicketDetailsView ticketId={ticketId} />;
}
