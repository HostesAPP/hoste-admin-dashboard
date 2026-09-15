// features/customer-support/hooks/customer-support.hooks.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCustomerConversations,
  fetchCustomerConversationById,
  fetchCustomerSupportStats,
  createCustomerConversation,
  updateCustomerConversationStatus,
  addCustomerConversationMessage,
  fetchCustomerProfile,
  updateCustomerProfileStatus,
  addCustomerInternalNote,
} from "../api/customer-support.api";
import {
  ConversationFilterParams,
  CustomerConversation,
  ConversationStatus,
  CustomerMessage,
  CustomerProfileData,
} from "../customer-support.types";

export function useCustomerConversations(params?: ConversationFilterParams) {
  return useQuery({
    queryKey: ["customer-conversations", params],
    queryFn: () => fetchCustomerConversations(params),
  });
}

export function useCustomerConversation(id: string) {
  return useQuery({
    queryKey: ["customer-conversation", id],
    queryFn: () => fetchCustomerConversationById(id),
    enabled: !!id,
  });
}

export function useCustomerSupportStats() {
  return useQuery({
    queryKey: ["customer-support-stats"],
    queryFn: () => fetchCustomerSupportStats(),
  });
}

export function useUpdateCustomerConversationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: ConversationStatus;
    }) => updateCustomerConversationStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customer-conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["customer-conversation", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["customer-support-stats"] });
    },
  });
}

export function useAddCustomerConversationMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      message,
    }: {
      id: string;
      message: CustomerMessage;
    }) => addCustomerConversationMessage(id, message),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customer-conversation", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["customer-conversations"] });
    },
  });
}

export function useCreateCustomerConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newConv: Partial<CustomerConversation>) =>
      createCustomerConversation(newConv),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-conversations"] });
      queryClient.invalidateQueries({ queryKey: ["customer-support-stats"] });
    },
  });
}

export function useCustomerProfile(id: string) {
  return useQuery({
    queryKey: ["customer-profile", id],
    queryFn: () => fetchCustomerProfile(id),
    enabled: !!id,
  });
}

export function useUpdateCustomerProfileStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: CustomerProfileData["customerStatus"];
      reason?: string;
    }) => updateCustomerProfileStatus(id, status, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customer-profile", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["customer-conversations"] });
    },
  });
}

export function useAddCustomerInternalNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      content,
    }: {
      id: string;
      content: string;
    }) => addCustomerInternalNote(id, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customer-profile", variables.id],
      });
    },
  });
}

export function useEscalateToDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: import("../customer-support.types").EscalateDisputePayload) =>
      import("../api/customer-support.api").then((m) =>
        m.escalateConversationToDispute(payload)
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customer-conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["customer-conversation", variables.conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["customer-support-stats"] });
    },
  });
}

