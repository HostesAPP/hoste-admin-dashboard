import type { Metadata } from "next";
import { ProfileDocumentsView } from "@/features/profiles";

export const metadata: Metadata = {
  title: "Documents & Verification Inspection | Hosté Admin Dashboard",
  description: "Inspect government ID, training certificates, photo match comparison, and verification checklist.",
};

interface ProfileDocumentsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfileDocumentsPage({
  params,
}: ProfileDocumentsPageProps) {
  const { id } = await params;
  return <ProfileDocumentsView profileId={id} />;
}
