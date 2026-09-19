export type BannerPlacement = "Home Hero" | "Bookings Header" | "Customer Support Pop" | "Mobile Splash";

export interface Banner {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  destinationUrl: string;
  placement: BannerPlacement;
  imageUrl: string;
  isActive: boolean;
  priorityOrder: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}
