// features/revenue/api/revenue.api.ts

import { RevenueOverviewData, RevenueTransactionDetails } from "../revenue.types";
import {
  MOCK_REVENUE_OVERVIEW_DATA,
  MOCK_REVENUE_TRANSACTION_DETAILS,
} from "../data/revenue.data";

export async function fetchRevenueOverview(): Promise<RevenueOverviewData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_REVENUE_OVERVIEW_DATA);
    }, 100);
  });
}

export async function fetchRevenueTransactionDetails(
  id: string
): Promise<RevenueTransactionDetails> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...MOCK_REVENUE_TRANSACTION_DETAILS,
        transactionId: id.startsWith("TRX-") ? id : MOCK_REVENUE_TRANSACTION_DETAILS.transactionId,
      });
    }, 100);
  });
}

