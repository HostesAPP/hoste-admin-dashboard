// app/(dashboard)/customer-support/[conversationId]/page.tsx

import { CustomerConversationDetailsView } from "@/features/customer-support";

interface PageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export const metadata = {
  title: "Chat Conversation | Hosté Admin",
  description: "Customer support conversation details and customer overview",
};

export default async function CustomerConversationPage({ params }: PageProps) {
  const { conversationId } = await params;
  return <CustomerConversationDetailsView conversationId={conversationId} />;
}
