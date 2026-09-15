// app/(dashboard)/customer-support/profile/[customerId]/page.tsx

import { CustomerProfileView } from "@/features/customer-support";

interface PageProps {
  params: Promise<{
    customerId: string;
  }>;
}

export const metadata = {
  title: "Customer Profile | Hosté Admin",
  description: "Customer account details, recent activity, and support summary",
};

export default async function CustomerProfilePage({ params }: PageProps) {
  const { customerId } = await params;
  return <CustomerProfileView customerId={customerId} />;
}
