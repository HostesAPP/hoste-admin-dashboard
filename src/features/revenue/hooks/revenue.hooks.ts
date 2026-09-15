// features/revenue/hooks/revenue.hooks.ts

import { useQuery } from "@tanstack/react-query";
import {
  fetchRevenueOverview,
  fetchRevenueTransactionDetails,
} from "../api/revenue.api";

export function useRevenueOverview() {
  return useQuery({
    queryKey: ["revenue-overview"],
    queryFn: () => fetchRevenueOverview(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRevenueTransactionDetails(id: string) {
  return useQuery({
    queryKey: ["revenue-transaction-details", id],
    queryFn: () => fetchRevenueTransactionDetails(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

