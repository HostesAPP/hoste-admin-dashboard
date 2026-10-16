"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Send,
  Image as ImageIcon,
  List,
  ListOrdered,
  Code,
  Quote,
  Minus,
  Table,
} from "lucide-react";

export default function CreateBlogPost() {
  const router = useRouter();

  return (
    <div className="bg-gray-100 p-6 min-h-screen text-slate-700 font-sans">
      {/* Header Section */}
      <div className="max-w-[1280px] mx-auto mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Create Blog Post</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Share valuable insights and updates with the Hosté community.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto bg-slate-50/50 rounded-2xl border border-slate-200 p-6 shadow-sm">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between mb-6 pb-2">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-emerald-600 font-medium">
              Blog Management
            </span>
            <span className="text-slate-400">&gt;</span>
            <span className="font-semibold text-slate-900">
              Create Blog Post
            </span>
          </div>
          {/* Top Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition">
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => router.push("/blog/preview")}
              className="px-5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition cursor-pointer"
            >
              Preview
            </button>
            <button className="px-5 py-2 text-sm font-medium text-white bg-[#1e5e3a] hover:bg-[#184c2f] rounded-lg shadow-sm transition flex items-center gap-2">
              <Send className="w-4 h-4" />
              Publish
            </button>
          </div>
        </div>

        {/* Main Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main Form Content) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Input */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Title <span className="text-amber-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter blog post title..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder-slate-400 text-slate-800 pr-16"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400">
                  0/100
                </span>
              </div>
            </div>

            {/* Image & Excerpt Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Featured Image */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col">
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Featured Image <span className="text-amber-600">*</span>
                </label>
                <div className="flex-1 border-2 border-dashed border-emerald-500/30 rounded-xl bg-emerald-50/20 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-50/40 transition">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100/50 flex items-center justify-center text-emerald-600 mb-3">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-emerald-700">
                    Click to upload image
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    Recommended size: 1200 × 630px
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Max size: 2MB (JPG, PNG, WebP)
                  </span>
                </div>
              </div>

              {/* Excerpt */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col">
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Excerpt <span className="text-amber-600">*</span>
                </label>
                <div className="relative flex-1">
                  <textarea
                    placeholder="Write a short summary of your post..."
                    className="w-full h-full min-h-[140px] px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder-slate-400 text-slate-800 resize-none pb-7"
                  ></textarea>
                  <span className="absolute right-3.5 bottom-2.5 text-xs text-slate-400">
                    0/160
                  </span>
                </div>
              </div>
            </div>

            {/* Content Editor Section */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Content <span className="text-amber-600">*</span>
              </label>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50/80 border-b border-slate-200 text-slate-600">
                  <button className="flex items-center gap-1 px-2 py-1 text-xs font-medium border border-slate-200 rounded bg-white hover:bg-slate-100">
                    Paragraph <ChevronDown className="w-3 h-3" />
                  </button>
                  <div className="h-4 w-px bg-slate-300 mx-1"></div>
                  <button className="p-1.5 hover:bg-slate-200/60 rounded font-bold text-xs">
                    B
                  </button>
                  <button className="p-1.5 hover:bg-slate-200/60 rounded italic text-xs">
                    I
                  </button>
                  <button className="p-1.5 hover:bg-slate-200/60 rounded underline text-xs">
                    U
                  </button>
                  <button className="p-1.5 hover:bg-slate-200/60 rounded line-through text-xs">
                    S
                  </button>
                  <div className="h-4 w-px bg-slate-300 mx-1"></div>
                  <button className="p-1.5 hover:bg-slate-200/60 rounded">
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 hover:bg-slate-200/60 rounded">
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <div className="h-4 w-px bg-slate-300 mx-1"></div>
                  <button className="p-1.5 hover:bg-slate-200/60 rounded">
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 hover:bg-slate-200/60 rounded">
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 hover:bg-slate-200/60 rounded">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 hover:bg-slate-200/60 rounded">
                    <Table className="w-3.5 h-3.5" />
                  </button>
                  <div className="h-4 w-px bg-slate-300 mx-1"></div>
                  <button className="p-1.5 hover:bg-slate-200/60 rounded font-serif text-xs">
                    T<sub className="text-[9px]">x</sub>
                  </button>
                </div>

                {/* Editor Textarea */}
                <div className="p-4 min-h-[180px]">
                  <p className="text-sm text-slate-400">
                    Start writing your blog post content here...
                  </p>
                </div>

                {/* Footer Status Bar */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 bg-slate-50/30 text-xs text-slate-400">
                  <span>0 words</span>
                  <span>Powered by Tiptap</span>
                </div>
              </div>
            </div>

            {/* Metadata Selectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Category <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <select className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-400 pr-8 cursor-pointer">
                    <option value="">Select a category</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Tags
                </label>
                <div className="relative">
                  <select className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-400 pr-8 cursor-pointer">
                    <option value="">Select or add tags...</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Author */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Author <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg bg-white cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-semibold">
                      N
                    </div>
                    <span className="text-sm text-slate-700 font-medium flex-1">
                      Naomi Admin
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Publish & SEO Settings) */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900">
                  Publish Settings
                </h2>
                <ChevronUp className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-4">
                <span className="block text-xs font-semibold text-slate-600">
                  Status
                </span>

                {/* Radio Options */}
                <div className="space-y-3">
                  {/* Draft Option */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      defaultChecked
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        Draft
                      </div>
                      <div className="text-xs text-slate-400">
                        Saved as draft and not visible to users.
                      </div>
                    </div>
                  </label>

                  {/* Publish Option */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        Publish
                      </div>
                      <div className="text-xs text-slate-400">
                        Make this post live and visible to everyone.
                      </div>
                    </div>
                  </label>

                  {/* Schedule Option */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        Schedule
                      </div>
                      <div className="text-xs text-slate-400">
                        Choose a future date to publish this post.
                      </div>
                    </div>
                  </label>
                </div>

                {/* Schedule Inputs */}
                <div className="pt-2">
                  <span className="block text-xs text-slate-500 mb-2">
                    Schedule For
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Select date"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Select time"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900">
                  SEO Settings
                </h2>
                <ChevronUp className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-4">
                {/* SEO Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    SEO Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter SEO title..."
                      className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none text-slate-700 pr-12"
                    />
                    <span className="absolute right-3 top-2 text-[10px] text-slate-400">
                      0/60
                    </span>
                  </div>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Meta Description
                  </label>
                  <div className="relative">
                    <textarea
                      placeholder="Enter meta description..."
                      className="w-full h-20 px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none text-slate-700 resize-none pb-5"
                    ></textarea>
                    <span className="absolute right-3 bottom-2 text-[10px] text-slate-400">
                      0/160
                    </span>
                  </div>
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Slug
                  </label>
                  <input
                    type="text"
                    placeholder="enter-slug-here"
                    className="w-full px-3 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none text-slate-700"
                  />
                  <span className="block text-[11px] text-slate-400 mt-1.5">
                    Your post URL: hoste.com/blog/
                    <span className="text-slate-500">enter-slug-here</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 text-center border border-slate-300 rounded-xl bg-white hover:bg-slate-50 transition shadow-sm">
                <div className="text-xs font-bold text-slate-800">
                  Save Draft
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Save and continue editing later
                </div>
              </button>

              <button className="p-3 text-center rounded-xl bg-[#e35314] text-white hover:bg-[#d0490f] transition shadow-sm">
                <div className="text-xs font-bold">Publish Post</div>
                <div className="text-[10px] text-orange-100 mt-0.5">
                  Make it live for everyone
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Tip Alert (Exact Match) */}
        <div className="mt-6 bg-[#fcf4e8] border border-amber-200/80 rounded-xl px-4 py-3 flex items-center gap-3 text-xs text-amber-900">
          <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
            !
          </div>
          <div className="font-medium">
            <span className="font-bold">Tip:</span> Use engaging titles and
            relevant images to increase visibility and reader engagement.
          </div>
        </div>
      </div>
    </div>
  );
}
