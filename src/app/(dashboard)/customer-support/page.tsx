// app/(dashboard)/customer-support/page.tsx

import { CustomerSupportView } from "@/features/customer-support";

export const metadata = {
  title: "Customer Support | Hosté Admin",
  description: "Manage customer conversations and resolve issues",
};

export default function CustomerSupportPage() {
  return <CustomerSupportView />;
}
