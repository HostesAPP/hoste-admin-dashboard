"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  FileText,
  Archive,
  Calendar,
} from "lucide-react";

import type { Post, PostStatus } from "@/features/blog/blog.types";

const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    title: "5 Things to Consider When Hiring Event Staff",
    excerpt:
      "Hiring the right event staff can make or break your event success. Discover top tips...",
    content:
      "<p>Hiring the right event staff can make or break your event experience.</p>",
    coverImage:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    author: "Naomi Admin",
    category: "Event Planning",
    tags: ["Staffing", "Events", "Management"],
    status: "published",
    publishedOn: "Aug 10, 2026 • 10:30 AM",
    views: 1245,
    slug: "5-things-to-consider-when-hiring-event-staff",
    metaTitle: "5 Things to Consider When Hiring Event Staff | Hosté",
    metaDescription:
      "Learn how to recruit and manage top-tier event staff for seamless events with Hosté expert strategies.",
  },
  {
    id: "post-2",
    title: "Hosté Introduces Group Booking Feature",
    excerpt:
      "We are excited to announce a new way to book multiple staff members effortlessly...",
    content: "<p>Managing high-volume event teams just got seamless.</p>",
    coverImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    author: "Naomi Admin",
    category: "Product Updates",
    tags: ["Features", "Announcements", "Group Booking"],
    status: "published",
    publishedOn: "Aug 05, 2026 • 02:15 PM",
    views: 978,
    slug: "hoste-introduces-group-booking-feature",
    metaTitle: "Hosté Introduces Group Booking Feature",
    metaDescription:
      "Book and manage entire event staff teams in seconds with Hosté new group booking system.",
  },
  {
    id: "post-3",
    title: "How to Prepare for Your First Event as a Hosté",
    excerpt:
      "Your first event is important. Here are some proven tips and checklists to stand out...",
    content:
      "<p>Stepping into your first gig through Hosté can feel exciting yet nerve-wracking.</p>",
    coverImage:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    author: "John Doe",
    category: "Tips & Guides",
    tags: ["Career", "Guide", "Best Practices"],
    status: "draft",
    views: 0,
    slug: "prepare-first-event-as-a-hoste",
    metaTitle: "Preparation Guide for New Hosté Staff",
    metaDescription:
      "Essential tips for event staff onboarding and first gig success.",
  },
  {
    id: "post-4",
    title: "Why Background Checks Matter for Event Staff",
    excerpt:
      "Trust and safety are at the heart of every successful event partnership...",
    content: "<p>Ensuring guest safety requires thorough verification.</p>",
    coverImage:
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    author: "Mary Jane",
    category: "Safety",
    tags: ["Security", "Trust", "Verification"],
    status: "scheduled",
    scheduledFor: "2026-08-20T09:00",
    publishedOn: "Aug 20, 2026 • 09:00 AM",
    views: 0,
    slug: "why-background-checks-matter-for-event-staff",
    metaTitle: "Event Staff Safety & Background Checks | Hosté",
    metaDescription:
      "How verified background screening protects event hosts and guest experiences.",
  },
  {
    id: "post-5",
    title: "10 Tips for Planning a Successful Corporate Event",
    excerpt:
      "Planning a corporate event? Here are 10 proven strategies from industry leaders...",
    content:
      "<p>Corporate events demand precision, clear brand messaging, and seamless execution.</p>",
    coverImage:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    author: "Naomi Admin",
    category: "Event Planning",
    tags: ["Corporate", "Event Strategy", "Planning"],
    status: "published",
    publishedOn: "Jul 28, 2026 • 11:45 AM",
    views: 1876,
    slug: "10-tips-for-planning-successful-corporate-event",
    metaTitle: "10 Corporate Event Planning Tips | Hosté",
    metaDescription:
      "Maximize engagement and ROI with our expert corporate event checklist.",
  },
  {
    id: "post-6",
    title: "How to Manage Last-Minute Event Bookings",
    excerpt:
      "Last-minute bookings can be stressful. Here is how our automated system helps...",
    content:
      "<p>Emergency staffing requests don't have to ruin your event timeline.</p>",
    coverImage:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
    author: "John Doe",
    category: "Tips & Guides",
    tags: ["Urgent", "On-Demand", "Solutions"],
    status: "archived",
    publishedOn: "Jul 12, 2026 • 04:20 PM",
    views: 654,
    slug: "how-to-manage-last-minute-event-bookings",
    metaTitle: "Managing Last Minute Event Staffing | Hosté",
    metaDescription: "Quick response tips for sudden event staffing changes.",
  },
];

const CATEGORIES = [
  "Event Planning",
  "Product Updates",
  "Tips & Guides",
  "Safety",
  "Industry News",
];

const AUTHORS = ["Naomi Admin", "John Doe", "Mary Jane", "Alex Rivera"];

const STORAGE_KEY = "hoste_blog_management_posts";
const PAGE_SIZE = 5;

function getCategoryStyle(category: string): string {
  switch (category) {
    case "Event Planning":
      return "bg-[#E6F4EA] text-[#006837]";
    case "Product Updates":
      return "bg-[#FEF3C7] text-[#92400E]";
    case "Tips & Guides":
      return "bg-[#F3E8FF] text-[#6B21A8]";
    case "Safety":
      return "bg-[#E0F2FE] text-[#0369A1]";
    default:
      return "bg-[#F3F4F6] text-[#374151]";
  }
}

function getStatusBadge(status: PostStatus) {
  const styles: Record<PostStatus, string> = {
    published: "bg-[#E6F4EA] text-[#006837]",
    draft: "bg-[#FEF3C7] text-[#B45309]",
    scheduled: "bg-[#F3E8FF] text-[#6B21A8]",
    archived: "bg-[#F3F4F6] text-[#4B5563]",
  };

  const dots: Record<PostStatus, string> = {
    published: "bg-[#006837]",
    draft: "bg-[#D97706]",
    scheduled: "bg-[#9333EA]",
    archived: "bg-[#6B7280]",
  };

  const labels: Record<PostStatus, string> = {
    published: "Published",
    draft: "Draft",
    scheduled: "Scheduled",
    archived: "Archived",
  };

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1 rounded-full px-1.5 py-1 text-[9px] font-semibold leading-3 ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dots[status]}`} />
      <span className="break-words">{labels[status]}</span>
    </span>
  );
}

function getDateValue(value?: string): string {
  if (!value) return "";
  const datePart = value.split(" • ")[0];
  const parsed = new Date(datePart);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function BlogManagementApp() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedAuthor, setSelectedAuthor] = useState("All Authors");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const savedPosts = localStorage.getItem(STORAGE_KEY);
        if (savedPosts) {
          const parsed: unknown = JSON.parse(savedPosts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPosts(parsed as Post[]);
          } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
          }
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
        }
      } catch (error) {
        console.error("Unable to load blog posts:", error);
      } finally {
        setIsStorageLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isStorageLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error("Unable to save blog posts:", error);
    }
  }, [posts, isStorageLoaded]);

  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.status === "published").length;
    const draft = posts.filter((p) => p.status === "draft").length;
    const scheduled = posts.filter((p) => p.status === "scheduled").length;
    const archived = posts.filter((p) => p.status === "archived").length;

    const percentage = (val: number) =>
      total ? ((val / total) * 100).toFixed(1).replace(/\.0$/, "") : "0";

    return {
      total,
      published,
      publishedPct: percentage(published),
      draft,
      draftPct: percentage(draft),
      scheduled,
      scheduledPct: percentage(scheduled),
      archived,
      archivedPct: percentage(archived),
    };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All Categories" ||
        post.category === selectedCategory;

      const matchesAuthor =
        selectedAuthor === "All Authors" || post.author === selectedAuthor;

      const matchesStatus =
        selectedStatus === "All Status" || post.status === selectedStatus;

      const matchesDate =
        !selectedDate ||
        getDateValue(post.publishedOn) === selectedDate ||
        (post.status === "scheduled" &&
          post.scheduledFor?.slice(0, 10) === selectedDate);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAuthor &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    posts,
    searchQuery,
    selectedCategory,
    selectedAuthor,
    selectedStatus,
    selectedDate,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPosts = filteredPosts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts((previous) => previous.filter((post) => post.id !== id));
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedAuthor("All Authors");
    setSelectedStatus("All Status");
    setSelectedDate("");
    setShowDateFilter(false);
    setCurrentPage(1);
  };

  const openPreview = (post: Post) => {
    router.push(`/blog/preview?id=${encodeURIComponent(post.id)}`);
  };

  // Navigates directly to your /blog/edit folder with the post's ID
  const openEdit = (post: Post) => {
    router.push(`/blog/edit?id=${encodeURIComponent(post.id)}`);
  };

  return (
    <div className="min-h-screen w-full min-w-0 max-w-full overflow-x-clip bg-[#F8FAFC] p-3 font-sans text-xs text-[#1E293B] selection:bg-[#EF5A22]/20 selection:text-[#EF5A22] sm:p-4 lg:p-6">
      <div className="mx-auto w-full min-w-0 max-w-[1320px] space-y-4">
        <div className="flex min-w-0 flex-col items-start justify-between gap-3 pb-1 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">
              Blog Management
            </h1>
            <p className="mt-0.5 text-[11px] text-[#64748B]">
              Manage and organize all blog posts
            </p>
          </div>

          <Link
            href="/blog/create"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#E05318] px-4 py-2 text-xs font-medium text-white shadow-sm transition-all duration-150 hover:bg-[#c84612] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Create New Post
          </Link>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF2ED] text-[#EF5A22]">
              <Plus className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-[#64748B]">
                Total Posts
              </span>
              <div className="text-xl font-bold leading-tight text-[#0F172A]">
                {stats.total}
              </div>
              <span className="text-[10px] text-[#94A3B8]">All posts</span>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6F4EA] text-[#006837]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-[#64748B]">
                Published
              </span>
              <div className="text-xl font-bold leading-tight text-[#0F172A]">
                {stats.published}
              </div>
              <span className="text-[10px] font-semibold text-[#006837]">
                {stats.publishedPct}% of total
              </span>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FEF3C7] text-[#B45309]">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-[#64748B]">
                Drafts
              </span>
              <div className="text-xl font-bold leading-tight text-[#0F172A]">
                {stats.draft}
              </div>
              <span className="text-[10px] text-[#94A3B8]">
                {stats.draftPct}% of total
              </span>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F3E8FF] text-[#6B21A8]">
              <Clock className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-[#64748B]">
                Scheduled
              </span>
              <div className="text-xl font-bold leading-tight text-[#0F172A]">
                {stats.scheduled}
              </div>
              <span className="text-[10px] text-[#94A3B8]">
                {stats.scheduledPct}% of total
              </span>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FEE2E2] text-[#DC2626]">
              <Archive className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-[#64748B]">
                Archived
              </span>
              <div className="text-xl font-bold leading-tight text-[#0F172A]">
                {stats.archived}
              </div>
              <span className="text-[10px] text-[#94A3B8]">
                {stats.archivedPct}% of total
              </span>
            </div>
          </div>
        </div>

        <div className="w-full min-w-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="flex min-w-0 flex-col gap-3 border-b border-[#E2E8F0] bg-[#FAFAFA] p-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full min-w-0 xl:max-w-sm xl:flex-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts by title, author or category..."
                className="w-full min-w-0 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] py-2 pl-8 pr-3 text-xs text-[#334155] transition-all placeholder:text-[#94A3B8] focus:border-[#EF5A22] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EF5A22]/20"
              />
            </div>

            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="mr-1 text-[11px] font-medium text-[#64748B]">
                Filter by:
              </span>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="max-w-full rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-[11px] text-[#334155] focus:border-[#EF5A22] focus:outline-none"
              >
                <option>All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="max-w-full rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-[11px] text-[#334155] focus:border-[#EF5A22] focus:outline-none"
              >
                <option>All Authors</option>
                {AUTHORS.map((auth) => (
                  <option key={auth} value={auth}>
                    {auth}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="max-w-full rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-[11px] text-[#334155] focus:border-[#EF5A22] focus:outline-none"
              >
                <option>All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>

              <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-2.5 py-1.5 text-[11px] text-[#475569]">
                <input
                  type="checkbox"
                  id="selectDate"
                  checked={showDateFilter}
                  onChange={(e) => {
                    setShowDateFilter(e.target.checked);
                    if (!e.target.checked) setSelectedDate("");
                  }}
                  className="h-3.5 w-3.5 cursor-pointer rounded border-gray-300 text-[#E05318] focus:ring-[#E05318]"
                />
                <label htmlFor="selectDate" className="cursor-pointer">
                  Select Date
                </label>
              </div>

              {showDateFilter && (
                <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-2 py-1">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-[#64748B]" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-[125px] max-w-full bg-transparent text-[11px] text-[#334155] outline-none"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="ml-1 rounded-lg border border-[#006837] px-3 py-1.5 text-[11px] font-semibold text-[#006837] transition-colors hover:bg-[#E6F4EA]"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="w-full min-w-0 overflow-hidden">
            <table className="w-full table-fixed border-collapse text-left">
              <colgroup>
                <col style={{ width: "29%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "7%" }} />
                <col style={{ width: "12%" }} />
              </colgroup>

              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[9px] font-bold uppercase tracking-wide text-[#64748B]">
                  <th className="px-2 py-3">TITLE</th>
                  <th className="px-1.5 py-3">AUTHOR</th>
                  <th className="px-1.5 py-3">CATEGORY</th>
                  <th className="px-1.5 py-3">STATUS</th>
                  <th className="px-1.5 py-3">PUBLISHED ON</th>
                  <th className="px-1 py-3">VIEWS</th>
                  <th className="px-1 py-3 text-center">ACTIONS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E2E8F0]">
                {paginatedPosts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-10 text-center text-[11px] text-[#64748B]"
                    >
                      No blog posts match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="group transition-colors hover:bg-[#F8FAFC]"
                    >
                      <td className="px-2 py-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            width={44}
                            height={32}
                            unoptimized
                            className="h-8 w-11 shrink-0 rounded border border-[#E2E8F0] bg-gray-100 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="break-words text-[10px] font-bold leading-4 text-[#0F172A] group-hover:text-[#EF5A22]">
                              {post.title}
                            </h4>
                            <p className="mt-0.5 line-clamp-2 break-words text-[9px] leading-3.5 text-[#64748B]">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="break-words px-1.5 py-3 text-[10px] text-[#475569]">
                        {post.author}
                      </td>

                      <td className="px-1.5 py-3">
                        <span
                          className={`inline-block max-w-full rounded-full px-2 py-1 text-center text-[9px] font-semibold ${getCategoryStyle(
                            post.category,
                          )}`}
                        >
                          {post.category}
                        </span>
                      </td>

                      <td className="px-1.5 py-3">
                        {getStatusBadge(post.status)}
                      </td>

                      <td className="break-words px-1.5 py-3 text-[9px] text-[#64748B]">
                        {post.status === "draft"
                          ? "-"
                          : post.publishedOn ||
                            (post.status === "scheduled"
                              ? post.scheduledFor || "-"
                              : "-")}
                      </td>

                      <td className="break-words px-1 py-3 text-[10px] text-[#475569]">
                        {post.status === "published" ||
                        post.status === "archived"
                          ? post.views.toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-1 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            title="Preview Post"
                            onClick={() => openPreview(post)}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            title="Edit Post"
                            onClick={() => openEdit(post)}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F1F5F9] text-[#64748B] hover:bg-[#FFF2ED] hover:text-[#EF5A22]"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            title="Delete Post"
                            onClick={() => handleDelete(post.id)}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FEE2E2]/60 text-[#DC2626] hover:bg-[#FEE2E2]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] bg-white p-3 text-[11px] text-[#64748B]">
            <div>
              Showing{" "}
              <span className="font-semibold text-[#0F172A]">
                {filteredPosts.length === 0
                  ? 0
                  : (safePage - 1) * PAGE_SIZE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#0F172A]">
                {Math.min(safePage * PAGE_SIZE, filteredPosts.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#0F172A]">
                {filteredPosts.length}
              </span>{" "}
              posts
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded border border-[#E2E8F0] p-1 hover:bg-[#F1F5F9] disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 font-medium text-[#0F172A]">
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="rounded border border-[#E2E8F0] p-1 hover:bg-[#F1F5F9] disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
