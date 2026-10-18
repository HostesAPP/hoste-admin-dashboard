import { PaymentsLoadingState } from "@/features/payments/components/payments.states";

export default function LoadingPayments() {
  return (
    <>
      <PaymentHeader searchQuery="" />
      <div className="container mx-auto px-6">
        <PaymentsLoadingState />
      </div>
    </>
  );
}
import { PaymentHeader } from "@/features/payments/components/PaymentHeader";
