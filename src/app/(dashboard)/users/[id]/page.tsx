import type { Metadata } from "next";
import { UserDetailsView } from "@/features/users";

export const metadata: Metadata = {
  title: "User Details | Hosté Admin Dashboard",
  description: "View user profile, permissions, activity, and administrative controls.",
};

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const resolvedParams = await params;
  const userId = resolvedParams?.id || "USR-00001";

  return <UserDetailsView userId={userId} />;
}
