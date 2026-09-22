"use client";

import React, { useState } from "react";
import {
  Bell,
  Search,
  Send,
  CheckCheck,
  AlertCircle,
  RefreshCw,
  Plus,
  Filter,
  Trash2,
  Mail,
  Smartphone,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_NOTIFICATIONS } from "@/features/notifications/data/notifications.data";
import { AdminNotification, NotificationCategory } from "@/features/notifications/notifications.types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>(MOCK_NOTIFICATIONS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  // Broadcast Modal State
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastRecipient, setBroadcastRecipient] = useState("All Users");
  const [broadcastCategory, setBroadcastCategory] = useState<NotificationCategory>("Broadcast");

  const filteredNotifications = notifications.filter((item) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q) ||
        item.recipientGroup.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (categoryFilter !== "All" && item.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleRetrySend = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              deliveryStatus: "Delivered",
              failureReason: undefined,
              sentAt: "Just now",
            }
          : n
      )
    );
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}`,
      title: broadcastTitle.trim(),
      message: broadcastMessage.trim(),
      category: broadcastCategory,
      recipientGroup: broadcastRecipient,
      isRead: false,
      deliveryStatus: "Delivered",
      channels: ["In-App", "Push", "Email"],
      sentAt: "Just now",
    };

    setNotifications([newNotif, ...notifications]);
    setBroadcastTitle("");
    setBroadcastMessage("");
    setIsBroadcastOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Notifications & Broadcasts
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            System activity alerts, delivery status tracking, and admin broadcast messaging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleMarkAllRead}
            variant="outline"
            className="h-9 text-xs font-semibold rounded-xl border-border/80 bg-card hover:bg-muted/50 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1.5 text-primary" />
            <span>Mark All as Read</span>
          </Button>

          <Dialog open={isBroadcastOpen} onOpenChange={setIsBroadcastOpen}>
            <DialogTrigger className="h-9 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs cursor-pointer inline-flex items-center px-4">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              <span>New Broadcast</span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl border-border">
              <DialogHeader>
                <DialogTitle className="text-sm font-bold text-foreground">
                  Send Admin Broadcast
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSendBroadcast} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Title</label>
                  <Input
                    required
                    placeholder="Broadcast title..."
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="h-9 text-xs rounded-xl bg-background border-border"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Recipient Group</label>
                  <Select value={broadcastRecipient} onValueChange={(val) => val && setBroadcastRecipient(val)}>
                    <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                      <SelectItem value="All Users">All Users</SelectItem>
                      <SelectItem value="All Hostés">All Hostés</SelectItem>
                      <SelectItem value="All Customers">All Customers</SelectItem>
                      <SelectItem value="Super Administrators">Super Administrators</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Category</label>
                  <Select value={broadcastCategory} onValueChange={(val) => val && setBroadcastCategory(val as NotificationCategory)}>
                    <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                      <SelectItem value="Broadcast">Broadcast</SelectItem>
                      <SelectItem value="System">System</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Type broadcast message..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsBroadcastOpen(false)}
                    className="h-9 px-4 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="h-9 px-5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground">
                    Dispatch Broadcast
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-card border border-border/80 rounded-2xl shadow-2xs p-5 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notifications or broadcasts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl text-xs bg-background border-border/80"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {["All", "System", "Security", "Booking", "Payout", "Marketing", "Broadcast"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  categoryFilter === cat
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-xs text-muted-foreground">
              No notifications found matching filter.
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  notif.isRead
                    ? "bg-background border-border/60"
                    : "bg-primary/5 border-primary/20"
                }`}
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                    <span className="font-bold text-xs text-foreground">{notif.title}</span>
                    <Badge variant="outline" className="text-[10px] rounded-lg">
                      {notif.category}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">To: {notif.recipientGroup}</span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>

                  {notif.failureReason && (
                    <div className="text-[11px] text-destructive flex items-center gap-1.5 pt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Delivery Failed: {notif.failureReason}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1">
                    <span>{notif.sentAt}</span>
                    <span>•</span>
                    <span>Channels: {notif.channels.join(", ")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {notif.deliveryStatus === "Failed" && (
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => handleRetrySend(notif.id)}
                      className="text-xs border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Retry
                    </Button>
                  )}

                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleToggleRead(notif.id)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {notif.isRead ? "Mark Unread" : "Mark Read"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
