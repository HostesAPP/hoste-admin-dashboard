import type { Metadata } from "next";
import { ReviewPage } from "@/features/referrals/components/ReviewPage";

export const metadata: Metadata = { title: "Referral Overview | Hosté Admin" };

export default function ReferralsPage() {
  return <ReviewPage />;
}
