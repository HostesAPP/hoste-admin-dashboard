"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  Plus,
  CheckCircle2,
  FileText,
  Calendar,
  Trash2,
  Search,
  ChevronDown,
  Eye,
  Edit2,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Square,
  Columns2,
  Columns3,
  Heading2,
  Upload,
  Send,
  AlertCircle,
  Globe,
  User,
  Filter,
  Check,
} from "lucide-react";

type PostStatus = "Published" | "Draft" | "Scheduled" | "Archived";

interface BlogPost {
  id: number;
  title: string;
  subtitle: string;
  author: string;
  category: string;
  categoryBg: string;
  status: PostStatus;
  statusDot: string;
  publishedOn: string;
  views: string;
  thumbnailBg: string;
  content?: string;
  summary?: string;
  image?: string;
  seoTitle?: string;
  metaDescription?: string;
  slug?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  tags?: string[];
}

const STORAGE_KEY = "hoste_blog_management_posts";

const initialForm = {
  title: "",
  summary: "",
  content: "",
  category: "Event Planning",
  tags: "",
  author: "Naomi Admin",
  seoTitle: "",
  metaDescription: "",
  slug: "",
  scheduledDate: "",
  scheduledTime: "",
};

export default function BlogManagement() {
  const [view, setView] = useState<"overview" | "editor" | "preview">(
    "overview",
  );
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  const initialPosts: BlogPost[] = [
    {
      id: 1,
      title: "5 Things to Consider When Hiring Event Staff",
      subtitle: "Hiring the right event staff can make or break your...",
      author: "Naomi Admin",
      category: "Event Planning",
      categoryBg: "bg-emerald-50 text-emerald-700",
      status: "Published",
      statusDot: "bg-emerald-500",
      publishedOn: "Aug 10, 2026\n10:30 AM",
      views: "1,245",
      thumbnailBg: "bg-gradient-to-r from-purple-900 to-indigo-900",
      content:
        "Providing exceptional hospitality goes beyond clean sheets and a nice view...",
      summary: "Hiring the right event staff can make or break your...",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 2,
      title: "Hosté Introduces Group Booking Feature",
      subtitle: "We are excited to announce a new way to book...",
      author: "Naomi Admin",
      category: "Product Updates",
      categoryBg: "bg-amber-50 text-amber-700",
      status: "Published",
      statusDot: "bg-emerald-500",
      publishedOn: "Aug 05, 2026\n02:15 PM",
      views: "978",
      thumbnailBg: "bg-neutral-900",
      content:
        "We are excited to announce a new way to book events seamlessly...",
      summary: "We are excited to announce a new way to book...",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 3,
      title: "How to Prepare for Your First Event as a Hosté",
      subtitle: "Your first event is important. Here are some tips...",
      author: "John Doe",
      category: "Tips & Guides",
      categoryBg: "bg-purple-50 text-purple-700",
      status: "Draft",
      statusDot: "bg-amber-400",
      publishedOn: "-",
      views: "-",
      thumbnailBg: "bg-slate-700",
      content:
        "Your first event is important. Here are some tips to get you started...",
      summary: "Your first event is important. Here are some tips...",
      image: "",
    },
    {
      id: 4,
      title: "Why Background Checks Matter for Event Staff",
      subtitle: "Trust and safety are at the heart of every...",
      author: "Mary Jane",
      category: "Safety",
      categoryBg: "bg-sky-50 text-sky-700",
      status: "Scheduled",
      statusDot: "bg-purple-500",
      publishedOn: "Aug 20, 2026\n09:00 AM",
      views: "-",
      thumbnailBg: "bg-blue-600",
      content:
        "Trust and safety are at the heart of every successful gathering...",
      summary: "Trust and safety are at the heart of every...",
      image: "",
    },
    {
      id: 5,
      title: "10 Tips for Planning a Successful Corporate Event",
      subtitle: "Planning a corporate event? Here are 10 proven...",
      author: "Naomi Admin",
      category: "Event Planning",
      categoryBg: "bg-emerald-50 text-emerald-700",
      status: "Published",
      statusDot: "bg-emerald-500",
      publishedOn: "Jul 28, 2026\n11:45 AM",
      views: "1,876",
      thumbnailBg: "bg-emerald-800",
      content:
        "Planning a corporate event? Here are 10 proven ways to succeed...",
      summary: "Planning a corporate event? Here are 10 proven...",
      image: "",
    },
    {
      id: 6,
      title: "How to Manage Last-Minute Event Bookings",
      subtitle: "Last-minute bookings can be stressful. Here's how...",
      author: "John Doe",
      category: "Tips & Guides",
      categoryBg: "bg-purple-50 text-purple-700",
      status: "Archived",
      statusDot: "bg-slate-400",
      publishedOn: "Jul 12, 2026\n04:20 PM",
      views: "654",
      thumbnailBg: "bg-slate-600",
      content:
        "Last-minute bookings can be stressful. Here's how to handle them...",
      summary: "Last-minute bookings can be stressful. Here's how...",
      image: "",
    },
  ];

  const [posts, setPosts] = useState<BlogPost[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return initialPosts;
        }
      }
    }
    return initialPosts;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  // Filtering & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Editor states
  const [form, setForm] = useState(initialForm);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<PostStatus>("Draft");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = useMemo(() => {
    return form.content.trim() ? form.content.trim().split(/\s+/).length : 0;
  }, [form.content]);

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "title" && !prev.slug ? { slug: slugify(value) } : {}),
    }));
    setError("");
    setSuccess("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("The featured image must be 2MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFeaturedImage(reader.result);
        setError("");
      }
    };
    reader.readAsDataURL(file);
  };

  const validateForm = (targetStatus: string) => {
    if (!form.title.trim()) return "Please enter a blog title.";
    if (!featuredImage) return "Please upload a featured image.";
    if (!form.summary.trim()) return "Please enter a summary / excerpt.";
    if (!form.content.trim()) return "Please enter the article content.";
    if (!form.category) return "Please select a category.";
    if (!form.author) return "Please select an author.";

    if (targetStatus === "Scheduled") {
      if (!form.scheduledDate || !form.scheduledTime) {
        return "Please select a scheduled date and time.";
      }
    }
    return "";
  };

  const getCategoryBg = (cat: string) => {
    switch (cat) {
      case "Event Planning":
        return "bg-emerald-50 text-emerald-700";
      case "Product Updates":
        return "bg-amber-50 text-amber-700";
      case "Tips & Guides":
        return "bg-purple-50 text-purple-700";
      case "Safety":
        return "bg-sky-50 text-sky-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  const handleSavePost = (targetStatus: PostStatus) => {
    const valError = validateForm(targetStatus);
    if (valError) {
      setError(valError);
      return;
    }

    setSaving(true);
    const now = new Date();
    const formattedDate =
      now.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }) +
      "\n" +
      now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const newPost: BlogPost = {
      id: editingPostId || Date.now(),
      title: form.title.trim(),
      subtitle: form.summary.trim(),
      author: form.author,
      category: form.category,
      categoryBg: getCategoryBg(form.category),
      status: targetStatus,
      statusDot:
        targetStatus === "Published"
          ? "bg-emerald-500"
          : targetStatus === "Scheduled"
            ? "bg-purple-500"
            : targetStatus === "Archived"
              ? "bg-slate-400"
              : "bg-amber-400",
      publishedOn:
        targetStatus === "Published"
          ? formattedDate
          : targetStatus === "Scheduled"
            ? `${form.scheduledDate}\n${form.scheduledTime}`
            : "-",
      views: editingPostId
        ? posts.find((p) => p.id === editingPostId)?.views || "0"
        : "0",
      thumbnailBg: "bg-emerald-800",
      content: form.content.trim(),
      summary: form.summary.trim(),
      image: featuredImage || "",
      seoTitle: form.seoTitle || form.title,
      metaDescription: form.metaDescription || form.summary,
      slug: form.slug || slugify(form.title),
      scheduledDate: form.scheduledDate,
      scheduledTime: form.scheduledTime,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    let updatedPosts;
    if (editingPostId) {
      updatedPosts = posts.map((p) => (p.id === editingPostId ? newPost : p));
    } else {
      updatedPosts = [newPost, ...posts];
    }

    setPosts(updatedPosts);
    setSaving(false);
    setView("overview");
    resetEditor();
  };

  const resetEditor = () => {
    setEditingPostId(null);
    setForm(initialForm);
    setFeaturedImage(null);
    setPublishStatus("Draft");
    setError("");
  };

  const openCreateNew = () => {
    resetEditor();
    setView("editor");
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setForm({
      title: post.title || "",
      summary: post.summary || post.subtitle || "",
      content: post.content || "",
      category: post.category || "Event Planning",
      tags: post.tags ? post.tags.join(", ") : "",
      author: post.author || "Naomi Admin",
      seoTitle: post.seoTitle || "",
      metaDescription: post.metaDescription || "",
      slug: post.slug || "",
      scheduledDate: post.scheduledDate || "",
      scheduledTime: post.scheduledTime || "",
    });
    setFeaturedImage(
      post.image ||
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    );
    setPublishStatus(post.status);
    setView("editor");
  };

  const handleDeletePost = (id: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  const handleTogglePublishStatus = (post: BlogPost) => {
    const newStatus: PostStatus =
      post.status === "Published" ? "Draft" : "Published";
    const now = new Date();
    const formattedDate =
      now.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }) +
      "\n" +
      now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    setPosts(
      posts.map((p) => {
        if (p.id === post.id) {
          return {
            ...p,
            status: newStatus,
            statusDot:
              newStatus === "Published" ? "bg-emerald-500" : "bg-amber-400",
            publishedOn: newStatus === "Published" ? formattedDate : "-",
          };
        }
        return p;
      }),
    );
  };

  // Filter logic
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat =
        selectedCategory === "All" || p.category === selectedCategory;
      const matchesAuthor =
        selectedAuthor === "All" || p.author === selectedAuthor;
      const matchesStatus =
        selectedStatus === "All" || p.status === selectedStatus;
      return matchesSearch && matchesCat && matchesAuthor && matchesStatus;
    });
  }, [posts, searchTerm, selectedCategory, selectedAuthor, selectedStatus]);

  // Dynamic Stats counts
  const totalCount = posts.length;
  const publishedCount = posts.filter((p) => p.status === "Published").length;
  const draftCount = posts.filter((p) => p.status === "Draft").length;
  const scheduledCount = posts.filter((p) => p.status === "Scheduled").length;
  const archivedCount = posts.filter((p) => p.status === "Archived").length;

  return (
    <div className="min-h-screen bg-neutral-100 p-4 sm:p-8 font-sans text-neutral-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ================= VIEW 1: OVERVIEW & TABLE ================= */}
        {view === "overview" && (
          <>
            {/* Header Section */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Blog Management
                </h1>
                <p className="text-sm text-neutral-500">
                  Manage and organize all blog posts
                </p>
              </div>
              <button
                onClick={openCreateNew}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus size={18} />
                Create New Post
              </button>
            </div>

            {/* Stats Grid Cards matching exact reference cards & dynamic counts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Total Posts */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Total Posts
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                    <Plus size={20} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900 mt-2">
                    {totalCount}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">All time</div>
                </div>
              </div>

              {/* Published */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Published
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900 mt-2">
                    {publishedCount}
                  </div>
                  <div className="text-xs text-emerald-600 font-medium mt-1">
                    {totalCount
                      ? ((publishedCount / totalCount) * 100).toFixed(1)
                      : 0}
                    % of total
                  </div>
                </div>
              </div>

              {/* Drafts */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Drafts
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Edit2 size={18} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900 mt-2">
                    {draftCount}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {totalCount
                      ? ((draftCount / totalCount) * 100).toFixed(1)
                      : 0}
                    % of total
                  </div>
                </div>
              </div>

              {/* Scheduled */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Scheduled
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Calendar size={20} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900 mt-2">
                    {scheduledCount}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {totalCount
                      ? ((scheduledCount / totalCount) * 100).toFixed(1)
                      : 0}
                    % of total
                  </div>
                </div>
              </div>

              {/* Archived */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Archived
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Trash2 size={20} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900 mt-2">
                    {archivedCount}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {totalCount
                      ? ((archivedCount / totalCount) * 100).toFixed(1)
                      : 0}
                    % of total
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[280px]">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search posts by title, author or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-neutral-500 font-medium">
                  Filter by:
                </span>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 cursor-pointer focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Event Planning">Event Planning</option>
                  <option value="Product Updates">Product Updates</option>
                  <option value="Tips & Guides">Tips & Guides</option>
                  <option value="Safety">Safety</option>
                </select>

                {/* Author Filter */}
                <select
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 cursor-pointer focus:outline-none"
                >
                  <option value="All">All Authors</option>
                  <option value="Naomi Admin">Naomi Admin</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Mary Jane">Mary Jane</option>
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 cursor-pointer focus:outline-none"
                >
                  <option value="All">All Status</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Archived">Archived</option>
                </select>

                {/* Select Date Toggle */}
                <label className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="rounded border-neutral-300"
                  />
                  <span>Select Date</span>
                </label>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSelectedAuthor("All");
                    setSelectedStatus("All");
                  }}
                  className="px-4 py-2 bg-white border border-emerald-600 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Posts Table Section */}
            <div className="bg-white rounded-xl border border-neutral-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Author</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Published On</th>
                      <th className="py-3 px-4">Views</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-sm">
                    {filteredPosts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-8 text-center text-neutral-400"
                        >
                          No blog posts found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredPosts.map((post) => (
                        <tr
                          key={post.id}
                          className="hover:bg-neutral-50/60 transition-colors"
                        >
                          {/* Title Column with Thumbnail */}
                          <td className="py-3.5 px-4 max-w-sm">
                            <div className="flex items-center gap-3">
                              {post.image ? (
                                <img
                                  src={post.image}
                                  alt=""
                                  className="w-12 h-8 rounded object-cover shrink-0"
                                />
                              ) : (
                                <div
                                  className={`w-12 h-8 rounded shrink-0 ${post.thumbnailBg}`}
                                />
                              )}
                              <div>
                                <div className="font-semibold text-neutral-900 text-xs leading-snug line-clamp-1">
                                  {post.title}
                                </div>
                                <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                                  {post.subtitle}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Author */}
                          <td className="py-3.5 px-4 text-xs text-neutral-600 font-medium">
                            {post.author}
                          </td>

                          {/* Category Pill */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium ${post.categoryBg}`}
                            >
                              {post.category}
                            </span>
                          </td>

                          {/* Status Pill */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${post.statusDot}`}
                              ></span>
                              <span className="text-xs font-medium text-neutral-700">
                                {post.status}
                              </span>
                            </div>
                          </td>

                          {/* Published On */}
                          <td className="py-3.5 px-4 text-xs text-neutral-500 whitespace-pre-line leading-tight">
                            {post.publishedOn}
                          </td>

                          {/* Views */}
                          <td className="py-3.5 px-4 text-xs text-neutral-600">
                            {post.views}
                          </td>

                          {/* Actions: View/Preview, Edit, Delete, and Toggle Publish status */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingPostId(post.id);
                                  setForm({
                                    title: post.title,
                                    summary:
                                      post.summary || post.subtitle || "",
                                    content: post.content || "",
                                    category: post.category,
                                    tags: post.tags ? post.tags.join(", ") : "",
                                    author: post.author,
                                    seoTitle: post.seoTitle || "",
                                    metaDescription: post.metaDescription || "",
                                    slug: post.slug || "",
                                    scheduledDate: post.scheduledDate || "",
                                    scheduledTime: post.scheduledTime || "",
                                  });
                                  setFeaturedImage(post.image || null);
                                  setView("preview");
                                }}
                                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
                                title="Preview Post"
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                onClick={() => handleEditPost(post)}
                                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
                                title="Edit Post"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleTogglePublishStatus(post)}
                                className="w-7 h-7 rounded-full bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-700 transition-colors cursor-pointer"
                                title={
                                  post.status === "Published"
                                    ? "Unpublish / Make Draft"
                                    : "Publish Post"
                                }
                              >
                                <Globe size={13} />
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="w-7 h-7 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-rose-600 transition-colors cursor-pointer"
                                title="Delete Post"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500 bg-white">
                <div>
                  Showing 1 to {filteredPosts.length} of {posts.length} posts
                </div>
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 rounded border border-neutral-200 flex items-center justify-center text-neutral-400 hover:bg-neutral-50 disabled:opacity-50 cursor-pointer">
                    <ChevronLeft size={14} />
                  </button>
                  <button className="w-7 h-7 rounded bg-orange-600 text-white font-medium flex items-center justify-center">
                    1
                  </button>
                  <button className="w-7 h-7 rounded border border-neutral-200 hover:bg-neutral-50 flex items-center justify-center font-medium cursor-pointer">
                    2
                  </button>
                  <button className="w-7 h-7 rounded border border-neutral-200 hover:bg-neutral-50 flex items-center justify-center font-medium cursor-pointer">
                    3
                  </button>
                  <span className="px-1 text-neutral-400">...</span>
                  <button className="w-7 h-7 rounded border border-neutral-200 hover:bg-neutral-50 flex items-center justify-center font-medium cursor-pointer">
                    22
                  </button>
                  <button className="w-7 h-7 rounded border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 cursor-pointer">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ================= VIEW 2: DEDICATED ARTICLE EDITOR ================= */}
        {view === "editor" && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            {/* Top Header Banner */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-white">
              <div>
                <h1 className="text-xl font-bold text-neutral-900">
                  {editingPostId ? "Edit Blog Post" : "Create Blog Post"}
                </h1>
                <p className="text-sm text-neutral-500">
                  Share valuable insights and updates with the Hosté community.
                </p>
              </div>
              <button
                onClick={() => setView("overview")}
                className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 px-3 py-2 border border-neutral-300 rounded-lg bg-white cursor-pointer transition-colors"
              >
                <ArrowLeft size={14} /> Back to Management
              </button>
            </div>

            {/* Main Editor Form Body */}
            <div className="p-6 space-y-6 max-w-5xl mx-auto">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle size={16} /> <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} /> <span>{success}</span>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter a compelling title..."
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400 font-medium text-neutral-900"
                />
              </div>

              {/* URL Slug & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    placeholder="url-slug-goes-here"
                    value={form.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400 text-neutral-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400 text-neutral-700 cursor-pointer"
                  >
                    <option value="Event Planning">Event Planning</option>
                    <option value="Product Updates">Product Updates</option>
                    <option value="Tips & Guides">Tips & Guides</option>
                    <option value="Safety">Safety</option>
                  </select>
                </div>
              </div>

              {/* Author & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Author / Admin <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.author}
                    onChange={(e) => updateField("author", e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400 text-neutral-700 cursor-pointer"
                  >
                    <option value="Naomi Admin">Naomi Admin</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Mary Jane">Mary Jane</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="hospitality, staff, events"
                    value={form.tags}
                    onChange={(e) => updateField("tags", e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400 text-neutral-700"
                  />
                </div>
              </div>

              {/* Featured Image Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Featured Image <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-neutral-200 rounded-xl p-6 text-center bg-neutral-50 hover:bg-neutral-100/50 transition-colors">
                  {featuredImage ? (
                    <div className="space-y-3">
                      <img
                        src={featuredImage}
                        alt="Featured Preview"
                        className="max-h-48 mx-auto rounded-lg object-cover shadow-sm"
                      />
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-white border border-neutral-300 rounded-md text-xs font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                        >
                          Change Image
                        </button>
                        <button
                          type="button"
                          onClick={() => setFeaturedImage(null)}
                          className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-md text-xs font-medium text-rose-600 hover:bg-rose-100 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer space-y-2 py-4"
                    >
                      <Upload className="mx-auto text-neutral-400" size={32} />
                      <div className="text-sm font-medium text-neutral-700">
                        Click to upload featured image
                      </div>
                      <p className="text-xs text-neutral-400">
                        PNG, JPG or WEBP (Max 2MB)
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Summary / Excerpt */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Summary / Excerpt <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary shown in blog cards and previews..."
                  value={form.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400 text-neutral-700"
                />
              </div>

              {/* Post Content */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Article Content <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-neutral-400">
                    {wordCount} words • {readingTime} min read
                  </span>
                </div>
                <div className="border border-neutral-200 rounded-lg bg-white overflow-hidden">
                  <div className="flex flex-wrap items-center gap-1 p-2 border-b border-neutral-200 bg-neutral-50 text-neutral-600">
                    <button
                      type="button"
                      className="p-1.5 hover:bg-neutral-200 rounded"
                    >
                      <Bold size={14} />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-neutral-200 rounded"
                    >
                      <Italic size={14} />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-neutral-200 rounded"
                    >
                      <Underline size={14} />
                    </button>
                    <span className="w-px h-4 bg-neutral-300 mx-1" />
                    <button
                      type="button"
                      className="p-1.5 hover:bg-neutral-200 rounded"
                    >
                      <Heading2 size={14} />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-neutral-200 rounded"
                    >
                      <List size={14} />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-neutral-200 rounded"
                    >
                      <ListOrdered size={14} />
                    </button>
                    <span className="w-px h-4 bg-neutral-300 mx-1" />
                    <button
                      type="button"
                      className="p-1.5 hover:bg-neutral-200 rounded"
                    >
                      <Quote size={14} />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-neutral-200 rounded"
                    >
                      <Code size={14} />
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    placeholder="Write your full article content here..."
                    value={form.content}
                    onChange={(e) => updateField("content", e.target.value)}
                    className="w-full p-4 text-sm focus:outline-none text-neutral-800"
                  />
                </div>
              </div>

              {/* SEO Settings */}
              <div className="border-t border-neutral-200 pt-6 space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Globe size={16} className="text-orange-600" /> SEO Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      placeholder="Custom title for search engines"
                      value={form.seoTitle}
                      onChange={(e) => updateField("seoTitle", e.target.value)}
                      className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400 text-neutral-700"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Meta Description
                    </label>
                    <input
                      type="text"
                      placeholder="Brief description for search snippets"
                      value={form.metaDescription}
                      onChange={(e) =>
                        updateField("metaDescription", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400 text-neutral-700"
                    />
                  </div>
                </div>
              </div>

              {/* Publishing Options & Schedule */}
              <div className="border-t border-neutral-200 pt-6 space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Calendar size={16} className="text-orange-600" /> Publishing
                  Status & Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                      Status Action
                    </label>
                    <select
                      value={publishStatus}
                      onChange={(e) =>
                        setPublishStatus(e.target.value as PostStatus)
                      }
                      className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-800 focus:outline-none cursor-pointer"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Publish Now</option>
                      <option value="Scheduled">Schedule for Later</option>
                      <option value="Archived">Archive</option>
                    </select>
                  </div>

                  {publishStatus === "Scheduled" && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                          Schedule Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={form.scheduledDate}
                          onChange={(e) =>
                            updateField("scheduledDate", e.target.value)
                          }
                          className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none text-neutral-700"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                          Schedule Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          value={form.scheduledTime}
                          onChange={(e) =>
                            updateField("scheduledTime", e.target.value)
                          }
                          className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none text-neutral-700"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-neutral-200 pt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const valErr = validateForm(publishStatus);
                    if (valErr) {
                      setError(valErr);
                      return;
                    }
                    setView("preview");
                  }}
                  className="px-5 py-2.5 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Eye size={16} /> Preview / Review Stage
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setView("overview")}
                    className="px-4 py-2.5 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSavePost(publishStatus)}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {saving ? "Saving..." : `Save as ${publishStatus}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 3: PREVIEW / REVIEW STAGE ================= */}
        {view === "preview" && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden space-y-6">
            {/* Top Review Header Banner */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <h1 className="text-xl font-bold text-neutral-900">
                  Post Preview & SEO Review Stage
                </h1>
                <p className="text-sm text-neutral-500">
                  Review entered content, SEO metrics, and website appearance
                  before finalizing.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView("editor")}
                  className="px-4 py-2 border border-neutral-300 rounded-lg bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 size={14} /> Back to Editor
                </button>
                <button
                  onClick={() => handleSavePost("Published")}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check size={14} /> Publish Now
                </button>
              </div>
            </div>

            {/* Review Information Cards */}
            <div className="p-6 max-w-5xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div className="text-xs text-neutral-500 font-medium">
                    Word Count
                  </div>
                  <div className="text-lg font-bold text-neutral-900 mt-1">
                    {wordCount} words
                  </div>
                </div>
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div className="text-xs text-neutral-500 font-medium">
                    Estimated Reading Time
                  </div>
                  <div className="text-lg font-bold text-neutral-900 mt-1">
                    {readingTime} min read
                  </div>
                </div>
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div className="text-xs text-neutral-500 font-medium">
                    Category
                  </div>
                  <div className="text-lg font-bold text-emerald-700 mt-1">
                    {form.category || "Uncategorized"}
                  </div>
                </div>
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div className="text-xs text-neutral-500 font-medium">
                    Author
                  </div>
                  <div className="text-lg font-bold text-neutral-900 mt-1">
                    {form.author}
                  </div>
                </div>
              </div>

              {/* SEO Statistics Snippet Preview */}
              <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-5 space-y-2">
                <div className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe size={14} /> Google Search Result Snippet Preview
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm space-y-1">
                  <div className="text-xs text-neutral-500">
                    hoste.com/blog/{form.slug || "post-url"}
                  </div>
                  <div className="text-base font-medium text-blue-600 hover:underline cursor-pointer">
                    {form.seoTitle ||
                      form.title ||
                      "Your Blog Title Will Appear Here"}
                  </div>
                  <div className="text-xs text-neutral-600 line-clamp-2">
                    {form.metaDescription ||
                      form.summary ||
                      "Meta description or article excerpt preview for search engine optimization..."}
                  </div>
                </div>
              </div>

              {/* Website Live Page Preview Render */}
              <div className="border border-neutral-300 rounded-xl p-6 bg-white space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    Website Article View Preview
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                    {form.category || "Category"}
                  </span>
                </div>

                <div className="space-y-4 max-w-3xl mx-auto">
                  <h1 className="text-3xl font-extrabold text-neutral-900 leading-tight">
                    {form.title || "Untitled Blog Post"}
                  </h1>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span>By {form.author}</span>
                    <span>•</span>
                    <span>
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>{readingTime} min read</span>
                  </div>

                  {featuredImage && (
                    <img
                      src={featuredImage}
                      alt="Cover"
                      className="w-full h-72 object-cover rounded-xl shadow-sm"
                    />
                  )}

                  <div className="text-base text-neutral-700 font-semibold italic border-l-4 border-orange-500 pl-4 py-1">
                    {form.summary || "Summary excerpt goes here..."}
                  </div>

                  <div className="prose text-neutral-800 whitespace-pre-wrap text-sm leading-relaxed pt-2">
                    {form.content || "Full article content preview..."}
                  </div>

                  {form.tags && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-100">
                      {form.tags.split(",").map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs font-medium"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
