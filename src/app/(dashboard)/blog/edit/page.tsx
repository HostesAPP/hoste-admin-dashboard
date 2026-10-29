"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Save,
  Check,
  X,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Square,
  Columns,
  Rows,
  Table,
  Type,
  Calendar,
  Clock,
  Trash2,
  ChevronDown,
} from "lucide-react";

import type { Post, PostStatus } from "@/features/blog/blog.types";

const STORAGE_KEY = "hoste_blog_management_posts";

export default function EditBlogPost() {
  const router = useRouter();

  const initialPost = useMemo(() => {
    if (typeof window === "undefined") return null;

    try {
      const params = new URLSearchParams(window.location.search);
      const targetId = params.get("edit") || params.get("id");
      const savedPosts = window.localStorage.getItem(STORAGE_KEY);

      if (!savedPosts) return null;

      const parsed: unknown = JSON.parse(savedPosts);
      if (!Array.isArray(parsed) || parsed.length === 0) return null;

      return targetId
        ? parsed.find((item: Post) => item.id === targetId) ?? null
        : parsed[0] ?? null;
    } catch (error) {
      console.error("Unable to load post for editing:", error);
      return null;
    }
  }, []);

  const initialScheduledFor = initialPost?.scheduledFor;
  const initialScheduleDate = initialScheduledFor
    ? initialScheduledFor.split("T")[0] || "2026-08-20"
    : "2026-08-20";
  const initialScheduleTime = initialScheduledFor
    ? initialScheduledFor.split("T")[1] || "09:00"
    : "09:00";

  const [postId] = useState<string | null>(initialPost?.id ?? null);
  const [title, setTitle] = useState(
    initialPost?.title || "5 Things to Consider When Hiring Event Staff",
  );
  const [excerpt, setExcerpt] = useState(
    initialPost?.excerpt ||
      "Hiring the right event staff can make or break your event.",
  );
  const [content, setContent] = useState(
    initialPost?.content ||
      `Hiring the right event staff can make or break your event. From professionalism to reliability, the right team ensures everything runs smoothly while you focus on enjoying the occasion.\n\nHere are five key factors to keep in mind:\n\n1. Experience Matters\nLook for staff who have prior experience in the type of event you are hosting. Experienced staff can handle unexpected situations with ease and maintain a high level of service.\n\n2. Professionalism & Attitude\nA positive attitude, good communication, and professionalism go a long way in creating a great experience for your guests.`,
  );
  const [status, setStatus] = useState<PostStatus>(
    initialPost?.status || "published",
  );
  const [scheduleDate, setScheduleDate] = useState(initialScheduleDate);
  const [scheduleTime, setScheduleTime] = useState(initialScheduleTime);
  const [seoTitle, setSeoTitle] = useState(
    initialPost?.metaTitle || initialPost?.title ||
      "5 Things to Consider When Hiring Event Staff | Hosté",
  );
  const [metaDescription, setMetaDescription] = useState(
    initialPost?.metaDescription || initialPost?.excerpt ||
      "Discover the top 5 things to consider when hiring event staff for your next event to ensure a successful and stress-free experience.",
  );
  const [slug, setSlug] = useState(
    initialPost?.slug ||
      "5-things-to-consider-when-hiring-event-staff",
  );
  const [category, setCategory] = useState(
    initialPost?.category || "Event Planning",
  );
  const [tags, setTags] = useState<string[]>(initialPost?.tags || [
    "Event Staff",
    "Hiring Tips",
  ]);
  const [author, setAuthor] = useState(
    initialPost?.author || "Naomi Admin",
  );
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage || "");
  const [publishedOn] = useState(initialPost?.publishedOn || "");
  const [views] = useState(initialPost?.views || 1245);

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSaveOrUpdate = (targetStatus?: PostStatus) => {
    try {
      const savedPosts = localStorage.getItem(STORAGE_KEY);
      const posts: Post[] = savedPosts ? JSON.parse(savedPosts) : [];

      const activeStatus = targetStatus || status;
      const effectiveId = postId || "post-" + Date.now();

      const updatedPost: Post = {
        id: effectiveId,
        title,
        excerpt,
        content,
        coverImage,
        author,
        category,
        tags,
        status: activeStatus,
        publishedOn:
          activeStatus === "published"
            ? publishedOn || "Aug 10, 2026 • 10:30 AM"
            : "",
        scheduledFor:
          activeStatus === "scheduled" ? `${scheduleDate}T${scheduleTime}` : "",
        views,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        metaTitle: seoTitle || title,
        metaDescription: metaDescription || excerpt,
      };

      const existingIndex = posts.findIndex((p) => p.id === effectiveId);
      let updatedPostsList: Post[] = [];

      if (existingIndex >= 0) {
        updatedPostsList = posts.map((p) =>
          p.id === effectiveId ? updatedPost : p,
        );
      } else {
        updatedPostsList = [updatedPost, ...posts];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPostsList));
      router.push("/blog");
    } catch (error) {
      console.error("Failed to save post:", error);
      window.alert("Unable to save changes. Please try again.");
    }
  };

  const handleDelete = () => {
    if (!postId) return;
    if (window.confirm("Are you sure you want to move this post to trash?")) {
      try {
        const savedPosts = localStorage.getItem(STORAGE_KEY);
        if (savedPosts) {
          const posts: Post[] = JSON.parse(savedPosts);
          const filtered = posts.filter((p) => p.id !== postId);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        }
        router.push("/blog");
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <button
              onClick={() => router.push("/blog")}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="pt-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Edit Blog Post
              </h1>
              <p className="text-sm text-gray-500">
                Update your blog post details and content.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/blog/preview${postId ? `?id=${encodeURIComponent(postId)}` : ""}`,
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
            >
              <Eye className="w-4 h-4 text-gray-500" />
              Preview
            </button>

            <button
              type="button"
              onClick={() => handleSaveOrUpdate("draft")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
            >
              <Save className="w-4 h-4 text-gray-500" />
              Save Draft
            </button>

            <button
              type="button"
              onClick={() => handleSaveOrUpdate()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#006837] text-white text-sm font-medium hover:bg-[#00522c] shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              Update Post
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] transition-all pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  {title.length}/100
                </span>
              </div>
            </div>

            {/* Featured Image & Excerpt Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Featured Image Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Featured Image <span className="text-red-500">*</span>
                </label>

                <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 h-36 flex items-center justify-center shadow-inner">
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <div
                    onClick={() => setCoverImage("")}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xl font-bold tracking-widest text-pink-500 drop-shadow-md">
                    Hosté
                  </span>
                  <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-pink-600/40 blur-sm"></div>
                  <div className="absolute top-4 left-6 w-8 h-8 rounded-full bg-indigo-500/40 blur-sm"></div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    className="flex-1 py-2 px-3 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm text-center"
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="flex-1 py-2 px-3 rounded-lg border border-gray-200 bg-white text-xs font-medium text-red-600 hover:bg-red-50 transition-colors shadow-sm text-center"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 text-center">
                  Recommended size: 1200 × 630px (JPG, PNG, WebP)
                </p>
              </div>

              {/* Excerpt Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Excerpt <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      rows={5}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] transition-all resize-none"
                    />
                    <span className="absolute bottom-3 right-3 text-xs text-gray-400">
                      {excerpt.length}/160
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Editor Box */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 pb-3 border-b border-gray-100 flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Content <span className="text-red-500">*</span>
                </label>
              </div>

              {/* Toolbar */}
              <div className="bg-gray-50/80 border-b border-gray-200 px-4 py-2 flex items-center gap-1 flex-wrap text-gray-600">
                <button
                  type="button"
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded hover:bg-gray-200/60 transition-colors"
                >
                  Paragraph <ChevronDown className="w-3 h-3" />
                </button>
                <div className="h-4 w-px bg-gray-300 mx-1" />
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-200/60 transition-colors"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-200/60 transition-colors"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-200/60 transition-colors"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-gray-300 mx-1" />
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-200/60 transition-colors"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-200/60 transition-colors"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-gray-300 mx-1" />
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-200/60 transition-colors"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-200/60 transition-colors"
                >
                  <Code className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-gray-300 mx-1" />
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-200/60 transition-colors"
                >
                  <Square className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-200/60 transition-colors"
                >
                  <Columns className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-200/60 transition-colors"
                >
                  <Rows className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-200/60 transition-colors"
                >
                  <Table className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-gray-300 mx-1" />
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-gray-200/60 transition-colors"
                >
                  <Type className="w-4 h-4" />
                </button>
              </div>

              {/* Text Area Content */}
              <div className="p-5">
                <textarea
                  rows={14}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-sm text-gray-800 focus:outline-none resize-none leading-relaxed font-normal"
                />
              </div>

              {/* Editor Footer Status */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>
                  {content ? content.split(/\s+/).filter(Boolean).length : 0}{" "}
                  words
                </span>
                <div className="flex items-center gap-1.5">
                  <span>Saved a few seconds ago</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                </div>
              </div>
            </div>

            {/* Bottom Category, Tags, Author Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] pr-8"
                  >
                    <option>Event Planning</option>
                    <option>Product Updates</option>
                    <option>Tips & Guides</option>
                    <option>Safety</option>
                    <option>Industry News</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tags
                </label>
                <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg border border-gray-200 bg-white min-h-[38px]">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Author */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Author <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 bg-white pl-8 pr-8 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837]"
                  >
                    <option>Naomi Admin</option>
                    <option>John Doe</option>
                    <option>Mary Jane</option>
                    <option>Alex Rivera</option>
                  </select>
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#006837] text-white flex items-center justify-center text-[10px] font-bold">
                    {author ? author.charAt(0).toUpperCase() : "N"}
                  </div>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-900">
                Publish Settings
              </h2>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status <span className="text-red-500">*</span>
                </label>

                {/* Published Option */}
                <div
                  onClick={() => setStatus("published")}
                  className={`cursor-pointer rounded-lg border p-3 transition-all ${
                    status === "published"
                      ? "border-[#006837] bg-[#E6F4EA]/40 ring-1 ring-[#006837]/20"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "published"}
                      onChange={() => setStatus("published")}
                      className="mt-0.5 text-[#006837] focus:ring-[#006837]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Published
                      </p>
                      <p className="text-xs text-gray-500">
                        This post is live and visible to everyone.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Draft Option */}
                <div
                  onClick={() => setStatus("draft")}
                  className={`cursor-pointer rounded-lg border p-3 transition-all ${
                    status === "draft"
                      ? "border-[#B45309] bg-[#FEF3C7]/40 ring-1 ring-[#B45309]/20"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "draft"}
                      onChange={() => setStatus("draft")}
                      className="mt-0.5 text-[#B45309] focus:ring-[#B45309]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Draft
                      </p>
                      <p className="text-xs text-gray-500">
                        This post is saved as draft and not visible to users.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scheduled Option */}
                <div
                  onClick={() => setStatus("scheduled")}
                  className={`cursor-pointer rounded-lg border p-3 transition-all ${
                    status === "scheduled"
                      ? "border-[#6B21A8] bg-[#F3E8FF]/40 ring-1 ring-[#6B21A8]/20"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "scheduled"}
                      onChange={() => setStatus("scheduled")}
                      className="mt-0.5 text-[#6B21A8] focus:ring-[#6B21A8]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Scheduled
                      </p>
                      <p className="text-xs text-gray-500">
                        Schedule this post to be published at a future date.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule For section */}
              <div className="pt-2 space-y-2 border-t border-gray-100">
                <label className="block text-xs font-semibold text-gray-700">
                  Schedule For
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 pl-8 pr-2 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#006837]"
                    />
                    <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 pl-8 pr-2 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#006837]"
                    />
                    <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-900">SEO Settings</h2>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  SEO Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#006837] pr-14"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">
                    {seoTitle.length}/60
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Meta Description
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#006837] resize-none"
                  />
                  <span className="absolute bottom-2 right-2 text-[11px] text-gray-400">
                    {metaDescription.length}/160
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#006837]"
                />
                <p className="text-[11px] text-gray-400 truncate">
                  Your post URL: hoste.com/blog/{slug}
                </p>
              </div>
            </div>

            {/* Post Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-gray-900">Post Actions</h2>
              <button
                type="button"
                onClick={handleDelete}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-red-200 bg-white text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Move to Trash
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
