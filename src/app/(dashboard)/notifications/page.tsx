"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Filter,
  Search,
  TriangleAlert,
  Clock3,
  Plus,
  Copy,
  Eye,
  Trash2,
  UserRound,
} from "lucide-react";
import DeleteConfirmationModal from "@/features/notifications/components/modals/DeleteConfirmationModal";

type NotificationStatus = "Sent" | "Delivered" | "Scheduled" | "Failed";

type Notification = {
  title: string;
  audience: string;
  channel: string;
  priority: "High" | "Medium" | "Low";
  status: NotificationStatus;
  date: string;
};

const notifications: Notification[] = [
  {
    title: "New Booking Request",
    audience: "Hosts",
    channel: "Push",
    priority: "High",
    status: "Sent",
    date: "Today, 10:30 AM",
  },
  {
    title: "Booking Accepted",
    audience: "Student",
    channel: "Push",
    priority: "Medium",
    status: "Delivered",
    date: "Today, 11:15 AM",
  },
  {
    title: "Payment Successful",
    audience: "Student",
    channel: "Email + Push",
    priority: "High",
    status: "Delivered",
    date: "Yesterday, 4:45 PM",
  },
  {
    title: "Weekly Summary",
    audience: "Admin",
    channel: "Email",
    priority: "Low",
    status: "Scheduled",
    date: "Tomorrow, 09:00 AM",
  },
  {
    title: "Security Alert: Maintenance",
    audience: "All Users",
    channel: "Push",
    priority: "High",
    status: "Failed",
    date: "2026-08-01 14:20",
  },
];

const filters = ["All", "Unread", "Read", "Scheduled", "Failed"] as const;
type FilterType = (typeof filters)[number];

const CREATE_NOTIFICATION_ROUTE = "/notifications/create";

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [selectedNotification, setSelectedNotification] = useState(
    "New Booking Request",
  );
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [items, setItems] = useState<Notification[]>(notifications);

  const selected = items.find(
    (item) => item.title === selectedNotification,
  );

  const visibleNotifications = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.audience.toLowerCase().includes(search.toLowerCase()) ||
      item.channel.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "All" ||
      activeFilter === "Unread" ||
      activeFilter === "Read" ||
      (activeFilter === "Scheduled" && item.status === "Scheduled") ||
      (activeFilter === "Failed" && item.status === "Failed");

    return matchesSearch && matchesFilter;
  });

  const deleteNotification = () => {
    setItems((current) =>
      current.filter((item) => item.title !== selectedNotification),
    );
    setShowDelete(false);
    setSelectedNotification("");
  };

  const duplicateNotification = () => {
    if (!selected) return;

    let copyTitle = `${selected.title} (Copy)`;
    let suffix = 2;

    while (items.some((item) => item.title === copyTitle)) {
      copyTitle = `${selected.title} (Copy ${suffix})`;
      suffix += 1;
    }

    const copy: Notification = {
      ...selected,
      title: copyTitle,
      status: "Scheduled",
      date: "Just now",
    };

    setItems((current) => [...current, copy]);
    setSelectedNotification(copy.title);
  };

  return (
    <div className="min-h-screen w-full overflow-x-auto bg-[#f8f8fa] text-[#171c2c]">
      <div className="mx-auto min-w-[1000px] max-w-[1600px]">
        {/* TOP HEADER */}
        <header className="flex h-[64px] items-center justify-between border-b border-[#e8e8ed] bg-white px-[24px]">
          <div className="flex min-w-0 items-center gap-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-[12px] text-[#555] transition hover:text-[#f45c23]"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <div>
              <h1 className="text-[16px] font-bold leading-[21px]">
                Notifications
              </h1>
              <p className="text-[12px] leading-[17px] text-[#777d8e]">
                Manage all system and push notifications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilter((current) => !current)}
                className="flex h-[34px] items-center gap-2 rounded-md border border-[#e6e7eb] bg-white px-3 text-[12px] transition hover:bg-[#f8f8fa]"
              >
                <Filter size={14} />
                Filter
              </button>

              {showFilter && (
                <div className="absolute right-0 top-[40px] z-20 w-[150px] rounded-lg border border-[#e6e7eb] bg-white p-2 shadow-lg">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => {
                        setActiveFilter(filter);
                        setShowFilter(false);
                      }}
                      className={`block w-full rounded-md px-3 py-2 text-left text-[12px] transition ${
                        activeFilter === filter
                          ? "bg-[#f0edff] font-semibold text-[#6345ff]"
                          : "hover:bg-[#f8f8fa]"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex h-[36px] w-[200px] items-center gap-2 rounded-md bg-[#f4f5f7] px-3">
              <Search size={15} className="shrink-0 text-[#626777]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search anything..."
                aria-label="Search notifications"
                className="w-full bg-transparent text-[12px] outline-none placeholder:text-[#777]"
              />
            </div>

            <button
              type="button"
              className="relative text-[#73798a]"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span className="absolute -right-2 -top-2 rounded-full bg-[#f45c23] px-[5px] py-[1px] text-[9px] font-bold text-white">
                12
              </span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-[34px] w-[34px] items-center justify-center overflow-hidden rounded-full bg-[#dce4ea]">
                <UserRound size={20} />
              </div>
              <div className="whitespace-nowrap">
                <p className="text-[12px] font-semibold">John Admin</p>
                <p className="text-[10px] text-[#777d8e]">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AND DETAILS PANEL */}
        <div className="grid grid-cols-[minmax(0,1fr)_240px]">
          <main className="min-w-0 border-r border-[#e9e9ef] px-[14px] pb-4 pt-[10px]">
            {/* PAGE TITLE */}
            <div className="flex min-h-[50px] items-start justify-between gap-3">
              <h2 className="text-[24px] font-bold leading-[32px] tracking-[-0.5px]">
                Notifications
              </h2>

              <Link
                href={CREATE_NOTIFICATION_ROUTE}
                className="mt-[3px] flex h-[36px] shrink-0 items-center gap-2 rounded-[8px] bg-[#f45c23] px-[16px] text-[12px] font-semibold text-white transition hover:bg-[#dc4b17]"
              >
                <Plus size={16} />
                Create Notification
              </Link>
            </div>

            {/* SUMMARY CARDS */}
            <section className="grid grid-cols-4 gap-[12px]">
              <SummaryCard
                title="Total Notifications"
                value="24,521"
                change="+12.5%"
                description="from last month"
                icon={<Bell size={18} />}
                tone="purple"
              />

              <SummaryCard
                title="Unread Notifications"
                value="1,284"
                change="-2.4%"
                description="from last week"
                icon={<Clock3 size={18} />}
                tone="orange"
              />

              <SummaryCard
                title="Scheduled"
                value="45"
                change="+8.1%"
                description="queued for send"
                icon={<CalendarDays size={18} />}
                tone="blue"
              />

              <SummaryCard
                title="Failed Deliveries"
                value="12"
                change="-4.3%"
                description="system errors"
                icon={<TriangleAlert size={18} />}
                tone="red"
              />
            </section>

            {/* FILTER TABS */}
            <div className="mt-[18px] flex min-h-[34px] items-center gap-[12px] border-b border-[#e7e7ed]">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-md px-[12px] py-[6px] text-[11px] transition ${
                    activeFilter === filter
                      ? "bg-[#e9e5ff] font-semibold text-[#6345ff]"
                      : "text-[#73798a] hover:bg-[#f0eff5]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* NOTIFICATION TABLE */}
            <section className="mt-[10px] min-h-[278px] overflow-x-auto rounded-[12px] border border-[#e9e9ef] bg-white shadow-[0_2px_7px_rgba(20,20,40,0.05)]">
              <table className="w-full table-fixed border-collapse text-left">
                <thead>
                  <tr className="h-[30px] border-b border-[#ededf2] text-[9px] font-semibold uppercase text-[#9298a8]">
                    <th className="w-[25%] pl-[14px]">Notification</th>
                    <th className="w-[12%]">Audience</th>
                    <th className="w-[14%]">Channel</th>
                    <th className="w-[11%]">Priority</th>
                    <th className="w-[12%]">Status</th>
                    <th className="w-[17%]">Date &amp; Time</th>
                    <th className="w-[9%] pr-2">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleNotifications.map((item) => {
                    const isSelected =
                      selectedNotification === item.title;

                    return (
                      <tr
                        key={item.title}
                        onClick={() =>
                          setSelectedNotification(item.title)
                        }
                        className={`h-[46px] cursor-pointer border-b border-[#ededf2] text-[10px] last:border-b-0 ${
                          isSelected
                            ? "bg-[#faf9ff]"
                            : "bg-white hover:bg-[#fafaff]"
                        }`}
                      >
                        <td
                          className={`truncate pl-[14px] font-medium ${
                            isSelected
                              ? "border-l-[3px] border-[#f45c23] pl-[11px]"
                              : "border-l-[3px] border-transparent"
                          }`}
                        >
                          {item.title}
                        </td>

                        <td className="truncate pr-1">
                          {item.audience}
                        </td>

                        <td className="truncate pr-1">
                          {item.channel}
                        </td>

                        <td>
                          <PriorityBadge priority={item.priority} />
                        </td>

                        <td>
                          <StatusBadge status={item.status} />
                        </td>

                        <td className="whitespace-nowrap text-[9px] text-[#73798a]">
                          {item.date}
                        </td>

                        <td>
                          <div className="flex items-center gap-[7px]">
                            <button
                              type="button"
                              title="Duplicate"
                              aria-label={`Duplicate ${item.title}`}
                              onClick={(event) => {
                                event.stopPropagation();

                                let copyTitle = `${item.title} (Copy)`;
                                let suffix = 2;

                                while (
                                  items.some(
                                    (notification) =>
                                      notification.title === copyTitle,
                                  )
                                ) {
                                  copyTitle = `${item.title} (Copy ${suffix})`;
                                  suffix += 1;
                                }

                                const copy: Notification = {
                                  ...item,
                                  title: copyTitle,
                                  status: "Scheduled",
                                  date: "Just now",
                                };

                                setItems((current) => [
                                  ...current,
                                  copy,
                                ]);

                                setSelectedNotification(copy.title);
                              }}
                              className="text-[#9b9b9b] transition hover:text-[#f45c23]"
                            >
                              <Copy size={12} />
                            </button>

                            <button
                              type="button"
                              title="View"
                              aria-label={`View ${item.title}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedNotification(item.title);
                              }}
                              className="text-[#999] transition hover:text-[#6345ff]"
                            >
                              <Eye size={13} />
                            </button>

                            <button
                              type="button"
                              title="Delete"
                              aria-label={`Delete ${item.title}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedNotification(item.title);
                                setShowDelete(true);
                              }}
                              className="text-[#ff4545] transition hover:text-[#c00]"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {visibleNotifications.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="h-[130px] text-center text-[12px] text-[#85899a]"
                      >
                        No notifications found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>

            {/* QUICK STATISTICS AND CREATE ACTION */}
            <section className="mt-[16px] grid grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] items-stretch gap-[12px]">
              <div className="min-w-0">
                <h3 className="mb-[9px] text-[14px] font-bold">
                  Quick Statistics
                </h3>

                <div className="grid grid-cols-4 gap-[7px]">
                  <QuickStat
                    value="98.4%"
                    label="Push Delivery Rate"
                  />
                  <QuickStat value="64.2%" label="Open Rate" />
                  <QuickStat
                    value="18.9%"
                    label="Click Through Rate"
                  />
                  <QuickStat
                    value="0.8%"
                    label="Failed Rate"
                    danger
                  />
                </div>
              </div>

              <div className="mt-[25px] flex min-h-[76px] min-w-0 items-center gap-[10px] rounded-[12px] border border-[#e8e8ef] bg-white px-[12px] py-[10px]">
                <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#f4f5f7]">
                  <Bell size={19} className="text-[#9da4b4]" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-[11px] font-bold">
                    Create a notification
                  </h3>

                  <p className="mt-1 text-[9px] leading-[13px] text-[#777d8e]">
                    Create a new push or email notification campaign.
                  </p>

                  <Link
                    href={CREATE_NOTIFICATION_ROUTE}
                    className="mt-[5px] inline-flex min-h-[25px] items-center rounded-[6px] bg-[#f45c23] px-[10px] text-[9px] font-semibold text-white transition hover:bg-[#dc4b17]"
                  >
                    Create Notification
                  </Link>
                </div>
              </div>
            </section>
          </main>

          {/* RIGHT-SIDE DETAILS PANEL */}
          <aside className="min-w-0 bg-white">
            <div className="flex min-h-[64px] flex-col items-center justify-center border-b border-[#e8e8ef] px-3 text-center">
              <h3 className="text-[11px] font-bold">
                {selected?.title ?? "Notification Details"}
              </h3>

              <p className="mt-1 text-[9px] text-[#888d9c]">
                Details &amp; Performance
              </p>
            </div>

            <div className="px-[10px] pt-[20px]">
              <p className="mb-[8px] text-[9px] font-semibold uppercase text-[#9298a8]">
                Message Preview
              </p>

              <div className="rounded-[8px] border border-[#e7e8ed] bg-[#fafbfc] p-[9px]">
                <p className="text-[10px] font-medium leading-[15px]">
                  {selected?.title || "New Booking Received 🎉"}
                </p>

                <p className="mt-[5px] text-[9px] leading-[13px] text-[#777d8e]">
                  Alex M. requested to book Urban Student Studio for 12 mos.
                </p>
              </div>

              <DetailField
                label="Audience"
                value={selected?.audience || "Hosts"}
              />

              <DetailField
                label="Channel"
                value={selected?.channel || "Push Notification"}
              />

              <DetailField
                label="Sent Date"
                value={selected?.date || "Today, 10:30 AM"}
              />

              <DetailField
                label="Priority"
                value={selected?.priority || "High"}
              />

              <DetailField
                label="Status"
                value={selected?.status || "Sent"}
              />

              <div className="mt-[18px] border-t border-[#e8e8ef] pt-[14px]">
                <h4 className="text-[9px] font-semibold uppercase text-[#9298a8]">
                  Delivery Statistics
                </h4>

                <div className="mt-[15px] flex items-center justify-between gap-2 text-[9px]">
                  <span>Open Rate</span>
                  <span className="font-bold">78.5%</span>
                </div>

                <div className="mt-[6px] h-[5px] rounded-full bg-[#e9e9ee]">
                  <div className="h-full w-[78.5%] rounded-full bg-[#6545ff]" />
                </div>

                <div className="mt-[14px] flex items-center justify-between gap-2 text-[9px]">
                  <span>Click Rate</span>
                  <span className="font-bold">42.1%</span>
                </div>

                <div className="mt-[6px] h-[5px] rounded-full bg-[#e9e9ee]">
                  <div className="h-full w-[42.1%] rounded-full bg-[#6545ff]" />
                </div>
              </div>

              <div className="mt-[22px] flex gap-[7px]">
                <Link
                  href={`/notification/${encodeURIComponent(
                    selected?.title ?? "create",
                  )}`}
                  className="flex h-[34px] flex-1 items-center justify-center rounded-[8px] bg-[#6545ff] text-[10px] font-semibold text-white transition hover:bg-[#5233e5]"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => setShowDelete(true)}
                  disabled={!selected}
                  className="h-[34px] flex-1 rounded-[8px] bg-[#fff0f0] text-[10px] font-semibold text-[#f04444] transition hover:bg-[#ffe0e0] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delete
                </button>
              </div>

              <button
                type="button"
                onClick={duplicateNotification}
                disabled={!selected}
                className="mt-[10px] h-[34px] w-full rounded-[8px] border border-[#e8e8ef] bg-white text-[10px] font-semibold transition hover:bg-[#f8f8fc] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Duplicate
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* EXISTING DELETE CONFIRMATION MODAL */}
      <DeleteConfirmationModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={deleteNotification}
      />
    </div>
  );
}

function SummaryCard({
  title,
  value,
  change,
  description,
  icon,
  tone,
}: {
  title: string;
  value: string;
  change: string;
  description: string;
  icon: React.ReactNode;
  tone: "purple" | "orange" | "blue" | "red";
}) {
  const tones = {
    purple: "bg-[#f0edff] text-[#6947ff]",
    orange: "bg-[#fff5e6] text-[#ff9c00]",
    blue: "bg-[#eaf1ff] text-[#4384ff]",
    red: "bg-[#fff0f0] text-[#ff4545]",
  };

  const positive = change.startsWith("+");

  return (
    <div className="h-[88px] min-w-0 rounded-[11px] border border-[#e9e9ef] bg-white px-[10px] pt-[10px]">
      <div className="flex items-center justify-between gap-1">
        <p className="truncate text-[10px] text-[#858b9a]">
          {title}
        </p>

        <span
          className={`flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[7px] ${tones[tone]}`}
        >
          {icon}
        </span>
      </div>

      <p className="mt-[2px] text-[20px] font-bold leading-[25px] tracking-[-0.4px]">
        {value}
      </p>

      <p className="mt-[2px] whitespace-nowrap text-[8px] text-[#9ba0ad]">
        <span
          className={
            positive ? "text-[#25b65b]" : "text-[#ff4545]"
          }
        >
          {change}
        </span>{" "}
        {description}
      </p>
    </div>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: Notification["priority"];
}) {
  const styles = {
    High: "bg-[#ffe9eb] text-[#ff414b]",
    Medium: "bg-[#fff5dd] text-[#e99500]",
    Low: "bg-[#eff0f2] text-[#6d7482]",
  };

  return (
    <span
      className={`inline-flex min-w-[48px] justify-center rounded-full px-1.5 py-[4px] text-[9px] font-semibold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: NotificationStatus;
}) {
  const styles = {
    Sent: "bg-[#e4f5ef] text-[#2ab37a]",
    Delivered: "bg-[#eaf8ee] text-[#35b86a]",
    Scheduled: "bg-[#eaf1ff] text-[#4384ff]",
    Failed: "bg-[#fff0f0] text-[#ee6262]",
  };

  return (
    <span
      className={`inline-flex min-w-[58px] justify-center rounded-[5px] px-1.5 py-[5px] text-[9px] font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function QuickStat({
  value,
  label,
  danger = false,
}: {
  value: string;
  label: string;
  danger?: boolean;
}) {
  return (
    <div className="flex min-h-[60px] min-w-0 flex-col rounded-[11px] border border-[#e8e8ef] bg-white px-[8px] py-[8px]">
      <p
        className={`text-[19px] font-bold leading-[24px] ${
          danger ? "text-[#ff414b]" : "text-[#171c2c]"
        }`}
      >
        {value}
      </p>

      <p className="mt-[3px] text-[9px] leading-[12px] text-[#858b9a]">
        {label}
      </p>
    </div>
  );
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="mt-[14px]">
      <p className="text-[9px] text-[#8b90a0]">{label}</p>

      <p className="mt-[4px] break-words text-[10px] font-medium leading-[14px]">
        {value}
      </p>
    </div>
  );
}