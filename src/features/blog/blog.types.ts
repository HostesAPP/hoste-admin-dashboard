export type BlogPostStatus = "Draft" | "Scheduled" | "Published" | "Archived";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  coverImageUrl?: string;
  status: BlogPostStatus;
  publishedAt?: string;
  scheduledAt?: string;
  createdAt: string;
}
