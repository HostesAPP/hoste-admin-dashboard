export type NotificationCategory = "System" | "Security" | "Booking" | "Payout" | "Marketing" | "Broadcast";
export type NotificationDeliveryStatus = "Queued" | "Sent" | "Delivered" | "Failed";

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  recipientGroup: string;
  isRead: boolean;
  deliveryStatus: NotificationDeliveryStatus;
  channels: ("Email" | "Push" | "In-App")[];
  sentAt: string;
  failureReason?: string;
  retryCount?: number;
}
