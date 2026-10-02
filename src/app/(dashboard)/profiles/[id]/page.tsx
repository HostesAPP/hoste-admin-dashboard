import type { Metadata } from "next";
import { ProfileDetailsView } from "@/features/profiles";

export const metadata: Metadata = {
  title: "Profile Details | Hosté Admin Dashboard",
  description: "View and review detailed profile information and KYC verification documents.",
};

interface ProfileDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfileDetailsPage({
  params,
}: ProfileDetailsPageProps) {
  const { id } = await params;
  return <ProfileDetailsView profileId={id} />;
}
