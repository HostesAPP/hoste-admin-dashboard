import { MOCK_TRANSACTIONS } from "./data/transactions.data";
import { MOCK_BOOKINGS } from "../bookings/data/bookings.data";
import { MOCK_REFUNDS } from "./data/payments.data";
import {
    MOCK_REFUND_AVAILABLE_AMOUNTS,
    MOCK_REFUND_REASONS,
    MOCK_REFUND_POLICY,
} from "./data/refunds.data";
import { createRefundSchema } from "./schemas/refund.schema";
import type {
    RefundAdapter,
    RefundContext,
    RefundDraft,
} from "./types/transactions.types";

export function createMockRefundAdapter(): RefundAdapter {
    const getContext = (identifier: string): RefundContext | null => {
        const transaction = MOCK_TRANSACTIONS.find(
            (item) =>
                item.payment.id === identifier ||
                item.bookingId === identifier ||
                item.bookingReference === identifier ||
                item.payment.referenceId === identifier,
        );
        if (!transaction) return null;

        const booking = MOCK_BOOKINGS.find(
            (item) => item.id === transaction.bookingId,
        );

        return {
            transaction,
            availableAmount:
                MOCK_REFUND_AVAILABLE_AMOUNTS[transaction.payment.id] ?? 0,
            booking: booking
                ? {
                    reference: booking.bookingCode,
                    title: booking.eventName,
                    status: booking.status,
                    date: booking.eventDate,
                    location: booking.location,
                    hostCount: null,
                    imageUrl: null,
                }
                : null,
            reasons: MOCK_REFUND_REASONS,
            policy: MOCK_REFUND_POLICY,
            recentRefunds: MOCK_REFUNDS.filter(
                (refund) => refund.paymentId === transaction.payment.id,
            ).map((refund) => ({
                id: refund.id,
                reference: refund.referenceId,
                amount: refund.amount,
                date: refund.createdAt,
                status: null,
            })),
        };
    };

    const validate = (identifier: string, draft: RefundDraft) => {
        const context = getContext(identifier);
        if (!context) throw new Error("Payment was not found.");
        if (!context.transaction.canRefund)
            throw new Error("This payment is not eligible for a refund.");
        const validated = createRefundSchema(
            context.availableAmount,
            context.reasons.map((reason) => reason.value),
        ).parse(draft);
        return { context, validated };
    };

    return {
        async load(identifier) {
            return structuredClone(getContext(identifier));
        },
        async quote(identifier, draft) {
            const { validated } = validate(identifier, draft);
            // Production quotes belong to the backend; the existing mock refund contract has no fee.
            return {
                amount: Number(validated.amount),
                processingFee: 0,
                totalRefund: Number(validated.amount),
            };
        },
        async review(identifier, draft) {
            const { context, validated } = validate(identifier, draft);
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
                    reason:
                        context.reasons.find((reason) => reason.value === validated.reason)
                            ?.label ?? validated.reason,
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