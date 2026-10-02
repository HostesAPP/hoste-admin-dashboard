import type { Metadata } from "next";
import { ProfileDocumentsView } from "@/features/profiles";

export const metadata: Metadata = {
  title: "Documents & Verification Inspection | Hosté Admin Dashboard",
  description: "Inspect government ID, training certificates, photo match comparison, and verification checklist.",
};

interface ProfileVerificationPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfileVerificationPage({
  params,
}: ProfileVerificationPageProps) {
  const { id } = await params;
  return <ProfileDocumentsView profileId={id} />;
}
