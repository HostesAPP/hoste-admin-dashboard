"use client";

import React, { useState } from "react";
import { X, LoaderCircle } from "lucide-react";
import NotificationSentModal from "@/features/notifications/components/modals/NotificationSentModal";

interface SendTestNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend?: (recipient: string) => void | Promise<void>;
}

export default function SendTestNotificationModal({
  isOpen,
  onClose,
  onSend,
}: SendTestNotificationModalProps) {
  const [recipient, setRecipient] = useState("");
  const [isSentModalOpen, setIsSentModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen && !isSentModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedRecipient = recipient.trim();

    if (!trimmedRecipient) {
      setError("Please enter an email address or username.");
      return;
    }

    setIsSending(true);
    setError("");

    try {
      if (onSend) {
        // The parent function should make the API request.
        await onSend(trimmedRecipient);
      } else {
        // Change this endpoint to match your backend API route.
        const response = await fetch("/api/notifications/test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipient: trimmedRecipient,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message || data.error || "Failed to send test notification.",
          );
        }
      }

      setRecipient("");
      onClose();
      setIsSentModalOpen(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={onClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="send-test-title"
            className="relative w-full max-w-[570px] rounded-[32px] border border-[#D9DDE3] bg-white p-10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
              <h2
                id="send-test-title"
                className="text-[24px] font-bold tracking-tight text-[#171D2B]"
              >
                Send Test Notification
              </h2>

              <button
                type="button"
                onClick={onClose}
                disabled={isSending}
                className="rounded-full p-1 text-[#94a3b8] transition hover:bg-[#f1f5f9] hover:text-[#64748b] disabled:opacity-50"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Subtitle */}
            <p className="mt-6 text-[17px] leading-[27px] text-[#737D90]">
              Send a test notification to verify how it will look on users&apos;
              devices.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-10">
              <label
                htmlFor="test-recipient"
                className="block text-[17px] font-medium text-[#3D4759]"
              >
                Send to (Email or User)
              </label>

              <input
                id="test-recipient"
                type="text"
                value={recipient}
                onChange={(e) => {
                  setRecipient(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter email address or user name"
                required
                disabled={isSending}
                className="mt-4 h-[74px] w-full rounded-[17px] border-2 border-[#D5D9E0] px-5 text-[17px] text-[#171D2B] placeholder:text-[#9AA3B3] outline-none transition focus:border-[#006837] focus:ring-1 focus:ring-[#006837] disabled:bg-gray-50"
              />

              {/* Server error */}
              {error && (
                <p
                  role="alert"
                  className="mt-3 text-sm font-medium text-red-600"
                >
                  {error}
                </p>
              )}

              {/* Footer actions */}
              <div className="mt-16 flex items-center gap-5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSending}
                  className="h-[79px] flex-1 rounded-[17px] border-2 border-[#D5D9E0] text-[17px] font-medium text-[#4A5363] transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSending || !recipient.trim()}
                  className="flex h-[79px] flex-1 items-center justify-center gap-2 rounded-[17px] bg-[#006837] text-[17px] font-bold text-white transition hover:bg-[#00552D] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSending && (
                    <LoaderCircle size={20} className="animate-spin" />
                  )}
                  {isSending ? "Sending..." : "Send Test"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success modal opens only after a successful request */}
      <NotificationSentModal
        isOpen={isSentModalOpen}
        onClose={() => setIsSentModalOpen(false)}
      />
    </>
  );
}
