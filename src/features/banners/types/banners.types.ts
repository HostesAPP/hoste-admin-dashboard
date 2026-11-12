export interface BannerItem {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  description?: string;
  cta: string;
  ctaLink?: string;
  placement: string;
  audience: string;
  status: "Active" | "Scheduled" | "Draft";
  startDate: string;
  endDate: string;
  createdBy: string;

  imageUrl?: string;
  publishingOption?: "immediate" | "schedule";
  isEvergreen?: boolean;
  priorityWeight?: number;
  showCta?: boolean;
  allowDismiss?: boolean;
  trackImpressions?: boolean;
  openNewTab?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
