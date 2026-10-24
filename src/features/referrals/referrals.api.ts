import { apiClient } from "@/lib/api-client";
import { ReferralParams } from "./types/referrals.types";
import { ReferrersParams } from "./types/referrers.types";
import { PayoutParams } from "./types/payouts.types";
import { EarningsParams } from "./types/earnings.types";

export class ReferralsApi {
  static async getReferral(id: string) {
    return apiClient(`/api/v1/referrals/${id}`, {
      method: "GET",
    });
  }
  static async getReferrals(params: ReferralParams) {
    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        query.set(key, String(value));
      }
    }
    const queryString = query.toString();
    return apiClient(
      `/api/v1/referrals/admin${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
      },
    );
  }

  static async getReferralOverview(days: number) {
    return apiClient(
      `/api/v1/referrals/admin/overview${days ? `?${days}` : ""}`,
      {
        method: "GET",
      },
    );
  }

  static async getTopReferrers(page: number, limit: number) {
    return apiClient(
      `/api/v1/referrals/admin/top-referrers?page=${page}&limit=${limit}`,
    );
  }

  static async getReferrers(params: ReferrersParams) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        query.set(key, String(value));
      }
    }
    const queryString = query.toString();
    return apiClient(
      `/api/v1/referrals/admin/referrers${queryString ? `?${queryString}` : ""}`,
    );
  }
  static async getPayouts(params: PayoutParams) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        query.set(key, String(value));
      }
    }
    const queryString = query.toString();
    return apiClient(
      `/api/v1/referrals/admin/payouts${queryString ? `?${queryString}` : ""}`,
    );
  }
  static async getEarnings(params: EarningsParams) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        query.set(key, String(value));
      }
    }
    const queryString = query.toString();
    return apiClient(
      `/api/v1/referrals/admin/earnings${queryString ? `?${queryString}` : ""}`,
    );
  }

  static async disburseReferralEarning(id: string) {
    return apiClient(`/api/v1/referrals/admin/${id}/disburse`, {
      method: "POST",
    });
  }
}
