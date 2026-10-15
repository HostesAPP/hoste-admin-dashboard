import { useQuery, useMutation } from "@tanstack/react-query";
import { PaymentApi } from "../payment.refund.api";
import { RefundDraft } from "../types/transactions.types";

export function useRefunds(
  params: Record<string, string | number | boolean | null | undefined> = {},
) {
  return useQuery({
    queryKey: ["refunds", "list", params],
    queryFn: () => PaymentApi.getRefunds(params),
  });
}

export function useRefund(refundId: string) {
  return useQuery({
    queryKey: ["refunds", "details", refundId],
    queryFn: () => PaymentApi.getRefund(refundId),
  });
}

export function useCreateRefund() {
  return useMutation({
    mutationFn: (refund: RefundDraft) => PaymentApi.createRefund(refund),
  });
}
