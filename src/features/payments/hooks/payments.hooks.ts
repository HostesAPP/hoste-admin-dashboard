import { useQuery, useMutation } from "@tanstack/react-query";
import { PaymentApi } from "../payment.refund.api";

export function usePayments(
  params: Record<string, string | number | boolean | null | undefined> = {},
) {
  return useQuery({
    queryKey: ["payments", "list", params],
    queryFn: () => PaymentApi.getPayments(params),
  });
}

export function usePayment(paymentId: string) {
  return useQuery({
    queryKey: ["payments", "details", paymentId],
    queryFn: () => PaymentApi.getPayment(paymentId),
  });
}

export function usePayouts(
  params: Record<string, string | number | boolean | null | undefined> = {},
) {
  return useQuery({
    queryKey: ["payouts", "list", params],
    queryFn: () => PaymentApi.getPayouts(params),
  });
}

export function usePayout(payoutId: string) {
  return useQuery({
    queryKey: ["payouts", "details", payoutId],
    queryFn: () => PaymentApi.getPayout(payoutId),
  });
}

export function useReleasePayout() {
  return useMutation({
    mutationFn: (engagementId: string) =>
      PaymentApi.releasePayout(engagementId),
  });
}
