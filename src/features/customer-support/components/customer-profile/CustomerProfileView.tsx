// features/customer-support/components/customer-profile/CustomerProfileView.tsx

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CustomerProfileHeader } from "./CustomerProfileHeader";
import { CustomerProfileLeftCard } from "./CustomerProfileLeftCard";
import { CustomerProfileOverviewTab } from "./CustomerProfileOverviewTab";
import { CustomerProfileRightColumn } from "./CustomerProfileRightColumn";
import {
  useCustomerProfile,
  useUpdateCustomerProfileStatus,
  useAddCustomerInternalNote,
} from "../../hooks/customer-support.hooks";
import { CustomerProfileData } from "../../customer-support.types";

interface CustomerProfileViewProps {
  customerId: string;
}

export function CustomerProfileView({ customerId }: CustomerProfileViewProps) {
  const router = useRouter();
  const { data: profile, isLoading } = useCustomerProfile(customerId);
  const updateStatusMutation = useUpdateCustomerProfileStatus();
  const addNoteMutation = useAddCustomerInternalNote();

  if (isLoading || !profile) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <CustomerProfileHeader />
        <main className="flex-1 p-8 mx-auto w-full space-y-6">
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1 h-96 bg-muted animate-pulse rounded-2xl" />
            <div className="col-span-2 h-96 bg-muted animate-pulse rounded-2xl" />
            <div className="col-span-1 h-96 bg-muted animate-pulse rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  const handleUpdateStatus = (
    status: CustomerProfileData["customerStatus"],
    reason?: string
  ) => {
    updateStatusMutation.mutate({
      id: profile.id,
      status,
      reason,
    });
  };

  const handleAddNote = (content: string) => {
    addNoteMutation.mutate({
      id: profile.id,
      content,
    });
  };

  const handleSendMessage = () => {
    router.push(`/customer-support/${profile.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Header */}
      <CustomerProfileHeader backHref="/customer-support" />
      
      {/* 3-Column Main Workspace */}
      <main className="flex-1 p-6 mx-auto w-full">
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Left Column (3/12 ~ 25%): Identity, Contact, Account Summary */}
          <div className="col-span-3">
            <CustomerProfileLeftCard profile={profile} />
          </div>

          {/* Middle Column (6/12 ~ 50%): Tabs, Overview Stats, About, Recent Activity & Support Summary */}
          <div className="col-span-6">
            <CustomerProfileOverviewTab profile={profile} />
          </div>

          {/* Right Column (3/12 ~ 25%): Quick Actions, Internal Notes, Account Status */}
          <div className="lg:col-span-3">
            <CustomerProfileRightColumn
              profile={profile}
              onSendMessage={handleSendMessage}
              onUpdateStatus={handleUpdateStatus}
              onAddNote={handleAddNote}
              isUpdatingStatus={updateStatusMutation.isPending}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
