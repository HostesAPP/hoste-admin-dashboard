import { apiClient } from "@/lib/api-client";
import { RefundDraft } from "./types/transactions.types";

export class PaymentApi {
  //PAYMENTS
  static async getPayments(
    params: Record<string, string | number | boolean | null | undefined> = {},
  ) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        query.set(key, String(value));
      }
    }
    const queryString = query.toString();
    return apiClient(
      `/admin/finance/payments${queryString ? `?${queryString}` : ""}`,
    );
  }

  static getPayment(paymentId: string) {
    return apiClient(`/admin/finance/payments/${paymentId}`);
  }

  static async getRefundableSummary(paymentId: string) {
    return apiClient(`/admin/finance/payments/${paymentId}/refundable`);
  }

  //PAYOUTS

  static async getPayouts(
    params: Record<string, string | number | boolean | null | undefined> = {},
  ) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        query.set(key, String(value));
      }
    }
    const queryString = query.toString();
    return apiClient(
      `/admin/finance/payouts${queryString ? `?${queryString}` : ""}`,
    );
  }

  static async getPayout(payoutId: string) {
    return apiClient(`/admin/finance/payouts/${payoutId}`);
  }

  static async releasePayout(engagementId: string) {
    return apiClient(
      `/admin/finance/engagements/${engagementId}/release-payouts`,
      {
        method: "POST",
      },
    );
  }

  static async verifyPayout(payoutId: string) {
    return apiClient(`/admin/finance/payouts/${payoutId}/verify`, {
      method: "POST",
    });
  }

  // REFUNDS

  static async createRefund(refund: RefundDraft) {
    return apiClient("/admin/finance/refunds", {
      method: "POST",
      body: JSON.stringify(refund),
    });
  }
  static async createCancellationRefund(engagementId: string) {
    return apiClient(
      `/admin/finance/engagements/${engagementId}/cancellation-refund`,
      { method: "POST" },
    );
  }

  static async processRefund(refundId: string) {
    return apiClient(`/admin/finance/refunds/${refundId}/process`, {
      method: "POST",
    });
  }
  static async getRefunds(
    params: Record<string, string | number | boolean | null | undefined> = {},
  ) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        query.set(key, String(value));
      }
    }
    const queryString = query.toString();
    return apiClient(
      `/admin/finance/refunds${queryString ? `?${queryString}` : ""}`,
    );
  }

  static async getRefund(refundId: string) {
    return apiClient(`/admin/finance/refund/${refundId}`);
  }

  static async verifyRefund(refundId: string) {
    return apiClient(`/admin/finance/refunds/${refundId}/verify`, {
      method: "POST",
    });
  }
}
