// app/(dashboard)/customer-support/[conversationId]/escalate/page.tsx

import { EscalateDisputeView } from "@/features/customer-support";

interface PageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export const metadata = {
  title: "Escalate to Dispute | Hosté Admin",
  description: "Review customer issue and escalate to the dispute investigation team",
};

export default async function EscalateDisputePage({ params }: PageProps) {
  const { conversationId } = await params;
  return <EscalateDisputeView conversationId={conversationId} />;
}
