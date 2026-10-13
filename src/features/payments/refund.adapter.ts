import { MOCK_REFUND_CONTEXTS } from "./data/transactions.data";
import { createRefundSchema } from "./schemas/refund.schema";
import type {
  RefundAdapter,
  RefundContext,
  RefundDraft,
} from "./types/transactions.types";
export function createMockRefundAdapter(
  contexts: readonly RefundContext[] = MOCK_REFUND_CONTEXTS,
): RefundAdapter {
  const snapshots = structuredClone(contexts);
  const validate = (paymentId: string, draft: RefundDraft) => {
    const context = snapshots.find(
      (item) => item.transaction.payment.id === paymentId,
    );
    if (!context) throw new Error("Payment was not found.");
    if (!context.transaction.canRefund)
      throw new Error("This payment is not eligible for a refund.");
    return createRefundSchema(
      context.availableAmount,
      context.reasons.map((reason) => reason.value),
    ).parse(draft);
  };
  return {
    async load(paymentId) {
      return structuredClone(
        snapshots.find((item) => item.transaction.payment.id === paymentId) ??
          null,
      );
    },
    async quote(paymentId, draft) {
      const validated = validate(paymentId, draft);
      // Production quotes belong to the backend; the existing mock refund contract has no fee.
      return {
        amount: Number(validated.amount),
        processingFee: 0,
        totalRefund: Number(validated.amount),
      };
    },
    async review(paymentId, draft) {
      const validated = validate(paymentId, draft);
      const context = snapshots.find(
        (item) => item.transaction.payment.id === paymentId,
      )!;
      return {
        message: "Refund reviewed in this preview. No money was refunded.",
        receipt: {
          preview: true,
          reference: `PREVIEW-${context.transaction.payment.referenceId}`,
          paymentReference: context.transaction.payment.referenceId,
          customer: context.transaction.payment.payerProfileName,
          customerEmail: context.transaction.customerEmail,
          amountPaid: context.transaction.payment.grossAmount,
          booking: structuredClone(context.booking),
          method: context.transaction.method,
          destination: validated.destination,
          reason: context.reasons.find(
            (reason) => reason.value === validated.reason,
          )!.label,
          description: validated.description,
          amount: Number(validated.amount),
          processingFee: 0,
          totalRefund: Number(validated.amount),
          createdAt: new Date().toISOString(),
          delivery: "Not submitted (preview)",
        },
      };
    },
  };
}
export const mockRefundAdapter = createMockRefundAdapter();
