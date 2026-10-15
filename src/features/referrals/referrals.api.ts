import { apiClient } from "@/lib/api-client";

export class ReferralsApi {
  static async getReferral(id: string) {
    return apiClient(`/api/v1/referrals/${id}`, {
      method: "GET",
    });
  }
  static async getReferrals(
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
      `/api/v1/referrals/admin?${queryString ? queryString : ""}`,
      {
        method: "GET",
      },
    );
  }

  static async getReferralOverview() {
    return apiClient("/api/v1/referrals/admin/overview", {
      method: "GET",
    });
  }

  static async disburseReferralEarning(id: string) {
    return apiClient(`/api/v1/referrals/admin/${id}/disburse`, {
      method: "POST",
    });
  }
}
