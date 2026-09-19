"use client";

import React, { useState } from "react";
import {
  Newspaper,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_BLOG_POSTS } from "@/features/blog/data/blog.data";
import { BlogPost, BlogPostStatus } from "@/features/blog/blog.types";

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>(MOCK_BLOG_POSTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Guides");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Admin Editorial");
  const [status, setStatus] = useState<BlogPostStatus>("Published");

  const filteredPosts = posts.filter((post) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        post.title.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (statusFilter !== "All" && post.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const getStatusBadge = (postStatus: BlogPostStatus) => {
    switch (postStatus) {
      case "Published":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Published</Badge>;
      case "Scheduled":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Scheduled</Badge>;
      case "Draft":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">Draft</Badge>;
      case "Archived":
        return <Badge className="bg-muted text-muted-foreground border-border">Archived</Badge>;
      default:
        return <Badge variant="outline">{postStatus}</Badge>;
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) return;

    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      category,
      excerpt: excerpt.trim(),
      content: content.trim(),
      author,
      tags: ["Hosté Blog"],
      status,
      publishedAt: status === "Published" ? new Date().toISOString().split("T")[0] : undefined,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setPosts([newPost, ...posts]);
    setTitle("");
    setExcerpt("");
    setContent("");
    setIsCreateOpen(false);
  };

  const handleDeletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Blog Content Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Publish, edit, schedule, and organize hosté platform articles and news updates.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger className="h-9 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs cursor-pointer inline-flex items-center px-4">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>Create Article</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-2xl border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-foreground">
                Create New Blog Article
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePost} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Title</label>
                <Input
                  required
                  placeholder="Article title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 text-xs rounded-xl bg-background border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Category</label>
                  <Select value={category} onValueChange={(val) => val && setCategory(val)}>
                    <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                      <SelectItem value="Guides">Guides</SelectItem>
                      <SelectItem value="Industry News">Industry News</SelectItem>
                      <SelectItem value="Spotlight">Spotlight</SelectItem>
                      <SelectItem value="Announcements">Announcements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Status</label>
                  <Select value={status} onValueChange={(val) => val && setStatus(val as BlogPostStatus)}>
                    <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Excerpt</label>
                <Input
                  required
                  placeholder="Short summary..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="h-9 text-xs rounded-xl bg-background border-border"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Content Body</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Write full article markdown or text..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="h-9 px-4 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-9 px-5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground">
                  Save Article
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Container */}
      <div className="bg-card border border-border/80 rounded-2xl shadow-2xs p-5 space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search articles, author, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl text-xs bg-background border-border/80"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {["All", "Published", "Draft", "Scheduled", "Archived"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-xs text-muted-foreground">
              No blog posts found matching criteria.
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-background border border-border/80 rounded-xl p-4 space-y-3 flex flex-col justify-between hover:border-primary/40 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {post.category}
                    </Badge>
                    {getStatusBadge(post.status)}
                  </div>

                  <h3 className="font-bold text-sm text-foreground leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                  <div>
                    By <span className="font-semibold text-foreground">{post.author}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
