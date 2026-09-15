// app/(dashboard)/customer-support/escalate/page.tsx

import { EscalateDisputeView } from "@/features/customer-support";

export const metadata = {
  title: "Escalate to Dispute | Hosté Admin",
  description: "Review customer issue and escalate to the dispute investigation team",
};

export default function GeneralEscalateDisputePage() {
  return <EscalateDisputeView conversationId="conv-001" />;
}
