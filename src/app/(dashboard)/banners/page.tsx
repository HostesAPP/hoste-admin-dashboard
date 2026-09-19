"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
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
import { MOCK_BANNERS } from "@/features/banners/data/banners.data";
import { Banner, BannerPlacement } from "@/features/banners/banners.types";

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>(MOCK_BANNERS);
  const [search, setSearch] = useState("");
  const [placementFilter, setPlacementFilter] = useState<string>("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ctaText, setCtaText] = useState("Learn More");
  const [destinationUrl, setDestinationUrl] = useState("https://hoste.ng");
  const [placement, setPlacement] = useState<BannerPlacement>("Home Hero");
  const [priorityOrder, setPriorityOrder] = useState<number>(1);

  const filteredBanners = banners.filter((b) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.placement.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (placementFilter !== "All" && b.placement !== placementFilter) {
      return false;
    }

    return true;
  });

  const handleToggleActive = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const handleDelete = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newBanner: Banner = {
      id: `banner-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      ctaText: ctaText.trim(),
      destinationUrl: destinationUrl.trim(),
      placement,
      imageUrl: "/avatar-placeholder.png",
      isActive: true,
      priorityOrder,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setBanners([newBanner, ...banners]);
    setTitle("");
    setDescription("");
    setIsCreateOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Promotional Banners
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage web and mobile application hero slides, promotional announcements, and priority orders.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger className="h-9 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs cursor-pointer inline-flex items-center px-4">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>New Banner</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl border-border">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-foreground">
                Create Promotional Banner
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateBanner} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Title</label>
                <Input
                  required
                  placeholder="Banner headline..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 text-xs rounded-xl bg-background border-border"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Placement</label>
                <Select value={placement} onValueChange={(val) => val && setPlacement(val as BannerPlacement)}>
                  <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    <SelectItem value="Home Hero">Home Hero</SelectItem>
                    <SelectItem value="Bookings Header">Bookings Header</SelectItem>
                    <SelectItem value="Customer Support Pop">Customer Support Pop</SelectItem>
                    <SelectItem value="Mobile Splash">Mobile Splash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Banner subtext details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">CTA Text</label>
                  <Input
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="h-9 text-xs rounded-xl bg-background border-border"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Priority Order</label>
                  <Input
                    type="number"
                    value={priorityOrder}
                    onChange={(e) => setPriorityOrder(Number(e.target.value))}
                    className="h-9 text-xs rounded-xl bg-background border-border"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Destination URL</label>
                <Input
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  className="h-9 text-xs rounded-xl bg-background border-border"
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
                  Save Banner
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter and Cards Container */}
      <div className="bg-card border border-border/80 rounded-2xl shadow-2xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search banner headline, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl text-xs bg-background border-border/80"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {["All", "Home Hero", "Bookings Header", "Customer Support Pop", "Mobile Splash"].map((plc) => (
              <button
                key={plc}
                type="button"
                onClick={() => setPlacementFilter(plc)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  placementFilter === plc
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {plc}
              </button>
            ))}
          </div>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBanners.length === 0 ? (
            <div className="col-span-full text-center py-12 text-xs text-muted-foreground">
              No banners found.
            </div>
          ) : (
            filteredBanners.map((banner) => (
              <div
                key={banner.id}
                className={`bg-background border rounded-xl p-4 space-y-3 flex flex-col justify-between transition-colors ${
                  banner.isActive ? "border-border/80" : "border-border/40 opacity-75"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {banner.placement}
                    </Badge>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        banner.isActive
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {banner.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-foreground leading-snug">
                    {banner.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {banner.description}
                  </p>

                  <div className="pt-1 text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>CTA: <strong className="text-foreground">{banner.ctaText}</strong></span>
                    <span>Priority: #{banner.priorityOrder}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(banner.id)}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    {banner.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(banner.id)}
                    className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
