import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RefundPage } from "@/features/payments/components/RefundPage";
import { mockRefundAdapter } from "@/features/payments/refund.adapter";
export const metadata: Metadata = {
  title: "Issue Refund | Hosté Admin Dashboard",
};
export default async function IssueRefundPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await mockRefundAdapter.load(id);
  if (!context) notFound();
  return <RefundPage context={context} />;
}
