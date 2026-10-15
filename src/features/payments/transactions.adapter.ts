import {
  MOCK_TRANSACTIONS,
  MOCK_TRANSACTION_PERIOD_END,
} from "./data/transactions.data";
import type { PaymentFilterSchema } from "./schemas/payment.filter";
import type { PaymentTransaction } from "./types/transactions.types";
export interface TransactionsAdapter {
  list: (
    filters: PaymentFilterSchema,
    page: number,
    pageSize: number,
  ) => Promise<{ rows: PaymentTransaction[]; total: number }>;
  retry: (id: string) => Promise<{ message: string }>;
}
export const mockTransactionsAdapter: TransactionsAdapter = {
  async list(filters, page, pageSize) {
    const end = Date.parse(`${MOCK_TRANSACTION_PERIOD_END}T23:59:59.999Z`);
    const days =
      filters.date === "TODAY" ? 1 : filters.date === "LAST_7_DAYS" ? 7 : 30;
    const start = end - days * 86400000 + 1;
    const query = filters.search.trim().toLowerCase();
    const rows = MOCK_TRANSACTIONS.filter((row) => {
      const date = Date.parse(row.payment.createdAt);
      return (
        date >= start &&
        date <= end &&
        (filters.status === "ALL" ||
          row.payment.status.toUpperCase() === filters.status) &&
        (filters.method === "ALL" || row.method === filters.method) &&
        `${row.payment.referenceId} ${row.payment.payerProfileName} ${row.customerEmail ?? ""} ${row.bookingReference ?? ""}`
          .toLowerCase()
          .includes(query)
      );
    });
    return structuredClone({
      rows: rows.slice((page - 1) * pageSize, page * pageSize),
      total: rows.length,
    });
  },
  async retry(id) {
    const row = MOCK_TRANSACTIONS.find((item) => item.payment.id === id);
    if (!row?.canRetry) throw new Error("This payment cannot be retried.");
    return {
      message:
        "Retry checked in this preview. No payment was sent to the gateway.",
    };
  },
};
