export type PostStatus = "published" | "draft" | "scheduled" | "archived";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  status: PostStatus;
  publishedOn?: string;
  scheduledFor?: string;
  views: number;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
}
