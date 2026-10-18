import { notFound } from "next/navigation";
import { BOOKINGS_DATA } from "@/features/bookings/data/bookings.data";
import { PaymentDetails } from "@/features/payments/components/PaymentDetails";
import { mockRefundAdapter } from "@/features/payments/refund.adapter";

export default async function PaymentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await mockRefundAdapter.load(id);
  const booking = BOOKINGS_DATA.find(
    (item) => item.id === context?.transaction.bookingId,
  );
  if (!context || !booking) notFound();
  return <PaymentDetails booking={booking} context={context} />;
}
