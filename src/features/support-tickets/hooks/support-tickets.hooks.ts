// features/support-tickets/hooks/support-tickets.hooks.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSupportTickets,
  fetchSupportTicketById,
  fetchSupportTicketStats,
  updateSupportTicketStatus,
  assignSupportTicket,
  addSupportTicketMessage,
} from "../api/support-tickets.api";
import {
  SupportTicketFilterParams,
  TicketStatus,
  TicketMessage,
} from "../types/support-tickets.types";

export const TICKETS_QUERY_KEYS = {
  all: ["support-tickets"] as const,
  list: (params?: SupportTicketFilterParams) => ["support-tickets", "list", params] as const,
  detail: (id: string) => ["support-tickets", "detail", id] as const,
  stats: () => ["support-tickets", "stats"] as const,
};

export function useSupportTickets(params?: SupportTicketFilterParams) {
  return useQuery({
    queryKey: TICKETS_QUERY_KEYS.list(params),
    queryFn: () => fetchSupportTickets(params),
  });
}

export function useSupportTicket(id: string) {
  return useQuery({
    queryKey: TICKETS_QUERY_KEYS.detail(id),
    queryFn: () => fetchSupportTicketById(id),
    enabled: !!id,
  });
}

export function useSupportTicketStats() {
  return useQuery({
    queryKey: TICKETS_QUERY_KEYS.stats(),
    queryFn: () => fetchSupportTicketStats(),
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      updateSupportTicketStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEYS.stats() });
    },
  });
}

export function useAssignTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, staffId }: { id: string; staffId: string }) =>
      assignSupportTicket(id, staffId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEYS.stats() });
    },
  });
}

export function useAddTicketMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: TicketMessage }) =>
      addSupportTicketMessage(id, message),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEYS.all });
    },
  });
}
