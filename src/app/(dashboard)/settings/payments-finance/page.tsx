import type { Metadata } from "next";
import { PaymentFinanceSettingsPage } from "@/features/settings/components/settings.payments.finance";

export const metadata: Metadata = {
  title: "Payment & Finance Settings | Hosté Admin",
};
export default function Page() {
  return <PaymentFinanceSettingsPage />;
}
