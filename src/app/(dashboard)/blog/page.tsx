"use client";

import React, { useMemo, useState } from "react";
import {
  Plus,
  CircleCheck,
  Pencil,
  Calendar,
  Archive,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ArrowLeft,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Table,
  Minus,
  Type,
  ChevronUp,
  Clock,
  Send,
} from "lucide-react";

type PostStatus = "Published" | "Draft" | "Scheduled" | "Archived";

type Post = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  status: PostStatus;
  date: string;
  time: string;
  views: string;
  image: string;
};

const initialPosts: Post[] = [
  {
    id: 1,
    title: "5 Things to Consider When Hiring Event Staff",
    excerpt: "Hiring the right event staff can make or break your...",
    author: "Naomi Admin",
    category: "Event Planning",
    status: "Published",
    date: "Aug 10, 2026",
    time: "10:30 AM",
    views: "1,245",
    image: "photo",
  },
  {
    id: 2,
    title: "Hosté Introduces Group Booking Feature",
    excerpt: "We are excited to announce a new way to book...",
    author: "Naomi Admin",
    category: "Product Updates",
    status: "Published",
    date: "Aug 05, 2026",
    time: "02:15 PM",
    views: "978",
    image: "photo2",
  },
  {
    id: 3,
    title: "How to Prepare for Your First Event as a Hosté",
    excerpt: "Your first event is important. Here are some tips...",
    author: "John Doe",
    category: "Tips & Guides",
    status: "Draft",
    date: "-",
    time: "",
    views: "-",
    image: "plain",
  },
  {
    id: 4,
    title: "Why Background Checks Matter for Event Staff",
    excerpt: "Trust and safety are at the heart of every...",
    author: "Mary Jane",
    category: "Safety",
    status: "Scheduled",
    date: "Aug 20, 2026",
    time: "09:00 AM",
    views: "-",
    image: "blue",
  },
  {
    id: 5,
    title: "10 Tips for Planning a Successful Corporate Event",
    excerpt: "Planning a corporate event? Here are 10 proven...",
    author: "Naomi Admin",
    category: "Event Planning",
    status: "Published",
    date: "Jul 28, 2026",
    time: "11:45 AM",
    views: "1,876",
    image: "green",
  },
  {
    id: 6,
    title: "How to Manage Last-Minute Event Bookings",
    excerpt: "Last-minute bookings can be stressful. Here's how...",
    author: "John Doe",
    category: "Tips & Guides",
    status: "Archived",
    date: "Jul 12, 2026",
    time: "04:20 PM",
    views: "654",
    image: "slate",
  },
];

const categories = [
  "All Categories",
  "Event Planning",
  "Product Updates",
  "Tips & Guides",
  "Safety",
];

const authors = ["All Authors", "Naomi Admin", "John Doe", "Mary Jane"];

const statuses = ["All Status", "Published", "Draft", "Scheduled", "Archived"];

function StatCard({
  title,
  count,
  subtitle,
  icon,
  color,
  background,
}: {
  title: string;
  count: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  background: string;
}) {
  return (
    <div className="flex h-[79px] min-w-0 items-start gap-[11px] rounded-[10px] border border-[#e4e9f0] bg-white px-[13px] py-[12px] shadow-[0_2px_8px_rgba(31,41,55,0.06)]">
      <div
        className="flex h-[32px] w-[35px] shrink-0 items-center justify-center rounded-[7px]"
        style={{ color, backgroundColor: background }}
      >
        {icon}
      </div>

      <div className="min-w-0 pt-[1px]">
        <p className="whitespace-nowrap text-[9px] leading-[12px] text-[#7c8ba5]">
          {title}
        </p>

        <p
          className="text-[17px] font-bold leading-[19px]"
          style={{ color: title === "Drafts" ? "#d97706" : color }}
        >
          {count}
        </p>

        <p
          className={`mt-[3px] whitespace-nowrap text-[8px] leading-[10px] ${
            title === "Published"
              ? "font-semibold text-[#187443]"
              : "text-[#91a0b8]"
          }`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: PostStatus }) {
  const styles: Record<PostStatus, string> = {
    Published: "bg-[#e6f4e9] text-[#176b3b]",
    Draft: "bg-[#fff2c5] text-[#b77900]",
    Scheduled: "bg-[#f1e5ff] text-[#9638f5]",
    Archived: "bg-[#edf1f6] text-[#697b95]",
  };

  const dots: Record<PostStatus, string> = {
    Published: "bg-[#187443]",
    Draft: "bg-[#d89b00]",
    Scheduled: "bg-[#a348ff]",
    Archived: "bg-[#7c8ba5]",
  };

  return (
    <span
      className={`inline-flex h-[19px] items-center gap-[4px] whitespace-nowrap rounded-full px-[7px] text-[8px] font-semibold ${styles[status]}`}
    >
      <span className={`h-[5px] w-[5px] rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const styles: Record<string, string> = {
    "Event Planning": "bg-[#e5f4e9] text-[#176b3b]",
    "Product Updates": "bg-[#ffedd5] text-[#c65c0b]",
    "Tips & Guides": "bg-[#f2e5ff] text-[#8438d8]",
    Safety: "bg-[#e0f2fe] text-[#1261a0]",
  };

  return (
    <span
      className={`inline-flex h-[19px] items-center justify-center whitespace-nowrap rounded-full px-[10px] text-[8px] font-semibold ${
        styles[category] || "bg-gray-100 text-gray-600"
      }`}
    >
      {category}
    </span>
  );
}

function PostThumbnail({ image }: { image: string }) {
  const base =
    "relative h-[32px] w-[49px] shrink-0 overflow-hidden rounded-[3px]";

  if (image === "photo") {
    return (
      <div className={`${base} bg-[#302044]`}>
        <div className="absolute inset-x-0 bottom-0 h-[13px] bg-gradient-to-t from-[#100b21] to-transparent" />
        <div className="absolute left-[4px] top-[12px] text-[8px] font-bold text-[#f15b31]">
          Hosté
        </div>
        <div className="absolute right-[4px] top-[5px] h-[19px] w-[14px] rounded-t-full bg-[#694ba0]" />
        <div className="absolute right-[1px] top-[9px] h-[20px] w-[8px] bg-[#ed5a24]" />
        <div className="absolute bottom-[4px] left-[4px] h-[2px] w-[28px] bg-[#8c71b1]" />
      </div>
    );
  }

  if (image === "photo2") {
    return (
      <div className={`${base} bg-[#33261e]`}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#201810] via-[#725039] to-[#211710]" />
        <div className="absolute bottom-[5px] left-[4px] h-[16px] w-[8px] rounded-t-full bg-[#171717]" />
        <div className="absolute bottom-[4px] left-[15px] h-[18px] w-[10px] rounded-t-full bg-[#171717]" />
        <div className="absolute bottom-[5px] right-[4px] h-[16px] w-[9px] rounded-t-full bg-[#171717]" />
        <div className="absolute inset-x-0 top-[7px] h-[2px] bg-[#c9a17c]/40" />
      </div>
    );
  }

  const colors: Record<string, string> = {
    plain: "#354156",
    blue: "#2988c9",
    green: "#20653c",
    slate: "#66758e",
  };

  return (
    <div
      className={`${base} rounded-[3px]`}
      style={{ backgroundColor: colors[image] || "#354156" }}
    />
  );
}

export default function BlogManagementPage() {
  const [currentView, setCurrentView] = useState<"dashboard" | "create">(
    "dashboard",
  );

  // Dashboard states
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [author, setAuthor] = useState("All Authors");
  const [status, setStatus] = useState("All Status");
  const [dateFilter, setDateFilter] = useState(false);
  const [page, setPage] = useState(1);

  // Create Post Form states
  const [blogTitle, setBlogTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [blogCategory, setBlogCategory] = useState("");
  const [blogTags, setBlogTags] = useState("");
  const [blogAuthor] = useState("Naomi Admin");
  const [postStatus, setPostStatus] = useState<
    "draft" | "publish" | "schedule"
  >("draft");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isPublishOpen, setIsPublishOpen] = useState(true);
  const [isSeoOpen, setIsSeoOpen] = useState(true);

  const pageSize = 6;
  const totalPageCount = 22;

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const term = search.toLowerCase();

      const matchesSearch =
        post.title.toLowerCase().includes(term) ||
        post.author.toLowerCase().includes(term) ||
        post.category.toLowerCase().includes(term);

      const matchesCategory =
        category === "All Categories" || post.category === category;

      const matchesAuthor = author === "All Authors" || post.author === author;

      const matchesStatus = status === "All Status" || post.status === status;

      const matchesDate = !dateFilter || post.date !== "-";

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAuthor &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [posts, search, category, author, status, dateFilter]);

  const visiblePosts = filteredPosts.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const resetFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setAuthor("All Authors");
    setStatus("All Status");
    setDateFilter(false);
    setPage(1);
  };

  const removePost = (id: number) => {
    setPosts((current) => current.filter((post) => post.id !== id));
    setPage(1);
  };

  const changePage = (nextPage: number) => {
    setPage(Math.max(1, Math.min(nextPage, totalPageCount)));
  };

  const published = posts.filter((post) => post.status === "Published").length;
  const drafts = posts.filter((post) => post.status === "Draft").length;
  const scheduled = posts.filter((post) => post.status === "Scheduled").length;
  const archived = posts.filter((post) => post.status === "Archived").length;

  const isOriginalData =
    posts.length === initialPosts.length &&
    search === "" &&
    category === "All Categories" &&
    author === "All Authors" &&
    status === "All Status" &&
    !dateFilter;

  const displayedTotal = isOriginalData ? 128 : filteredPosts.length;
  const startItem = filteredPosts.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, filteredPosts.length);

  // Render Create View
  if (currentView === "create") {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-[#171D2B] font-sans antialiased p-6 md:p-8">
        {/* Top Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView("dashboard")}
              className="p-1.5 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#171D2B] tracking-tight">
                Create Blog Post
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Share valuable insights and updates with the Hosté community.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView("dashboard")}
              className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Save Draft
            </button>
            <button
              type="button"
              className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => {
                if (blogTitle) {
                  const newPost: Post = {
                    id: Date.now(),
                    title: blogTitle,
                    excerpt: excerpt || "No excerpt provided...",
                    author: blogAuthor,
                    category: blogCategory || "Event Planning",
                    status:
                      postStatus === "publish"
                        ? "Published"
                        : postStatus === "schedule"
                          ? "Scheduled"
                          : "Draft",
                    date: "Oct 9, 2026",
                    time: "3:00 PM",
                    views: "0",
                    image: "plain",
                  };
                  setPosts([newPost, ...posts]);
                }
                setCurrentView("dashboard");
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#006837] text-xs font-semibold text-white hover:bg-[#00552D] transition"
            >
              <Send className="w-3.5 h-3.5 -rotate-45" />
              <span>Publish</span>
            </button>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-6">
          <span
            onClick={() => setCurrentView("dashboard")}
            className="text-[#006837] hover:underline cursor-pointer"
          >
            Blog Management
          </span>
          <span>&gt;</span>
          <span className="text-gray-900 font-semibold">Create Blog Post</span>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Content Form */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  Title <span className="text-[#EF5A22]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={100}
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="Enter blog post title..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs bg-white outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837] placeholder-gray-400"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                    {blogTitle.length}/100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2">
                    Featured Image <span className="text-[#EF5A22]">*</span>
                  </label>
                  <div className="border border-dashed border-gray-300 rounded-xl p-6 bg-[#FAFAFA] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#006837] transition h-[154px]">
                    <ImageIcon className="w-8 h-8 text-[#006837] mb-2 stroke-1" />
                    <span className="text-xs font-bold text-[#006837]">
                      Click to upload image
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Recommended size: 1200 × 630px
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Max size: 2MB (JPG, PNG, WebP)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2">
                    Excerpt <span className="text-[#EF5A22]">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      rows={6}
                      maxLength={160}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Write a short summary of your post..."
                      className="w-full p-3.5 border border-gray-200 rounded-xl text-xs bg-white outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837] resize-none placeholder-gray-400 h-[154px]"
                    />
                    <span className="absolute right-4 bottom-3 text-[10px] text-gray-400">
                      {excerpt.length}/160
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  Content <span className="text-[#EF5A22]">*</span>
                </label>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#F8F9FA] border-b border-gray-200 text-gray-600">
                    <button
                      type="button"
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium hover:bg-gray-200 rounded"
                    >
                      <span>Paragraph</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <div className="h-4 w-[1px] bg-gray-300 mx-1" />
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded"
                    >
                      <Underline className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded"
                    >
                      <Strikethrough className="w-3.5 h-3.5" />
                    </button>
                    <div className="h-4 w-[1px] bg-gray-300 mx-1" />
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded"
                    >
                      <Link className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded"
                    >
                      <Table className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-200 rounded"
                    >
                      <Type className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    rows={10}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your blog post content here..."
                    className="w-full p-4 text-xs bg-white outline-none resize-none placeholder-gray-400 min-h-[220px]"
                  />

                  <div className="flex items-center justify-between px-4 py-2 bg-white border-t border-gray-100 text-[11px] text-gray-400">
                    <span>0 words</span>
                    <span>Powered by Tiptap</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2">
                    Category <span className="text-[#EF5A22]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white outline-none focus:border-[#006837] appearance-none cursor-pointer text-gray-600"
                    >
                      <option value="">Select a category</option>
                      <option value="Event Planning">Event Planning</option>
                      <option value="Product Updates">Product Updates</option>
                      <option value="Tips & Guides">Tips & Guides</option>
                      <option value="Safety">Safety</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2">
                    Tags
                  </label>
                  <div className="relative">
                    <select
                      value={blogTags}
                      onChange={(e) => setBlogTags(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white outline-none focus:border-[#006837] appearance-none cursor-pointer text-gray-600"
                    >
                      <option value="">Select or add tags...</option>
                      <option value="news">News</option>
                      <option value="booking">Booking</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2">
                    Author <span className="text-[#EF5A22]">*</span>
                  </label>
                  <div className="relative flex items-center border border-gray-200 rounded-xl px-3 py-1.5 bg-white">
                    <div className="w-6 h-6 rounded-full bg-[#006837] text-white text-[10px] font-bold flex items-center justify-center mr-2">
                      N
                    </div>
                    <span className="text-xs font-medium text-gray-800 flex-1">
                      {blogAuthor}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar Settings */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div
                onClick={() => setIsPublishOpen(!isPublishOpen)}
                className="flex items-center justify-between cursor-pointer"
              >
                <h2 className="text-sm font-bold text-gray-900">
                  Publish Settings
                </h2>
                {isPublishOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>

              {isPublishOpen && (
                <div className="space-y-4 pt-2">
                  <span className="block text-xs font-bold text-gray-700">
                    Status
                  </span>
                  <div className="space-y-3">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={postStatus === "draft"}
                        onChange={() => setPostStatus("draft")}
                        className="mt-0.5 accent-[#EF5A22]"
                      />
                      <div>
                        <div className="text-xs font-bold text-gray-800">
                          Draft
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Saved as draft and not visible to users.
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={postStatus === "publish"}
                        onChange={() => setPostStatus("publish")}
                        className="mt-0.5 accent-[#EF5A22]"
                      />
                      <div>
                        <div className="text-xs font-bold text-gray-800">
                          Publish
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Make this post live and visible to everyone.
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={postStatus === "schedule"}
                        onChange={() => setPostStatus("schedule")}
                        className="mt-0.5 accent-[#EF5A22]"
                      />
                      <div>
                        <div className="text-xs font-bold text-gray-800">
                          Schedule
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Choose a future date to publish this post.
                        </div>
                      </div>
                    </label>
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold text-gray-600 mb-1.5">
                      Schedule For
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          placeholder="Select date"
                          className="w-full pl-8 pr-3 py-2 bg-[#F8F9FA] border border-gray-200 rounded-lg text-xs outline-none focus:border-[#006837]"
                        />
                      </div>
                      <div className="relative">
                        <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          placeholder="Select time"
                          className="w-full pl-8 pr-3 py-2 bg-[#F8F9FA] border border-gray-200 rounded-lg text-xs outline-none focus:border-[#006837]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div
                onClick={() => setIsSeoOpen(!isSeoOpen)}
                className="flex items-center justify-between cursor-pointer"
              >
                <h2 className="text-sm font-bold text-gray-900">
                  SEO Settings
                </h2>
                {isSeoOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>

              {isSeoOpen && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      SEO Title
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={60}
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder="Enter SEO title..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white outline-none focus:border-[#006837]"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                        {seoTitle.length}/60
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Meta Description
                    </label>
                    <div className="relative">
                      <textarea
                        rows={3}
                        maxLength={160}
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder="Enter meta description..."
                        className="w-full p-3 border border-gray-200 rounded-lg text-xs bg-white outline-none focus:border-[#006837] resize-none"
                      />
                      <span className="absolute right-3 bottom-2 text-[10px] text-gray-400">
                        {metaDescription.length}/160
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard view render
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#171D2B] font-sans antialiased p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#171D2B] tracking-tight">
            Blog Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your community articles, updates, and resources.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentView("create")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#006837] text-xs font-semibold text-white hover:bg-[#00552D] transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Blog Post</span>
        </button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Published Posts"
          count={published.toString()}
          subtitle="Active on site"
          icon={<CircleCheck className="w-5 h-5" />}
          color="#006837"
          background="#E6F4EA"
        />
        <StatCard
          title="Drafts"
          count={drafts.toString()}
          subtitle="Not published"
          icon={<Pencil className="w-5 h-5" />}
          color="#D97706"
          background="#FEF3C7"
        />
        <StatCard
          title="Scheduled"
          count={scheduled.toString()}
          subtitle="Upcoming posts"
          icon={<Calendar className="w-5 h-5" />}
          color="#7C3AED"
          background="#F5F3FF"
        />
        <StatCard
          title="Archived"
          count={archived.toString()}
          subtitle="Hidden posts"
          icon={<Archive className="w-5 h-5" />}
          color="#4B5563"
          background="#F3F4F6"
        />
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative min-w-[240px] flex-1 sm:flex-none">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search blog posts..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#006837] focus:bg-white transition"
              />
            </div>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-[#006837] cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-[#006837] cursor-pointer"
            >
              {authors.map((auth) => (
                <option key={auth} value={auth}>
                  {auth}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:border-[#006837] cursor-pointer"
            >
              {statuses.map((stat) => (
                <option key={stat} value={stat}>
                  {stat}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                setDateFilter(!dateFilter);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs transition ${
                dateFilter
                  ? "bg-[#006837] text-white border-[#006837]"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Filter Date</span>
            </button>
          </div>

          {!isOriginalData && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-[#006837] hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Posts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Views</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs text-gray-700">
              {visiblePosts.length > 0 ? (
                visiblePosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <PostThumbnail image={post.image} />
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">
                            {post.title}
                          </p>
                          <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <CategoryBadge category={post.category} />
                    </td>
                    <td className="py-3 px-4 font-medium">{post.author}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900">{post.date}</div>
                      <div className="text-[10px] text-gray-400">
                        {post.time}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{post.views}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => removePost(post.id)}
                          className="px-2 py-1 text-[10px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-gray-400 text-xs"
                  >
                    No posts found matching your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            Showing <span className="font-bold text-gray-800">{startItem}</span>{" "}
            to <span className="font-bold text-gray-800">{endItem}</span> of{" "}
            <span className="font-bold text-gray-800">{displayedTotal}</span>{" "}
            posts
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              className="p-1.5 border border-gray-200 rounded-lg bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPageCount) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => changePage(pageNum)}
                  className={`px-3 py-1.5 border rounded-lg font-semibold text-xs transition ${
                    page === pageNum
                      ? "bg-[#006837] text-white border-[#006837]"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => changePage(page + 1)}
              disabled={page === totalPageCount}
              className="p-1.5 border border-gray-200 rounded-lg bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
