"use client";

import React, { useState, useRef } from "react";
import {
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
  ChevronDown,
  Calendar,
  Clock,
  Upload,
  Send,
  X,
} from "lucide-react";

export default function CreateBlogPost() {
  const [status, setStatus] = useState<"draft" | "publish" | "schedule">(
    "draft",
  );
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFeaturedImage(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <div className="max-w-[1160px] mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Top Header Banner */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">Create Blog Post</h1>
          <p className="text-sm text-gray-500">
            Share valuable insights and updates with the Hosté community.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="p-6 mx-4 mt-0 mb-4 relative">
          {/* Breadcrumb & Action Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="text-xs text-gray-500 font-medium">
              <span className="text-emerald-700">Blog Management</span> &gt;{" "}
              <span className="text-gray-800">Create Blog Post</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Save Draft
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Preview
              </button>
              <button className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-sm font-medium hover:bg-emerald-900 flex items-center gap-2">
                <Upload size={16} /> Publish
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns (Main Inputs) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter blog post title..."
                    maxLength={100}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <span className="absolute right-3 top-3 text-xs text-gray-400">
                    0/100
                  </span>
                </div>
              </div>

              {/* Featured Image & Excerpt Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Featured Image */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Featured Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 cursor-pointer h-[150px] relative overflow-hidden"
                  >
                    {featuredImage ? (
                      <>
                        <img
                          src={featuredImage}
                          alt="Featured Preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFeaturedImage(null);
                          }}
                          className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
                        >
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-emerald-600 mb-2">
                          <ImageIcon size={32} />
                        </div>
                        <p className="text-xs font-bold text-emerald-700 mb-1">
                          Click to upload image
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Recommended size: 1200 × 630px
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Max size: 2MB (JPG, PNG, WebP)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Excerpt */}
                <div className="flex flex-col">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Excerpt <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex-1">
                    <textarea
                      placeholder="Write a short summary of your post..."
                      maxLength={160}
                      className="w-full h-[150px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 resize-none"
                    />
                    <span className="absolute right-3 bottom-3 text-xs text-gray-400">
                      0/160
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-b border-gray-200 bg-slate-50/70 text-slate-700 text-xs">
                    <button className="flex items-center gap-1 px-2 py-1 hover:bg-slate-200 rounded font-medium">
                      Paragraph <ChevronDown size={12} />
                    </button>
                    <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                    <button className="p-1.5 hover:bg-slate-200 rounded font-bold">
                      <Bold size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-slate-200 rounded italic">
                      <Italic size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-slate-200 rounded underline">
                      <Underline size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-slate-200 rounded line-through">
                      <Strikethrough size={14} />
                    </button>
                    <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                    <button className="p-1.5 hover:bg-slate-200 rounded">
                      <List size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-slate-200 rounded">
                      <ListOrdered size={14} />
                    </button>
                    <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                    <button className="p-1.5 hover:bg-slate-200 rounded">
                      <Quote size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-slate-200 rounded">
                      <Code size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-slate-200 rounded">
                      <Square size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-slate-200 rounded">
                      <Columns2 size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-slate-200 rounded">
                      <Columns3 size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-slate-200 rounded">
                      <Square size={14} />
                    </button>
                    <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                    <button className="p-1.5 hover:bg-slate-200 rounded">
                      <Heading2 size={14} />
                    </button>
                  </div>

                  {/* Textarea Area */}
                  <textarea
                    placeholder="Start writing your blog post content here..."
                    className="w-full h-48 p-3 text-sm focus:outline-none resize-none text-slate-700 placeholder:text-slate-400"
                  />

                  {/* Footer details */}
                  <div className="flex justify-between items-center px-3 py-2 border-t border-gray-100 text-[11px] text-gray-400 bg-gray-50/50">
                    <span>0 words</span>
                    <span>Powered by Tiptap</span>
                  </div>
                </div>
              </div>

              {/* Category, Tags, Author Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 text-gray-500">
                      <option>Select a category</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Select or add tags..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Author <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <select className="w-full pl-8 pr-8 py-2 text-sm border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 text-gray-800 font-medium">
                      <option>Naomi Admin</option>
                    </select>
                    <div className="absolute left-2.5 w-4 h-4 bg-emerald-700 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                      N
                    </div>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Publish Settings & SEO Settings) */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-xs">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 font-semibold text-sm text-gray-900">
                  <span>Publish Settings</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <span className="block text-xs font-semibold text-gray-700 mb-2">
                      Status
                    </span>

                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={status === "draft"}
                          onChange={() => setStatus("draft")}
                          className="mt-0.5 accent-orange-600 focus:ring-orange-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-800">
                            Draft
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Saved as draft and not visible to users.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={status === "publish"}
                          onChange={() => setStatus("publish")}
                          className="mt-0.5 accent-orange-600 focus:ring-orange-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-800">
                            Publish
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Make this post live and visible to everyone.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={status === "schedule"}
                          onChange={() => setStatus("schedule")}
                          className="mt-0.5 accent-orange-600 focus:ring-orange-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-800">
                            Schedule
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Choose a future date to publish this post.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {status === "schedule" && (
                    <div className="pt-2 border-t border-gray-100 space-y-3">
                      <label className="block text-xs font-semibold text-gray-700">
                        Schedule For
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Select date"
                            className="w-full pl-3 pr-8 py-1.5 text-xs border border-gray-300 rounded-md"
                          />
                          <Calendar
                            size={14}
                            className="absolute right-2.5 top-2 text-gray-400 pointer-events-none"
                          />
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Select time"
                            className="w-full pl-3 pr-8 py-1.5 text-xs border border-gray-300 rounded-md"
                          />
                          <Clock
                            size={14}
                            className="absolute right-2.5 top-2 text-gray-400 pointer-events-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SEO Settings */}
              <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-xs">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 font-semibold text-sm text-gray-900">
                  <span>SEO Settings</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      SEO Title
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter SEO title..."
                        maxLength={60}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-gray-400">
                        0/60
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <div className="relative">
                      <textarea
                        placeholder="Enter meta description..."
                        maxLength={160}
                        className="w-full h-20 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 resize-none"
                      />
                      <span className="absolute right-3 bottom-2 text-[10px] text-gray-400">
                        0/160
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      placeholder="enter-slug-here"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-gray-400"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Your post URL: hoste.com/blog/enter-slug-here
                    </p>
                  </div>
                </div>
              </div>

              {/* Side Actions */}
              <div className="space-y-3">
                <button className="w-full py-2.5 px-4 border border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white hover:bg-gray-50">
                  <span className="text-xs font-bold text-gray-900">
                    Save Draft
                  </span>
                  <span className="text-[10px] text-gray-500 font-normal">
                    Save and continue editing later
                  </span>
                </button>
                <button className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 rounded-lg text-xs font-bold text-white flex flex-col items-center justify-center shadow-xs">
                  <span className="flex items-center gap-1.5">
                    <Send size={12} /> Publish Post
                  </span>
                  <span className="text-[10px] font-normal text-orange-100">
                    Make it live for everyone
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tip Alert */}
        <div className="mx-6 mb-6 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2 text-xs text-amber-800">
          <span className="text-amber-500 font-bold text-sm">⚠️</span>
          <span>
            <strong>Tip:</strong> Use engaging titles and relevant images to
            increase visibility and reader engagement.
          </span>
        </div>
      </div>
    </div>
  );
}