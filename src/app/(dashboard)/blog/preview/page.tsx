"use client";

import React, { useCallback, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Clock,
  ExternalLink,
  Share2,
  Pencil,
  CheckCircle2,
  FileText,
  Heart,
  MessageSquare,
} from "lucide-react";

import type { Post, PostStatus } from "@/features/blog/blog.types";

const STORAGE_KEY = "hoste_blog_management_posts";

function subscribeToPreviewData() {
  return () => {};
}

function getPreviewDataSnapshot(): string {
  return `${window.location.search}\u0000${localStorage.getItem(STORAGE_KEY) ?? ""}`;
}

// Fallback mock data matching the reference image layout
const DEFAULT_POST: Post = {
  id: "BLOG-128",
  slug: "5-things-to-consider-when-hiring-event-staff",
  title: "5 Things to Consider When Hiring Event Staff",
  excerpt:
    "Hiring the right event staff can make or break your event. From professionalism to reliability, the right team ensures everything runs smoothly while you focus on enjoying the occasion.",
  content: `
    <p>Here are five key factors to keep in mind:</p>
    <h2>1. Experience Matters</h2>
    <p>Look for staff who have prior experience in the type of event you are hosting. Experienced staff can handle unexpected situations with ease and maintain a high level of service.</p>
    <h2>2. Professionalism & Attitude</h2>
    <p>A positive attitude, good communication, and professionalism go a long way in creating a seamless guest experience.</p>
  `,
  author: "Naomi Admin",
  category: "Event Planning",
  status: "published",
  tags: ["Event Staff", "Hiring Tips"],
  publishedOn: "2026-08-10T10:30:00.000Z",
  views: 1245,
  metaTitle: "5 Things to Consider When Hiring Event Staff",
  metaDescription:
    "Discover the top 5 things to consider when hiring event staff for your next event to ensure a successful and stress-free experience.",
  canonicalUrl: "https://example.com/blog/hiring-event-staff",
  coverImage: "",
};

function getStatusStyle(status?: PostStatus | string): string {
  const normalized = status?.toLowerCase() || "";
  switch (normalized) {
    case "published":
      return "bg-[#E6F4EA] text-[#006837]";
    case "draft":
      return "bg-[#FEF3C7] text-[#B45309]";
    case "scheduled":
      return "bg-[#F3E8FF] text-[#6B21A8]";
    case "archived":
      return "bg-[#F1F5F9] text-[#475569]";
    default:
      return "bg-[#E6F4EA] text-[#006837]";
  }
}

function getStatusLabel(status?: PostStatus | string): string {
  if (!status) return "Published";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function getReadingTime(content?: string): number {
  const plainText = content ? content.replace(/<[^>]*>/g, " ").trim() : "";
  const wordCount = plainText
    ? plainText.split(/\s+/).filter(Boolean).length
    : 0;

  return Math.max(1, Math.ceil(wordCount / 200));
}

function formatDate(value?: string): string {
  if (!value) return "Aug 10, 2026 at 10:30 AM";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function BlogPreviewPage() {
  const router = useRouter();

  const previewData = useSyncExternalStore(
    subscribeToPreviewData,
    getPreviewDataSnapshot,
    () => null,
  );
  const [postOverride, setPostOverride] = useState<Post | null>(null);
  const [imageError, setImageError] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  let loadedPost: Post | null = null;
  if (previewData !== null) {
    try {
      const [search, savedPosts = ""] = previewData.split("\u0000");
      const postId = new URLSearchParams(search).get("id");

      if (savedPosts) {
        const parsed: unknown = JSON.parse(savedPosts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const selectedPost = postId
            ? parsed.find((item: Post) => item.id === postId)
            : parsed[0];
          loadedPost = selectedPost || DEFAULT_POST;
        }
      }
    } catch (error) {
      console.error("Unable to load blog preview:", error);
      loadedPost = DEFAULT_POST;
    }
    loadedPost ??= DEFAULT_POST;
  }
  const post = postOverride ?? loadedPost;
  const isLoading = previewData === null;

  const handleShare = useCallback(async () => {
    if (!post) return;
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareMessage("Preview link copied!");
      }
    } catch {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage("Preview link copied!");
    }
  }, [post]);

  const handleUnpublish = () => {
    if (!post) return;

    const confirmed = window.confirm(
      "Are you sure you want to move this published post to drafts?",
    );

    if (!confirmed) return;

    try {
      const savedPosts = localStorage.getItem(STORAGE_KEY);
      const posts: Post[] = savedPosts ? JSON.parse(savedPosts) : [];

      const updatedPosts = posts.map((item) =>
        item.id === post.id ? { ...item, status: "draft" as PostStatus } : item,
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
      setPostOverride((current) =>
        current ? { ...current, status: "draft" } : current,
      );
    } catch (error) {
      console.error("Unable to update post status:", error);
      window.alert("Unable to update the post. Please try again.");
    }
  };

  const handlePreviewOnSite = () => {
    if (!post) return;

    if (post.canonicalUrl) {
      window.open(post.canonicalUrl, "_blank", "noopener,noreferrer");
      return;
    }

    window.alert("This post does not have a canonical URL set.");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-4">
        <p className="text-sm text-[#64748B]">Loading blog preview...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-4">
        <div className="w-full max-w-md rounded-xl border border-[#E2E8F0] bg-white p-6 text-center shadow-sm">
          <FileText className="mx-auto mb-3 h-10 w-10 text-[#94A3B8]" />
          <h1 className="text-lg font-bold text-[#0F172A]">
            Blog post not found
          </h1>
          <button
            type="button"
            onClick={() => router.push("/blog")}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#E05318] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c84612]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog Management
          </button>
        </div>
      </div>
    );
  }

  const publicationDate = post.publishedOn;
  const readingTime = getReadingTime(post.content);
  const authorInitial = post.author ? post.author.charAt(0).toUpperCase() : "N";
  const isPublished = post.status?.toLowerCase() === "published";

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-sans text-[#1E293B] pb-12">
      {/* TOP HEADER NAVIGATION */}
      <header className="bg-[#F8FAFC] px-6 pt-6 pb-4">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/blog")}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#475569] shadow-sm hover:bg-[#F1F5F9]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </div>

        <div className="mx-auto mt-4 flex max-w-[1280px] flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              Blog Preview
            </h1>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#64748B]">
              <Link href="/blog" className="text-[#006837] hover:underline">
                Blog Management
              </Link>
              <span className="text-[#94A3B8]">&gt;</span>
              <Link href="/blog" className="text-[#64748B] hover:underline">
                All Posts
              </Link>
              <span className="text-[#94A3B8]">&gt;</span>
              <span className="font-semibold text-[#0F172A]">Blog Preview</span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                router.push(`/blog/edit?id=${encodeURIComponent(post.id)}`)
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#F97316] bg-white px-4 py-2 text-xs font-semibold text-[#EA580C] shadow-sm transition hover:bg-[#FFF7ED]"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Post
            </button>

            {/* UNPUBLISH BUTTON */}
            {isPublished && (
              <button
                type="button"
                onClick={handleUnpublish}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#F97316] bg-white px-4 py-2 text-xs font-semibold text-[#D97706] shadow-sm transition hover:bg-[#FFFBEB]"
              >
                Unpublish
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold text-[#475569] shadow-sm transition hover:bg-[#F8FAFC]"
            >
              <Share2 className="h-3.5 w-3.5 text-[#64748B]" />
              Share
            </button>

            <button
              type="button"
              onClick={handlePreviewOnSite}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#006837] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#00522c]"
            >
              Preview on Site
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {shareMessage && (
        <div className="mx-auto max-w-[1280px] px-6 text-xs font-medium text-[#006837]">
          {shareMessage}
        </div>
      )}

      {/* MAIN CONTENT GRID */}
      <main className="mx-auto mt-2 grid max-w-[1280px] grid-cols-1 gap-6 px-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT COLUMN: ARTICLE CONTENT */}
        <article className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm sm:p-8">
          {/* POST STATUS & DATE */}
          <div className="mb-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusStyle(
                post.status,
              )}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {getStatusLabel(post.status)}
            </span>
            <span className="text-xs text-[#94A3B8]">•</span>
            <span className="text-xs text-[#64748B]">
              {formatDate(publicationDate)}
            </span>
          </div>

          {/* TITLE */}
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            {post.title}
          </h1>

          {/* AUTHOR BAR */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#F1F5F9] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#006837] text-xs font-bold text-white">
                {authorInitial}
              </span>
              <div>
                <p className="text-xs font-bold text-[#0F172A]">
                  {post.author}
                </p>
                <p className="text-[11px] text-[#64748B]">{post.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#64748B]">
              <div className="inline-flex items-center gap-1">
                <Eye className="h-3.5 w-3.5 text-[#94A3B8]" />
                <span>{(post.views || 1245).toLocaleString()} views</span>
              </div>
              <span>•</span>
              <div className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-[#94A3B8]" />
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>

          {/* COVER IMAGE CONTAINER */}
          <div className="mt-6 overflow-hidden rounded-xl bg-[#2A0E43]">
            {post.coverImage && !imageError ? (
              <div className="relative aspect-[16/8] w-full">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  unoptimized
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="flex aspect-[16/8] w-full flex-col items-center justify-center bg-gradient-to-r from-[#1E0836] via-[#2D1252] to-[#42135C] p-6 text-center text-white">
                <div className="mb-2 flex items-center justify-center gap-1.5 opacity-80">
                  <span className="text-lg">🍷</span>
                  <span className="text-lg">🍸</span>
                  <span className="text-lg">🍷</span>
                </div>
                <h3 className="text-xl font-bold tracking-wide text-[#F97316]">
                  Hosté
                </h3>
              </div>
            )}
          </div>

          {/* EXCERPT & BODY */}
          <div className="mt-6 text-sm text-[#475569]">
            <p className="leading-relaxed text-[#334155]">{post.excerpt}</p>

            <div
              className="blog-preview-content mt-4 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: post.content || "<p>No content available.</p>",
              }}
            />
          </div>
        </article>

        {/* RIGHT COLUMN: SIDEBAR */}
        <aside className="space-y-5">
          {/* POST INFORMATION */}
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="border-b border-[#F1F5F9] pb-3 text-xs font-bold text-[#0F172A]">
              Post Information
            </h2>

            <div className="mt-3.5 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Status</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${getStatusStyle(
                    post.status,
                  )}`}
                >
                  {getStatusLabel(post.status)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Post ID</span>
                <span className="font-semibold text-[#0F172A]">
                  #{post.id ? post.id : "BLOG-128"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Author</span>
                <div className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#006837] text-[9px] font-bold text-white">
                    {authorInitial}
                  </span>
                  {post.author}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Category</span>
                <span className="rounded bg-[#E6F4EA] px-2 py-0.5 text-[11px] font-medium text-[#006837]">
                  {post.category || "Event Planning"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Tags</span>
                <div className="flex gap-1">
                  {(post.tags && post.tags.length > 0
                    ? post.tags
                    : ["Event Staff", "Hiring Tips"]
                  ).map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-[#FEF3C7] px-1.5 py-0.5 text-[10px] font-semibold text-[#B45309]"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[10px] text-[#64748B]">
                    +2
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-2">
                <span className="text-[#64748B]">Published On</span>
                <span className="font-semibold text-[#0F172A]">
                  {formatDate(publicationDate)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Last Updated</span>
                <span className="font-semibold text-[#0F172A]">
                  {formatDate(
                    "updatedAt" in post && typeof post.updatedAt === "string"
                      ? post.updatedAt
                      : publicationDate,
                  )}
                </span>
              </div>
            </div>
          </section>

          {/* SEO INFORMATION */}
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="border-b border-[#F1F5F9] pb-3 text-xs font-bold text-[#0F172A]">
              SEO Information
            </h2>

            <div className="mt-3 space-y-3 text-xs">
              <div>
                <p className="text-[10px] text-[#64748B]">SEO Title</p>
                <p className="mt-0.5 font-semibold text-[#0F172A]">
                  {post.metaTitle || post.title}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-[#64748B]">Meta Description</p>
                <p className="mt-0.5 leading-relaxed text-[#475569]">
                  {post.metaDescription || post.excerpt}
                </p>
              </div>
            </div>
          </section>

          {/* POST STATISTICS */}
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="border-b border-[#F1F5F9] pb-3 text-xs font-bold text-[#0F172A]">
              Post Statistics
            </h2>

            <div className="mt-3.5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-[#F8FAFC] p-2.5">
                <div className="flex items-center justify-center gap-1 text-[10px] text-[#64748B]">
                  <Eye className="h-3 w-3 text-[#006837]" />
                  <span>Views</span>
                </div>
                <p className="mt-1 text-sm font-bold text-[#0F172A]">
                  {(post.views || 1245).toLocaleString()}
                </p>
              </div>

              <div className="rounded-lg bg-[#F8FAFC] p-2.5">
                <div className="flex items-center justify-center gap-1 text-[10px] text-[#64748B]">
                  <Heart className="h-3 w-3 text-[#DC2626]" />
                  <span>Likes</span>
                </div>
                <p className="mt-1 text-sm font-bold text-[#0F172A]">86</p>
              </div>

              <div className="rounded-lg bg-[#F8FAFC] p-2.5">
                <div className="flex items-center justify-center gap-1 text-[10px] text-[#64748B]">
                  <MessageSquare className="h-3 w-3 text-[#2563EB]" />
                  <span>Comments</span>
                </div>
                <p className="mt-1 text-sm font-bold text-[#0F172A]">12</p>
              </div>
            </div>
          </section>

          {/* CONTENT CHECKLIST */}
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="border-b border-[#F1F5F9] pb-3 text-xs font-bold text-[#0F172A]">
              Content Checklist
            </h2>

            <div className="mt-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#475569]">Featured Image</span>
                <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
              </div>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
