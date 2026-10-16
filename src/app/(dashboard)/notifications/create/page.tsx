"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  ArrowLeft,
  Bell,
  Search,
  Filter,
  Calendar,
  UploadCloud,
  Edit3,
  Send,
  Info,
  CheckCircle2,
  Clock,
  Check,
  Wifi,
  Battery,
  Smartphone,
  Monitor,
  MessageSquare,
  Menu,
  LoaderCircle,
  X,
} from "lucide-react";
import SendTestNotificationModal from "@/features/notifications/components/modals/SendTestNotificationModal";
import SavedAsDraftModal from "@/features/notifications/components/modals/SavedAsDraftModal";
import ScheduleNotificationModal from "@/features/notifications/components/modals/ScheduleNotificationModal";

type Audience = "all" | "customers" | "hostes" | "custom";
type NotificationType = "push" | "in-app";
type SendTime = "now" | "later";

type ApiFeedback = {
  type: "success" | "error";
  message: string;
};

const TEST_API_URL = process.env.NEXT_PUBLIC_NOTIFICATION_TEST_API_URL;

const SEND_API_URL = process.env.NEXT_PUBLIC_NOTIFICATION_SEND_API_URL;

export default function CreatePushNotificationPage() {
  const [title, setTitle] = useState("Important Update: New Booking Feature");

  const [message, setMessage] = useState(
    "We're excited to introduce group booking! You can now book multiple Hostés at once for your event. Try it today.",
  );

  const [audience, setAudience] = useState<Audience>("all");
  const [notificationType, setNotificationType] =
    useState<NotificationType>("push");

  const [sendTime, setSendTime] = useState<SendTime>("now");
  const [link, setLink] = useState("");

  const [scheduledDateTime, setScheduledDateTime] = useState<{
    date: string;
    time: string;
  } | null>(null);

  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);

  const [feedback, setFeedback] = useState<ApiFeedback | null>(null);

  const audienceLabels: Record<Audience, string> = {
    all: "All Users",
    customers: "Customers Only",
    hostes: "Hostés Only",
    custom: "Custom Segment",
  };

  const validateForm = () => {
    if (!title.trim()) {
      setFeedback({
        type: "error",
        message: "Please enter a notification title.",
      });
      return false;
    }

    if (!message.trim()) {
      setFeedback({
        type: "error",
        message: "Please enter a notification message.",
      });
      return false;
    }

    if (link.trim()) {
      try {
        const parsedUrl = new URL(link);

        if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
          throw new Error("Invalid protocol");
        }
      } catch {
        setFeedback({
          type: "error",
          message: "Enter a valid HTTP or HTTPS link, or leave it empty.",
        });
        return false;
      }
    }

    return true;
  };

  const getErrorMessage = (data: unknown, fallback: string): string => {
    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }

    if (
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof data.error === "string"
    ) {
      return data.error;
    }

    return fallback;
  };

  // TEST ACTION: sends only to the explicitly supplied test recipient.
  const handleSendTest = async (recipient: string) => {
    if (!validateForm()) {
      throw new Error("Please correct the notification details.");
    }

    if (!TEST_API_URL) {
      const error = new Error(
        "Test notification API is not configured. Set NEXT_PUBLIC_NOTIFICATION_TEST_API_URL.",
      );

      setFeedback({ type: "error", message: error.message });
      throw error;
    }

    setIsSendingTest(true);
    setFeedback(null);

    try {
      const response = await fetch(TEST_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: recipient.trim(),
          title: title.trim(),
          message: message.trim(),
          notificationType,
          link: link.trim() || undefined,
          test: true,
        }),
      });

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "The test notification could not be sent."),
        );
      }

      setFeedback({
        type: "success",
        message: `Test notification successfully submitted to ${recipient.trim()}.`,
      });

      setIsTestModalOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to send the test notification.";

      setFeedback({ type: "error", message: errorMessage });

      // Keep the modal open so the admin can retry.
      throw error;
    } finally {
      setIsSendingTest(false);
    }
  };

  // LIVE ACTION: sends to the selected audience or schedules delivery.
  // It never opens the test-recipient modal.
  const handleSendNotification = async () => {
    if (isSendingNotification || isSendingTest) return;

    setFeedback(null);

    if (!validateForm()) return;

    if (!SEND_API_URL) {
      setFeedback({
        type: "error",
        message:
          "Notification sending API is not configured. Set NEXT_PUBLIC_NOTIFICATION_SEND_API_URL.",
      });
      return;
    }

    if (sendTime === "later" && !scheduledDateTime) {
      setFeedback({
        type: "error",
        message: "Choose a date and time before scheduling.",
      });
      setIsScheduleModalOpen(true);
      return;
    }

    let scheduledAt: string | undefined;

    if (sendTime === "later" && scheduledDateTime) {
      const dateTime = new Date(
        `${scheduledDateTime.date}T${scheduledDateTime.time}`,
      );

      if (Number.isNaN(dateTime.getTime())) {
        setFeedback({
          type: "error",
          message: "The selected schedule date or time is invalid.",
        });
        return;
      }

      if (dateTime.getTime() <= Date.now()) {
        setFeedback({
          type: "error",
          message: "Choose a future date and time for this notification.",
        });
        return;
      }

      scheduledAt = dateTime.toISOString();
    }

    setIsSendingNotification(true);

    try {
      const response = await fetch(SEND_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          audience,
          notificationType,
          link: link.trim() || undefined,
          sendTime,
          ...(scheduledAt ? { scheduledAt } : {}),
        }),
      });

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "The notification could not be processed."),
        );
      }

      if (sendTime === "later") {
        setFeedback({
          type: "success",
          message: `Notification successfully scheduled for ${scheduledDateTime?.date} at ${scheduledDateTime?.time}.`,
        });
      } else {
        setFeedback({
          type: "success",
          message: `Notification successfully submitted to ${audienceLabels[audience]}.`,
        });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while processing the notification.",
      });
    } finally {
      setIsSendingNotification(false);
    }
  };

  const handleSaveDraft = () => {
    // Connect your draft-saving API here before treating this as persisted.
    setIsDraftModalOpen(true);
  };

  const handleViewDrafts = () => {
    setIsDraftModalOpen(false);
    // Add navigation to your drafts page here.
  };

  const handleScheduleSelect = (date: string, time: string) => {
    setScheduledDateTime({ date, time });
    setSendTime("later");
    setIsScheduleModalOpen(false);
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-12 font-sans antialiased text-[#1A1A1A]">
      {/* Top Main Navigation Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-lg font-bold leading-tight text-gray-900">
              Create Push Notification
            </h1>
            <p className="text-xs text-gray-500">
              Send a push notification to your audience
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              aria-label="Search"
              className="w-full rounded-md bg-[#F3F4F6] py-1.5 pl-9 pr-4 text-xs outline-none placeholder-gray-400 focus:ring-1 focus:ring-[#006837]"
            />
          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-gray-200 px-3.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Filter className="h-3.5 w-3.5 text-gray-500" />
            <span>Filter</span>
          </button>

          <div className="relative">
            <button
              type="button"
              className="rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF5A22] text-[10px] font-bold text-white">
              12
            </span>
          </div>
        </div>
      </header>

      {/* Sub-Header / Breadcrumb Bar */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-2.5 text-xs">
        <div className="flex items-center gap-2 text-gray-500">
          <button
            type="button"
            className="rounded p-1 text-gray-600 hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <span>Notifications</span>
          <span>&gt;</span>
          <span>Push Notifications</span>
          <span>&gt;</span>
          <span className="font-semibold text-gray-900">
            Create Push Notification
          </span>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              aria-label="Search notifications"
              className="w-full rounded-md bg-[#F3F4F6] py-1 pl-8 pr-3 text-xs outline-none placeholder-gray-400 focus:ring-1 focus:ring-[#006837]"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="h-4 w-4 text-gray-600" />
              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#EF5A22] text-[8px] font-bold text-white">
                12
              </span>
            </div>

            <div className="ml-1 h-7 w-7 overflow-hidden rounded-full bg-gray-300">
              <Image
                src="/Image/name.png"
                alt="John Admin"
                width={28}
                height={28}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="text-left text-xs leading-tight">
              <div className="font-semibold text-gray-800">John Admin</div>
              <div className="text-[10px] text-gray-400">Super Admin</div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-[1400px] grid-cols-12 gap-6 px-6">
        {/* Left Column: Form Fields */}
        <div className="col-span-8 space-y-6">
          {/* Row 1: Title & Message */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="notification-title"
                className="mb-2 block text-xs font-bold text-gray-800"
              >
                1. Notification Title <span className="text-[#EF5A22]">*</span>
              </label>
              <input
                id="notification-title"
                type="text"
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Important Update: New Booking Feature"
                className="w-full rounded-md border border-gray-200 bg-white p-2.5 text-xs outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837]"
              />
              <div className="mt-1 text-right text-[10px] text-gray-400">
                {title.length}/100
              </div>
            </div>

            <div>
              <label
                htmlFor="notification-message"
                className="mb-2 block text-xs font-bold text-gray-800"
              >
                2. Message <span className="text-[#EF5A22]">*</span>
              </label>
              <textarea
                id="notification-message"
                rows={3}
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your notification message..."
                className="w-full resize-none rounded-md border border-gray-200 bg-white p-2.5 text-xs outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837]"
              />
              <div className="mt-1 text-right text-[10px] text-gray-400">
                {message.length}/500
              </div>
            </div>
          </div>

          {/* Row 2: Audience & Notification Type */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-800">
                3. Audience <span className="text-[#EF5A22]">*</span>
              </label>

              <div className="mb-2 grid grid-cols-3 gap-2">
                {(
                  [
                    {
                      value: "all",
                      label: "All Users",
                      description: "Send to all customers and Hostés",
                    },
                    {
                      value: "customers",
                      label: "Customers Only",
                      description: "Send to all customers",
                    },
                    {
                      value: "hostes",
                      label: "Hostés Only",
                      description: "Send to all Hostés",
                    },
                  ] as const
                ).map((option) => (
                  <AudienceCard
                    key={option.value}
                    selected={audience === option.value}
                    label={option.label}
                    description={option.description}
                    onClick={() => setAudience(option.value)}
                  />
                ))}
              </div>

              <AudienceCard
                selected={audience === "custom"}
                label="Custom Segment"
                description="Send to a specific user segment"
                onClick={() => setAudience("custom")}
                horizontal
              />

              {audience === "custom" && (
                <p className="mt-2 text-[10px] text-[#B45309]">
                  Ensure your backend knows which custom segment to target
                  before sending.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-gray-800">
                4. Notification Type <span className="text-[#EF5A22]">*</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <TypeCard
                  selected={notificationType === "push"}
                  onClick={() => setNotificationType("push")}
                  icon={<Bell className="mb-1.5 h-4 w-4 text-[#006837]" />}
                  title="Push Notification"
                  description="Send as a push notification"
                />

                <TypeCard
                  selected={notificationType === "in-app"}
                  onClick={() => setNotificationType("in-app")}
                  icon={
                    <MessageSquare className="mb-1.5 h-4 w-4 text-gray-500" />
                  }
                  title="In-App Notification"
                  description="Send as an in-app message"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Send Time */}
          <div>
            <label className="mb-2 block text-xs font-bold text-gray-800">
              5. Send Time <span className="text-[#EF5A22]">*</span>
            </label>

            <div className="grid grid-cols-2 gap-6">
              <button
                type="button"
                onClick={() => {
                  setSendTime("now");
                  setScheduledDateTime(null);
                  setFeedback(null);
                }}
                className={`flex items-center gap-3 rounded-md border p-3.5 text-left transition-all ${
                  sendTime === "now"
                    ? "border-[#006837] bg-emerald-50/20 ring-1 ring-[#006837]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="rounded-md bg-[#006837]/10 p-1.5 text-[#006837]">
                  <Send className="h-4 w-4 -rotate-45" />
                </span>
                <span>
                  <span className="block text-xs font-bold text-gray-800">
                    Send Now
                  </span>
                  <span className="block text-[9px] text-gray-400">
                    Send the notification immediately
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSendTime("later");
                  setFeedback(null);
                  setIsScheduleModalOpen(true);
                }}
                className={`flex flex-col justify-center rounded-md border p-3.5 text-left transition-all ${
                  sendTime === "later"
                    ? "border-[#EF5A22] bg-orange-50/30 ring-1 ring-[#EF5A22]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="rounded-md bg-[#EF5A22]/10 p-1.5 text-[#EF5A22]">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-xs font-bold text-gray-800">
                      Schedule for Later
                    </span>
                    <span className="block text-[9px] text-gray-400">
                      {scheduledDateTime
                        ? `${scheduledDateTime.date} at ${scheduledDateTime.time}`
                        : "Choose date and time to send"}
                    </span>
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Row 4: Optional Settings & Upload Image */}
          <div className="grid grid-cols-2 gap-6 pt-1">
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-800">
                6. Optional Settings
              </label>
              <label
                htmlFor="notification-link"
                className="mb-1.5 block text-xs font-medium text-gray-600"
              >
                Add Link (Optional)
              </label>
              <input
                id="notification-link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://"
                className="w-full rounded-md border border-gray-200 bg-white p-2.5 text-xs outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837]"
              />
              <div className="mt-1.5 text-[10px] text-gray-400">
                This link will open when the user taps the notification.
              </div>
            </div>

            <div>
              <div className="mb-1.5 text-xs font-medium text-gray-600">
                Add Image (Optional)
              </div>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-white p-5 text-center transition-colors hover:border-gray-400">
                <UploadCloud className="mb-1 h-5 w-5 text-gray-400" />
                <span className="text-xs font-semibold text-gray-800">
                  Upload Image
                </span>
                <span className="mt-0.5 text-[9px] text-gray-400">
                  PNG, JPG up to 2MB (Recommended size: 600×400)
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  className="sr-only"
                  onChange={() =>
                    setFeedback({
                      type: "error",
                      message:
                        "Image upload is not connected yet. Configure image upload before sending an image.",
                    })
                  }
                />
              </label>
            </div>
          </div>

          {/* Action Feedback */}
          {feedback && (
            <div
              role={feedback.type === "error" ? "alert" : "status"}
              className={`flex items-start gap-2 rounded-md border p-3 text-xs ${
                feedback.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <span className="flex-1">{feedback.message}</span>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                aria-label="Dismiss message"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Separate Test and Live Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-5 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Edit3 className="h-3.5 w-3.5 text-gray-500" />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              disabled={isSendingTest || isSendingNotification}
              onClick={() => {
                setFeedback(null);
                setIsTestModalOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-md border border-[#EF5A22] bg-white px-5 py-2 text-xs font-bold text-[#EF5A22] transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-3.5 w-3.5 -rotate-45" />
              Send Test Notification
            </button>

            <button
              type="button"
              disabled={isSendingNotification || isSendingTest}
              onClick={handleSendNotification}
              className="flex items-center gap-1.5 rounded-md bg-[#EF5A22] px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#d94f1c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSendingNotification ? (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5 -rotate-45" />
              )}
              <span>
                {isSendingNotification
                  ? sendTime === "later"
                    ? "Scheduling..."
                    : "Sending..."
                  : sendTime === "later"
                    ? "Schedule Notification"
                    : "Send Notification"}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Previews & Tips */}
        <div className="col-span-4 space-y-5">
          {/* Notification Preview */}
          <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-900">
                Notification Preview
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <span>Device Preview</span>
                <Monitor className="h-4 w-4 text-[#006837]" />
                <Smartphone className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div
              className="rounded-xl p-5 text-white shadow-sm"
              style={{
                background: "linear-gradient(135deg, #EF5A22 0%, #006837 100%)",
              }}
            >
              <div className="mb-4 flex items-center justify-between px-1 text-xs font-semibold">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <Wifi className="h-3.5 w-3.5" />
                  <Battery className="h-4 w-4" />
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-[#FEFCE8] p-3.5 text-gray-900 shadow-md">
                <div className="shrink-0 pt-0.5 text-sm font-extrabold text-[#EF5A22]">
                  H
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-gray-900">Hosté</span>
                    <span className="text-[10px] text-gray-400">
                      {scheduledDateTime ? "scheduled" : "now"}
                    </span>
                  </div>
                  <div className="text-xs font-bold leading-snug text-gray-900">
                    {title || "Important Update: New Booking Feature"}
                  </div>
                  <div className="mt-1 text-[10px] leading-relaxed text-gray-600">
                    {message ||
                      "We're excited to introduce group booking! You can now book multiple Hostés at once for your event. Try it today."}
                  </div>
                  {link && (
                    <div className="mt-2 break-all text-[9px] text-blue-700">
                      {link}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notification Tips */}
          <div className="space-y-3.5 rounded-md border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-xs font-bold text-gray-800">
              Notification Tips
            </h2>

            <Tip
              icon={<Info className="h-3.5 w-3.5" />}
              tone="orange"
              title="Keep your title short and clear"
              description="Make it catchy and easy to understand within 100 characters."
            />

            <Tip
              icon={<CheckCircle2 className="h-3.5 w-3.5" />}
              tone="green"
              title="Write a helpful message"
              description="Explain the benefit or update in simple words. Keep it within 500 characters."
            />

            <Tip
              icon={<Clock className="h-3.5 w-3.5" />}
              tone="orange"
              title="Right time, better engagement"
              description="Avoid sending too many notifications. Engage your users with the right timing."
            />
          </div>

          {/* Past Notifications */}
          <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-800">
                Past Notifications
              </h2>
              <button
                type="button"
                className="text-[10px] font-bold text-[#EF5A22] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              <PastNotification
                title="Weekend Promo: 20% Off"
                details="Sent to All Users • May 8, 2024 • 10:30 AM"
                delivered="12,456"
              />
              <PastNotification
                title="Verification Badge Update"
                details="Sent to Hostés Only • May 6, 2024 • 09:15 AM"
                delivered="8,732"
              />
              <PastNotification
                title="New Payment Option Available"
                details="Sent to Customers Only • May 4, 2024 • 02:45 PM"
                delivered="6,201"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Test Modal: exclusively for sending a test recipient */}
      <SendTestNotificationModal
        isOpen={isTestModalOpen}
        onClose={() => {
          if (!isSendingTest) setIsTestModalOpen(false);
        }}
        onSend={handleSendTest}
      />

      <SavedAsDraftModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        onViewDrafts={handleViewDrafts}
      />

      <ScheduleNotificationModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleScheduleSelect}
      />
    </div>
  );
}

function AudienceCard({
  selected,
  label,
  description,
  onClick,
  horizontal = false,
}: {
  selected: boolean;
  label: string;
  description: string;
  onClick: () => void;
  horizontal?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full rounded-md border p-2.5 text-left transition-all ${
        selected
          ? "border-[#006837] bg-emerald-50/20 ring-1 ring-[#006837]"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <span
        className={`flex ${horizontal ? "items-center" : "items-start"} gap-1.5`}
      >
        <span
          className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
            selected ? "border-[#006837]" : "border-gray-300"
          }`}
        >
          {selected && (
            <span className="h-1.5 w-1.5 rounded-full bg-[#006837]" />
          )}
        </span>
        <span>
          <span className="block text-xs font-bold leading-tight text-gray-800">
            {label}
          </span>
          <span className="mt-0.5 block text-[9px] leading-tight text-gray-400">
            {description}
          </span>
        </span>
      </span>
    </button>
  );
}

function TypeCard({
  selected,
  onClick,
  icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-md border p-3.5 text-left transition-all ${
        selected
          ? "border-[#006837] bg-emerald-50/20 ring-1 ring-[#006837]"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {icon}
      <span className="block text-xs font-bold text-gray-800">{title}</span>
      <span className="mt-0.5 block text-[9px] text-gray-400">
        {description}
      </span>
    </button>
  );
}

function Tip({
  icon,
  tone,
  title,
  description,
}: {
  icon: React.ReactNode;
  tone: "orange" | "green";
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className={`mt-0.5 rounded-full p-1 ${
          tone === "orange"
            ? "bg-[#EF5A22]/10 text-[#EF5A22]"
            : "bg-[#006837]/10 text-[#006837]"
        }`}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold text-gray-800">{title}</div>
        <div className="mt-0.5 text-[10px] leading-tight text-gray-500">
          {description}
        </div>
      </div>
    </div>
  );
}

function PastNotification({
  title,
  details,
  delivered,
}: {
  title: string;
  details: string;
  delivered: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-start gap-1.5">
        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#006837]" />
        <div className="min-w-0">
          <div className="text-xs font-bold text-gray-800">{title}</div>
          <div className="mt-0.5 text-[9px] text-gray-400">{details}</div>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-[10px] font-semibold text-[#006837]">
          Delivered
        </div>
        <div className="text-[9px] text-gray-400">{delivered}</div>
      </div>
    </div>
  );
}
