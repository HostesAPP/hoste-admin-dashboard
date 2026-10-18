"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useRef, useState, ChangeEvent } from "react";
import {
  Upload,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Type,
  ChevronDown,
  Send,
  AlertCircle,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";

import type { Post, PostStatus } from "@/features/blog/blog.types";

const STORAGE_KEY = "hoste_blog_management_posts";
const PREVIEW_KEY = "hoste_blog_preview_post";

type PublishAction = "draft" | "publish" | "schedule";

interface BlogPostData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  status: PublishAction;
  scheduleDate: string;
  scheduleTime: string;
  seoTitle: string;
  metaDescription: string;
  slug: string;
  featuredImage: string | null;
}

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createPostId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `post-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function readStoredPosts(): Post[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed as Post[];
  } catch {
    return [];
  }
}

function getStoredStatus(status: PublishAction): PostStatus {
  switch (status) {
    case "publish":
      return "published";
    case "schedule":
      return "scheduled";
    default:
      return "draft";
  }
}

export default function CreateBlogPost() {
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<BlogPostData>({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [],
    author: "Naomi Admin",
    status: "draft",
    scheduleDate: "",
    scheduleTime: "",
    seoTitle: "",
    metaDescription: "",
    slug: "",
    featuredImage: null,
  });

  const [tagInput, setTagInput] = useState("");
  const [isPublishSettingsOpen, setIsPublishSettingsOpen] = useState(true);
  const [isSeoSettingsOpen, setIsSeoSettingsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const wordCount = formData.content.trim()
    ? formData.content.trim().split(/\s+/).length
    : 0;

  const showError = (text: string) => {
    setError(text);
    setMessage("");
  };

  const showMessage = (text: string) => {
    setMessage(text);
    setError("");
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 100) return;

    setFormData((prev) => {
      const previousGeneratedSlug = createSlug(prev.title);
      const shouldUpdateSlug =
        !prev.slug || prev.slug === previousGeneratedSlug;

      return {
        ...prev,
        title: value,
        slug: shouldUpdateSlug ? createSlug(value) : prev.slug,
        seoTitle: prev.seoTitle || "",
      };
    });
  };

  const handleExcerptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 160) {
      setFormData((prev) => ({ ...prev, excerpt: value }));
    }
  };

  const handleSeoTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 60) {
      setFormData((prev) => ({ ...prev, seoTitle: value }));
    }
  };

  const handleMetaDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 160) {
      setFormData((prev) => ({
        ...prev,
        metaDescription: value,
      }));
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showError("Please upload a JPG, PNG, or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showError("The featured image must not exceed 2MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        showError("Unable to read the selected image.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        featuredImage: reader.result as string,
      }));
      setError("");
      setMessage("Featured image selected successfully.");
    };
    reader.onerror = () => {
      showError("Unable to read the selected image. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !tagInput.trim()) return;
    e.preventDefault();

    const tag = tagInput.trim();
    if (
      !formData.tags.some(
        (existing) => existing.toLowerCase() === tag.toLowerCase(),
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const insertFormatting = (
    before: string,
    after = "",
    placeholder = "Text",
  ) => {
    const textarea = contentRef.current;
    if (!textarea) {
      setFormData((prev) => ({
        ...prev,
        content: `${prev.content}${before}${placeholder}${after}`,
      }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.slice(start, end);
    const replacement = `${before}${selectedText || placeholder}${after}`;

    const nextContent =
      formData.content.slice(0, start) +
      replacement +
      formData.content.slice(end);

    setFormData((prev) => ({
      ...prev,
      content: nextContent,
    }));

    requestAnimationFrame(() => {
      textarea.focus();
      const selectionStart = start + before.length;
      const selectionEnd = selectedText
        ? selectionStart + selectedText.length
        : selectionStart + placeholder.length;
      textarea.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  const validatePost = (action: PublishAction): boolean => {
    if (!formData.title.trim()) {
      showError("Please enter a blog post title.");
      return false;
    }
    if (!formData.featuredImage) {
      showError("Please upload a featured image.");
      return false;
    }
    if (!formData.excerpt.trim()) {
      showError("Please enter a short excerpt.");
      return false;
    }
    if (!formData.content.trim()) {
      showError("Please write the blog post content.");
      return false;
    }
    if (!formData.category) {
      showError("Please select a category.");
      return false;
    }
    if (!formData.slug.trim()) {
      showError("Please enter a valid post slug.");
      return false;
    }
    if (action === "schedule") {
      if (!formData.scheduleDate || !formData.scheduleTime) {
        showError("Please select both a schedule date and time.");
        return false;
      }
      const scheduledDate = new Date(
        `${formData.scheduleDate}T${formData.scheduleTime}`,
      );
      if (
        Number.isNaN(scheduledDate.getTime()) ||
        scheduledDate.getTime() <= Date.now()
      ) {
        showError("Please select a future date and time.");
        return false;
      }
    }
    return true;
  };

  const savePost = (action: PublishAction): Post | null => {
    if (!validatePost(action)) return null;
    setIsSaving(true);

    try {
      const posts = readStoredPosts();
      const slug = createSlug(formData.slug);

      if (!slug) {
        showError("Please enter a valid post slug.");
        return null;
      }

      const duplicateSlug = posts.some((post) => post.slug === slug);
      if (duplicateSlug) {
        showError(
          "This slug is already being used. Please choose a different slug.",
        );
        return null;
      }

      const now = new Date();
      const scheduledFor =
        action === "schedule"
          ? new Date(
              `${formData.scheduleDate}T${formData.scheduleTime}`,
            ).toISOString()
          : undefined;

      const post: Post = {
        id: createPostId(),
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content,
        coverImage: formData.featuredImage!,
        author: formData.author,
        category: formData.category,
        tags: formData.tags,
        status: getStoredStatus(action),
        ...(action === "publish" ? { publishedOn: now.toLocaleString() } : {}),
        ...(scheduledFor ? { scheduledFor } : {}),
        views: 0,
        slug,
        metaTitle: formData.seoTitle.trim() || formData.title.trim(),
        metaDescription:
          formData.metaDescription.trim() || formData.excerpt.trim(),
      };

      const updatedPosts = [post, ...posts];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
      return post;
    } catch (saveError) {
      console.error("Unable to save blog post:", saveError);
      showError(
        "Unable to save the post. Your browser storage may be full, especially if the image is large.",
      );
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = () => {
    const post = savePost("draft");
    if (!post) return;
    showMessage("Your blog post has been saved as a draft.");
    router.push("/blog");
  };

  const handlePublish = () => {
    const post = savePost(formData.status);
    if (!post) return;
    router.push("/blog");
  };

  const handlePreview = () => {
    if (!validatePost(formData.status)) return;
    try {
      const slug = createSlug(formData.slug);
      const previewPost: Post = {
        id: "preview",
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content,
        coverImage: formData.featuredImage!,
        author: formData.author,
        category: formData.category,
        tags: formData.tags,
        status: getStoredStatus(formData.status),
        ...(formData.status === "publish"
          ? { publishedOn: new Date().toLocaleString() }
          : {}),
        ...(formData.status === "schedule"
          ? {
              scheduledFor: new Date(
                `${formData.scheduleDate}T${formData.scheduleTime}`,
              ).toISOString(),
            }
          : {}),
        views: 0,
        slug,
        metaTitle: formData.seoTitle.trim() || formData.title.trim(),
        metaDescription:
          formData.metaDescription.trim() || formData.excerpt.trim(),
      };

      sessionStorage.setItem(PREVIEW_KEY, JSON.stringify(previewPost));
      router.push("/blog/preview");
    } catch (previewError) {
      console.error("Unable to prepare blog preview:", previewError);
      showError("Unable to open the preview. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans p-6 md:p-8">
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
          Create Blog Post
        </h1>

        <p className="text-sm text-[#737373] mt-1">
          Share valuable insights and updates with the Hosté community.
        </p>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
          <div className="text-xs text-[#737373]">
            <button
              type="button"
              onClick={() => router.push("/blog")}
              className="text-[#006837] font-medium cursor-pointer hover:underline"
            >
              Blog Management
            </button>
            <span className="mx-1.5">&gt;</span>
            <span className="text-[#1A1A1A] font-semibold">
              Create Blog Post
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-[#1A1A1A] bg-white border border-[#EAEAEA] rounded-lg shadow-xs hover:bg-[#F5F5F5] transition disabled:opacity-50"
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={handlePreview}
              className="px-4 py-2 text-xs font-semibold text-[#1A1A1A] bg-white border border-[#EAEAEA] rounded-lg shadow-xs hover:bg-[#F5F5F5] transition"
            >
              Preview
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#006837] hover:bg-[#00522b] rounded-lg shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check size={14} />
              {formData.status === "schedule"
                ? "Schedule"
                : formData.status === "draft"
                  ? "Save Draft"
                  : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {(error || message) && (
        <div
          role="status"
          className={`max-w-7xl mx-auto mb-5 rounded-xl border px-4 py-3 text-sm flex items-start gap-2 ${
            error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error ? (
            <AlertCircle size={17} className="shrink-0 mt-0.5" />
          ) : (
            <Check size={17} className="shrink-0 mt-0.5" />
          )}
          <span>{error || message}</span>
          <button
            type="button"
            onClick={() => {
              setError("");
              setMessage("");
            }}
            className="ml-auto shrink-0"
            aria-label="Dismiss message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#EAEAEA] shadow-[0_4px_20px_-2px_rgba(26,26,26,0.05)] space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                Title <span className="text-[#EF5A22]">*</span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter blog post title..."
                  value={formData.title}
                  onChange={handleTitleChange}
                  maxLength={100}
                  className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006837] pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#737373]">
                  {formData.title.length}/100
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Featured Image <span className="text-[#EF5A22]">*</span>
                </label>

                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="relative border-2 border-dashed border-[#EAEAEA] rounded-xl p-4 bg-[#FAFAFA] hover:bg-[#F5F5F5] transition text-center min-h-[160px] flex flex-col justify-center items-center cursor-pointer"
                >
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {formData.featuredImage ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden group">
                      <Image
                        src={formData.featuredImage}
                        alt="Featured image preview"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium">
                        Change Image
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-lg border border-[#EAEAEA] bg-white flex items-center justify-center text-[#006837] mb-2 shadow-xs">
                        <Upload size={20} />
                      </div>
                      <p className="text-sm font-semibold text-[#006837]">
                        Click to upload image
                      </p>
                      <p className="text-[11px] text-[#737373] mt-1">
                        Recommended size: 1200 × 630px
                      </p>
                      <p className="text-[10px] text-[#737373]">
                        Max size: 2MB (JPG, PNG, WebP)
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Excerpt <span className="text-[#EF5A22]">*</span>
                </label>

                <div className="relative h-[160px]">
                  <textarea
                    placeholder="Write a short summary of your post..."
                    value={formData.excerpt}
                    onChange={handleExcerptChange}
                    maxLength={160}
                    className="w-full h-full p-3 bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006837] resize-none pr-16"
                  />
                  <span className="absolute right-3 bottom-3 text-xs text-[#737373]">
                    {formData.excerpt.length}/160
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                Content <span className="text-[#EF5A22]">*</span>
              </label>

              <div className="border border-[#EAEAEA] rounded-xl overflow-hidden bg-[#FAFAFA]">
                <div className="flex flex-wrap items-center gap-1 p-2 bg-[#F5F5F5] border-b border-[#EAEAEA] text-[#1A1A1A]">
                  <div className="flex items-center gap-1 border-r border-[#EAEAEA] pr-2">
                    <button
                      type="button"
                      onClick={() => insertFormatting("", "", "")}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded hover:bg-white transition"
                      title="Paragraph"
                    >
                      Paragraph <ChevronDown size={12} />
                    </button>
                  </div>

                  <div className="flex items-center gap-0.5 border-r border-[#EAEAEA] px-1">
                    <button
                      type="button"
                      onClick={() => insertFormatting("**", "**")}
                      className="p-1.5 hover:bg-white rounded transition"
                      title="Bold"
                    >
                      <Bold size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("*", "*")}
                      className="p-1.5 hover:bg-white rounded transition"
                      title="Italic"
                    >
                      <Italic size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("<u>", "</u>")}
                      className="p-1.5 hover:bg-white rounded transition"
                      title="Underline"
                    >
                      <Underline size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("~~", "~~")}
                      className="p-1.5 hover:bg-white rounded transition"
                      title="Strikethrough"
                    >
                      <Strikethrough size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-0.5 border-r border-[#EAEAEA] px-1">
                    <button
                      type="button"
                      onClick={() => insertFormatting("\n- ", "", "List item")}
                      className="p-1.5 hover:bg-white rounded transition"
                      title="Bulleted list"
                    >
                      <List size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("\n1. ", "", "List item")}
                      className="p-1.5 hover:bg-white rounded transition"
                      title="Numbered list"
                    >
                      <ListOrdered size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-0.5 border-r border-[#EAEAEA] px-1">
                    <button
                      type="button"
                      onClick={() => insertFormatting("\n> ", "", "Quote")}
                      className="p-1.5 hover:bg-white rounded transition"
                      title="Quote"
                    >
                      <Quote size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("`", "`")}
                      className="p-1.5 hover:bg-white rounded transition"
                      title="Inline code"
                    >
                      <Code size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("\n![Image](", ")")}
                      className="p-1.5 hover:bg-white rounded transition"
                      title="Insert image URL"
                    >
                      <ImageIcon size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertFormatting(
                          "\n| Column 1 | Column 2 |\n| --- | --- |\n| ",
                          " | Value |",
                          "Value",
                        )
                      }
                      className="p-1.5 hover:bg-white rounded transition"
                      title="Insert table"
                    >
                      <TableIcon size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("\n---\n")}
                      className="p-1.5 hover:bg-white rounded transition"
                      title="Horizontal divider"
                    >
                      <Minus size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => insertFormatting("## ", "", "Heading")}
                    className="p-1.5 hover:bg-white rounded transition ml-auto"
                    title="Heading"
                  >
                    <Type size={14} />
                  </button>
                </div>

                <textarea
                  ref={contentRef}
                  placeholder="Start writing your blog post content here..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="w-full h-64 p-4 bg-white text-sm focus:outline-none resize-y border-0"
                />

                <div className="flex justify-between items-center px-4 py-2 border-t border-[#EAEAEA] bg-white text-xs text-[#737373]">
                  <span>{wordCount} words</span>
                  <span>Powered by Tiptap</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Category <span className="text-[#EF5A22]">*</span>
                </label>

                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2.5 bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#006837] text-[#1A1A1A]"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    <option value="Event Planning">Event Planning</option>
                    <option value="Product Updates">Product Updates</option>
                    <option value="Tips & Guides">Tips & Guides</option>
                    <option value="Safety">Safety</option>
                    <option value="Industry News">Industry News</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Tags
                </label>

                <div className="min-h-[42px] bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl p-1.5 flex flex-wrap items-center gap-1.5 focus-within:ring-2 focus-within:ring-[#006837]">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-white border border-[#EAEAEA] px-2 py-0.5 rounded-lg text-xs font-medium text-[#1A1A1A]"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-[#737373] hover:text-[#EF5A22]"
                        aria-label={`Remove ${tag} tag`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}

                  <input
                    type="text"
                    placeholder={
                      formData.tags.length === 0 ? "Select or add tags..." : ""
                    }
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="bg-transparent text-sm text-[#1A1A1A] outline-none flex-1 min-w-[80px] px-1"
                  />
                </div>
                <p className="text-[10px] text-[#737373] mt-1">
                  Press Enter to add a tag.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Author <span className="text-[#EF5A22]">*</span>
                </label>

                <div className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#006837] text-white flex items-center justify-center text-xs font-bold">
                      {formData.author ? formData.author.charAt(0) : "N"}
                    </div>
                    <span className="font-medium text-[#1A1A1A]">
                      {formData.author}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-[#737373]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-[0_4px_20px_-2px_rgba(26,26,26,0.05)] overflow-hidden">
            <button
              type="button"
              onClick={() => setIsPublishSettingsOpen((previous) => !previous)}
              className="w-full p-4 font-bold text-sm text-[#1A1A1A] flex justify-between items-center border-b border-[#EAEAEA] hover:bg-[#FAFAFA]"
            >
              Publish Settings
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isPublishSettingsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isPublishSettingsOpen && (
              <div className="p-4 space-y-4 text-xs">
                <div>
                  <span className="font-semibold text-[#1A1A1A] block mb-2">
                    Status
                  </span>

                  <div className="space-y-3">
                    <label className="flex items-start gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === "draft"}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, status: "draft" }))
                        }
                        className="mt-0.5 accent-[#006837]"
                      />
                      <div>
                        <span className="font-semibold text-[#1A1A1A] block">
                          Draft
                        </span>
                        <span className="text-[#737373]">
                          Saved as draft and not visible to users.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === "publish"}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            status: "publish",
                          }))
                        }
                        className="mt-0.5 accent-[#006837]"
                      />
                      <div>
                        <span className="font-semibold text-[#1A1A1A] block">
                          Publish
                        </span>
                        <span className="text-[#737373]">
                          Make this post live and visible to everyone.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === "schedule"}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            status: "schedule",
                          }))
                        }
                        className="mt-0.5 accent-[#006837]"
                      />
                      <div>
                        <span className="font-semibold text-[#1A1A1A] block">
                          Schedule
                        </span>
                        <span className="text-[#737373]">
                          Choose a future date to publish this post.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EAEAEA] space-y-2">
                  <span className="font-semibold text-[#1A1A1A] block">
                    Schedule For
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.scheduleDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            scheduleDate: e.target.value,
                          }))
                        }
                        className="w-full px-2.5 py-2 bg-[#FAFAFA] border border-[#EAEAEA] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#006837]"
                      />
                    </div>

                    <div className="relative">
                      <input
                        type="time"
                        value={formData.scheduleTime}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            scheduleTime: e.target.value,
                          }))
                        }
                        className="w-full px-2.5 py-2 bg-[#FAFAFA] border border-[#EAEAEA] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#006837]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-[0_4px_20px_-2px_rgba(26,26,26,0.05)] overflow-hidden">
            <button
              type="button"
              onClick={() => setIsSeoSettingsOpen((previous) => !previous)}
              className="w-full p-4 font-bold text-sm text-[#1A1A1A] flex justify-between items-center border-b border-[#EAEAEA] hover:bg-[#FAFAFA]"
            >
              SEO Settings
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isSeoSettingsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSeoSettingsOpen && (
              <div className="p-4 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#1A1A1A] mb-1">
                    SEO Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter SEO title..."
                      value={formData.seoTitle}
                      onChange={handleSeoTitleChange}
                      maxLength={60}
                      className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#006837] pr-12"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#737373]">
                      {formData.seoTitle.length}/60
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#1A1A1A] mb-1">
                    Meta Description
                  </label>
                  <div className="relative">
                    <textarea
                      placeholder="Enter meta description..."
                      value={formData.metaDescription}
                      onChange={handleMetaDescriptionChange}
                      maxLength={160}
                      rows={3}
                      className="w-full p-2.5 bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#006837] resize-none pr-12"
                    />
                    <span className="absolute right-2.5 bottom-2 text-[10px] text-[#737373]">
                      {formData.metaDescription.length}/160
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#1A1A1A] mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    placeholder="enter-slug-here"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#006837]"
                  />
                  <p className="text-[10px] text-[#737373] mt-1 truncate">
                    Your post URL: hoste.com/blog/
                    {formData.slug || "enter-slug-here"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-[0_4px_20px_-2px_rgba(26,26,26,0.05)] p-4 space-y-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="w-full py-2.5 px-4 rounded-xl border border-[#EAEAEA] bg-white text-[#1A1A1A] text-xs font-semibold hover:bg-gray-50 transition shadow-xs text-center"
            >
              Save Draft
              <span className="block text-[10px] font-normal text-[#737373]">
                Save and continue editing later
              </span>
            </button>

            <button
              type="button"
              onClick={handlePublish}
              className="w-full py-2.5 px-4 rounded-xl bg-[#E05318] hover:bg-[#c84612] text-white text-xs font-semibold transition shadow-sm text-center flex items-center justify-center gap-1.5"
            >
              <Send size={13} />
              Publish Post
              <span className="block text-[10px] font-normal text-white/90">
                Make it live for everyone
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-4 flex items-center gap-3 text-xs text-[#92400E]">
        <AlertTriangle size={18} className="shrink-0 text-[#D97706]" />
        <span>
          <strong>Tip:</strong> Use engaging titles and relevant images to
          increase visibility and reader engagement.
        </span>
      </div>
    </div>
  );
}
