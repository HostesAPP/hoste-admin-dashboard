import type { Metadata } from "next";
import { RevenueDetailsView } from "@/features/revenue";

interface RevenueDetailsPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Revenue Details | Hosté Admin Console",
  description: "Transaction overview, payment journey, and detailed financial breakdown.",
};

export default async function RevenueDetailsPage({
  params,
}: RevenueDetailsPageProps) {
  const { id } = await params;
  return <RevenueDetailsView id={id} />;
}
