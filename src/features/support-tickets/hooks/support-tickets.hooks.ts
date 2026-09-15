// features/support-tickets/hooks/support-tickets.hooks.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSupportTickets,
  fetchSupportTicketById,
  fetchSupportTicketStats,
  updateSupportTicketStatus,
  addSupportTicketMessage,
} from "../api/support-tickets.api";
import {
  SupportTicketFilterParams,
  TicketStatus,
  TicketMessage,
} from "../types/support-tickets.types";

export function useSupportTickets(params?: SupportTicketFilterParams) {
  return useQuery({
    queryKey: ["support-tickets", params],
    queryFn: () => fetchSupportTickets(params),
  });
}

export function useSupportTicket(id: string) {
  return useQuery({
    queryKey: ["support-ticket", id],
    queryFn: () => fetchSupportTicketById(id),
    enabled: !!id,
  });
}

export function useSupportTicketStats() {
  return useQuery({
    queryKey: ["support-tickets-stats"],
    queryFn: () => fetchSupportTicketStats(),
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      updateSupportTicketStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["support-ticket", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["support-tickets-stats"] });
    },
  });
}

export function useAddTicketMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: TicketMessage }) =>
      addSupportTicketMessage(id, message),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["support-ticket", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
}
