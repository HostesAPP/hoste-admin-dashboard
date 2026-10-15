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
} from "lucide-react";
import SendTestNotificationModal from "@/features/notifications/components/modals/SendTestNotificationModal";
import SavedAsDraftModal from "@/features/notifications/components/modals/SavedAsDraftModal";
import ScheduleNotificationModal from "@/features/notifications/components/modals/ScheduleNotificationModal";

export default function CreatePushNotificationPage() {
  const [title, setTitle] = useState("Important Update: New Booking Feature");
  const [message, setMessage] = useState(
    "We're excited to introduce group booking! You can now book multiple Hostés at once for your event. Try it today.",
  );
  const [audience, setAudience] = useState<
    "all" | "customers" | "hostes" | "custom"
  >("all");
  const [notificationType, setNotificationType] = useState<"push" | "in-app">(
    "push",
  );
  const [sendTime, setSendTime] = useState<"now" | "later">("now");
  const [link, setLink] = useState("");
  const [scheduledDateTime, setScheduledDateTime] = useState<{
    date: string;
    time: string;
  } | null>(null);

  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const handleSendTest = (recipient: string) => {
    console.log("Sending test notification to:", recipient);
    // Add API logic here
  };

  const handleSaveDraft = () => {
    // Add draft save API logic here
    setIsDraftModalOpen(true);
  };

  const handleViewDrafts = () => {
    setIsDraftModalOpen(false);
    // Add navigation logic (e.g., router.push("/notifications?tab=drafts"))
  };

  const handleScheduleSelect = (date: string, time: string) => {
    setScheduledDateTime({ date, time });
    setSendTime("later");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans antialiased pb-12">
      {/* Top Main Navigation Header */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="p-1.5 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              Create Push Notification
            </h1>
            <p className="text-xs text-gray-500">
              Send a push notification to your audience
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#F3F4F6] text-xs rounded-md outline-none focus:ring-1 focus:ring-[#006837] placeholder-gray-400"
            />
          </div>

          <button
            type="button"
            className="flex items-center gap-2 px-3.5 py-1.5 border border-gray-200 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span>Filter</span>
          </button>

          <div className="relative">
            <button
              type="button"
              className="p-1.5 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
            </button>
            <span className="absolute -top-1 -right-1 bg-[#EF5A22] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              12
            </span>
          </div>
        </div>
      </header>

      {/* Sub-Header / Breadcrumb Bar */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-white border-b border-gray-200 mb-6 text-xs">
        <div className="flex items-center gap-2 text-gray-500">
          <button
            type="button"
            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
          >
            <Menu className="w-4 h-4" />
          </button>
          <span className="hover:text-gray-800 cursor-pointer">
            Notifications
          </span>
          <span>&gt;</span>
          <span className="hover:text-gray-800 cursor-pointer">
            Push Notifications
          </span>
          <span>&gt;</span>
          <span className="font-semibold text-gray-900">
            Create Push Notification
          </span>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-8 pr-3 py-1 bg-[#F3F4F6] text-xs rounded-md outline-none focus:ring-1 focus:ring-[#006837] placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-4 h-4 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-[#EF5A22] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                12
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-gray-300 overflow-hidden ml-1">
              <Image
                src="/Image/name.png"
                alt="John Admin"
                width={28}
                height={28}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left text-xs leading-tight">
              <div className="font-semibold text-gray-800">John Admin</div>
              <div className="text-[10px] text-gray-400">Super Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container Layout */}
      <main className="max-w-[1400px] mx-auto px-6 grid grid-cols-12 gap-6">
        {/* Left Column: Form Fields (8 Columns) */}
        <div className="col-span-8 space-y-6">
          {/* Row 1: Title & Message */}
          <div className="grid grid-cols-2 gap-6">
            {/* 1. Notification Title */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                1. Notification Title <span className="text-[#EF5A22]">*</span>
              </label>
              <input
                type="text"
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Important Update: New Booking Feature"
                className="w-full p-2.5 border border-gray-200 rounded-md text-xs bg-white outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837]"
              />
              <div className="text-right text-[10px] text-gray-400 mt-1">
                {title.length}/100
              </div>
            </div>

            {/* 2. Message */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                2. Message <span className="text-[#EF5A22]">*</span>
              </label>
              <textarea
                rows={3}
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="We're excited to introduce group booking..."
                className="w-full p-2.5 border border-gray-200 rounded-md text-xs bg-white outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837] resize-none"
              />
              <div className="text-right text-[10px] text-gray-400 mt-1">
                {message.length}/500
              </div>
            </div>
          </div>

          {/* Row 2: Audience & Notification Type */}
          <div className="grid grid-cols-2 gap-6">
            {/* 3. Audience */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                3. Audience <span className="text-[#EF5A22]">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {/* All Users */}
                <div
                  onClick={() => setAudience("all")}
                  className={`p-2.5 border rounded-md cursor-pointer flex flex-col justify-between transition-all ${
                    audience === "all"
                      ? "border-[#006837] bg-emerald-50/20 ring-1 ring-[#006837]"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-1.5">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${audience === "all" ? "border-[#006837]" : "border-gray-300"}`}
                    >
                      {audience === "all" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#006837]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-800 leading-tight">
                        All Users
                      </div>
                      <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">
                        Send to all customers and Hostés
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customers Only */}
                <div
                  onClick={() => setAudience("customers")}
                  className={`p-2.5 border rounded-md cursor-pointer flex flex-col justify-between transition-all ${
                    audience === "customers"
                      ? "border-[#006837] bg-emerald-50/20 ring-1 ring-[#006837]"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-1.5">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${audience === "customers" ? "border-[#006837]" : "border-gray-300"}`}
                    >
                      {audience === "customers" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#006837]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-800 leading-tight">
                        Customers Only
                      </div>
                      <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">
                        Send to all customers
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hostés Only */}
                <div
                  onClick={() => setAudience("hostes")}
                  className={`p-2.5 border rounded-md cursor-pointer flex flex-col justify-between transition-all ${
                    audience === "hostes"
                      ? "border-[#006837] bg-emerald-50/20 ring-1 ring-[#006837]"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-1.5">
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${audience === "hostes" ? "border-[#006837]" : "border-gray-300"}`}
                    >
                      {audience === "hostes" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#006837]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-800 leading-tight">
                        Hostés Only
                      </div>
                      <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">
                        Send to all Hostés
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Segment */}
              <div
                onClick={() => setAudience("custom")}
                className={`p-2.5 border rounded-md cursor-pointer transition-all ${
                  audience === "custom"
                    ? "border-[#006837] bg-emerald-50/20 ring-1 ring-[#006837]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${audience === "custom" ? "border-[#006837]" : "border-gray-300"}`}
                  >
                    {audience === "custom" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#006837]" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">
                      Custom Segment
                    </div>
                    <div className="text-[9px] text-gray-400">
                      Send to a specific user segment
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Notification Type */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                4. Notification Type <span className="text-[#EF5A22]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Push Notification */}
                <div
                  onClick={() => setNotificationType("push")}
                  className={`p-3.5 border rounded-md cursor-pointer transition-all ${
                    notificationType === "push"
                      ? "border-[#006837] bg-emerald-50/20 ring-1 ring-[#006837]"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <Bell className="w-4 h-4 text-[#006837] mb-1.5" />
                  <div className="text-xs font-bold text-gray-800">
                    Push Notification
                  </div>
                  <div className="text-[9px] text-gray-400 mt-0.5">
                    Send as a push notification
                  </div>
                </div>

                {/* In-App Notification */}
                <div
                  onClick={() => setNotificationType("in-app")}
                  className={`p-3.5 border rounded-md cursor-pointer transition-all ${
                    notificationType === "in-app"
                      ? "border-[#006837] bg-emerald-50/20 ring-1 ring-[#006837]"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-gray-500 mb-1.5" />
                  <div className="text-xs font-bold text-gray-800">
                    In-App Notification
                  </div>
                  <div className="text-[9px] text-gray-400 mt-0.5">
                    Send as an in-app message
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Send Time */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2">
              5. Send Time <span className="text-[#EF5A22]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-6">
              {/* Send Now */}
              <div
                onClick={() => {
                  setSendTime("now");
                  setScheduledDateTime(null);
                }}
                className={`p-3.5 border rounded-md cursor-pointer flex items-center gap-3 transition-all ${
                  sendTime === "now"
                    ? "border-[#006837] bg-emerald-50/20 ring-1 ring-[#006837]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="p-1.5 rounded-md bg-[#006837]/10 text-[#006837]">
                  <Send className="w-4 h-4 -rotate-45" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800">
                    Send Now
                  </div>
                  <div className="text-[9px] text-gray-400">
                    Send the notification immediately
                  </div>
                </div>
              </div>

              {/* Schedule for Later */}
              <div
                onClick={() => {
                  setSendTime("later");
                  setIsScheduleModalOpen(true);
                }}
                className={`p-3.5 border rounded-md cursor-pointer flex flex-col justify-center transition-all ${
                  sendTime === "later"
                    ? "border-[#EF5A22] bg-orange-50/30 ring-1 ring-[#EF5A22]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-[#EF5A22]/10 text-[#EF5A22]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">
                      Schedule for Later
                    </div>
                    <div className="text-[9px] text-gray-400">
                      {scheduledDateTime
                        ? `${scheduledDateTime.date} at ${scheduledDateTime.time}`
                        : "Choose date and time to send"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Optional Settings & Upload Image */}
          <div className="grid grid-cols-2 gap-6 pt-1">
            {/* 6. Optional Settings */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                6. Optional Settings
              </label>
              <div className="text-xs font-medium text-gray-600 mb-1.5">
                Add Link (Optional)
              </div>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://"
                className="w-full p-2.5 border border-gray-200 rounded-md text-xs bg-white outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837]"
              />
              <div className="text-[10px] text-gray-400 mt-1.5">
                This link will be opened when the user taps the notification.
              </div>
            </div>

            {/* Add Image */}
            <div>
              <div className="text-xs font-medium text-gray-600 mb-1.5">
                Add Image (Optional)
              </div>
              <div className="border border-dashed border-gray-300 rounded-md p-5 bg-white flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 transition-colors">
                <UploadCloud className="w-5 h-5 text-gray-400 mb-1" />
                <div className="text-xs font-semibold text-gray-800">
                  Upload Image
                </div>
                <div className="text-[9px] text-gray-400 mt-0.5">
                  PNG, JPG up to 2MB (Recommended size: 600×400)
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-1.5 px-5 py-2 border border-gray-300 rounded-md text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-gray-500" />
              <span>Save as Draft</span>
            </button>
            <button
              type="button"
              onClick={() => setIsTestModalOpen(true)}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#EF5A22] hover:bg-[#d94f1c] text-white rounded-md text-xs font-bold transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5 -rotate-45" />
              <span>
                {sendTime === "later"
                  ? "Schedule Notification"
                  : "Send Notification"}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Previews & Tips (4 Columns) */}
        <div className="col-span-4 space-y-5">
          {/* Notification Preview */}
          <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-gray-900">
                Notification Preview
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <span>Device Preview</span>
                <Monitor className="w-4 h-4 text-[#006837]" />
                <Smartphone className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Mobile Outer Container - Linear Gradient (#EF5A22 to #006837 at 135deg) */}
            <div
              className="rounded-xl p-5 text-white shadow-sm"
              style={{
                background: "linear-gradient(135deg, #EF5A22 0%, #006837 100%)",
              }}
            >
              {/* Top Status Bar */}
              <div className="flex items-center justify-between text-xs font-semibold mb-4 px-1">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4" />
                </div>
              </div>

              {/* Notification Banner Container */}
              <div className="bg-[#FEFCE8] text-gray-900 rounded-xl p-3.5 shadow-md flex items-start gap-3">
                <div className="text-[#EF5A22] font-extrabold text-sm shrink-0 pt-0.5">
                  H
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-gray-900">Hosté</span>
                    <span className="text-gray-400 text-[10px]">
                      {scheduledDateTime ? "scheduled" : "now"}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-gray-900 leading-snug">
                    {title || "Important Update: New Booking Feature"}
                  </div>
                  <div className="text-[10px] text-gray-600 mt-1 leading-relaxed">
                    {message ||
                      "We're excited to introduce group booking! You can now book multiple Hostés at once for your event. Try it today."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Tips */}
          <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm space-y-3.5">
            <h2 className="text-xs font-bold text-gray-800">
              Notification Tips
            </h2>

            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-full bg-[#EF5A22]/10 text-[#EF5A22] mt-0.5">
                <Info className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-800">
                  Keep your title short and clear
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                  Make it catchy and easy to understand within 100 characters.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-full bg-[#006837]/10 text-[#006837] mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-800">
                  Write a helpful message
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                  Explain the benefit or update in simple words. Keep it within
                  500 characters.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-full bg-[#EF5A22]/10 text-[#EF5A22] mt-0.5">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-800">
                  Right time, better engagement
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                  Avoid sending too many notifications. Engage your users with
                  the right timing.
                </div>
              </div>
            </div>
          </div>

          {/* Past Notifications */}
          <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
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
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#006837] mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-gray-800">
                      Weekend Promo: 20% Off
                    </div>
                    <div className="text-[9px] text-gray-400 mt-0.5">
                      Sent to All Users • May 8, 2024 • 10:30 AM
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold text-[#006837]">
                    Delivered
                  </div>
                  <div className="text-[9px] text-gray-400">12,456</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#006837] mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-gray-800">
                      Verification Badge Update
                    </div>
                    <div className="text-[9px] text-gray-400 mt-0.5">
                      Sent to Hostés Only • May 6, 2024 • 09:15 AM
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold text-[#006837]">
                    Delivered
                  </div>
                  <div className="text-[9px] text-gray-400">8,732</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#006837] mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-gray-800">
                      New Payment Option Available
                    </div>
                    <div className="text-[9px] text-gray-400 mt-0.5">
                      Sent to Customers Only • May 4, 2024 • 02:45 PM
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold text-[#006837]">
                    Delivered
                  </div>
                  <div className="text-[9px] text-gray-400">6,201</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <SendTestNotificationModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
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
